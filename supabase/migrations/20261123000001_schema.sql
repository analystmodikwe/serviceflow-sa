-- Needed so a GiST exclusion constraint can compare uuids with "="
create extension if not exists btree_gist;

create type public.user_role as enum ('customer', 'provider', 'admin');
create type public.provider_status as enum ('active', 'suspended');
create type public.booking_status as enum ('pending', 'confirmed', 'declined', 'cancelled', 'completed');

-- One profile per auth user; role decides what the user can do
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'customer',
  full_name text not null default '',
  phone text,
  created_at timestamptz not null default now()
);

create table public.providers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  business_name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category text not null,
  bio text not null default '',
  status public.provider_status not null default 'active',
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers(id) on delete cascade,
  name text not null,
  price_cents integer not null check (price_cents > 0),
  duration_min integer not null check (duration_min > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Weekly working hours: weekday 0 = Sunday ... 6 = Saturday
create table public.availability (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  check (start_time < end_time),
  unique (provider_id, weekday)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  provider_id uuid not null references public.providers(id) on delete cascade,
  service_id uuid not null references public.services(id),
  start_at timestamptz not null,
  end_at timestamptz not null,
  status public.booking_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  check (start_at < end_at),
  -- No two pending/confirmed bookings may overlap for the same provider
  constraint bookings_no_overlap exclude using gist (
    provider_id with =,
    tstzrange(start_at, end_at) with &&
  ) where (status in ('pending', 'confirmed'))
);

-- Create a profile whenever someone signs up. Only 'customer' or 'provider' can
-- come from signup; admin is never taken from user-supplied data.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    case when new.raw_user_meta_data->>'role' = 'provider'
         then 'provider'::public.user_role
         else 'customer'::public.user_role end,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- The server decides when a booking ends (start + service duration),
-- so the client can't fake it
create or replace function public.set_booking_end()
returns trigger language plpgsql as $$
begin
  new.end_at := new.start_at + make_interval(
    mins => (select duration_min from public.services where id = new.service_id)
  );
  return new;
end;
$$;

create trigger bookings_set_end
  before insert on public.bookings
  for each row execute function public.set_booking_end();
