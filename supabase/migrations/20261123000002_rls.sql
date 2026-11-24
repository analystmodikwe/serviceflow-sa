-- Helper functions. SECURITY DEFINER lets policies call them without recursion.
create or replace function public.has_role(r public.user_role)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = r);
$$;

create or replace function public.owns_provider(pid uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.providers where id = pid and profile_id = auth.uid());
$$;

-- Table privileges; RLS below decides which rows are visible
grant usage on schema public to anon, authenticated;
grant select on public.providers, public.services, public.availability to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
-- Users may only edit their name and phone, never their role
revoke update on public.profiles from anon, authenticated;
grant update (full_name, phone) on public.profiles to authenticated;

alter table public.profiles enable row level security;
alter table public.providers enable row level security;
alter table public.services enable row level security;
alter table public.availability enable row level security;
alter table public.bookings enable row level security;

-- profiles: own row, admin sees all, providers see customers who booked them
create policy profiles_select on public.profiles for select using (
  id = auth.uid()
  or public.has_role('admin')
  or exists (
    select 1 from public.bookings b
    join public.providers p on p.id = b.provider_id
    where b.customer_id = profiles.id and p.profile_id = auth.uid()
  )
);
create policy profiles_update on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- providers: public can read active ones; owners and admin see their own
create policy providers_select on public.providers for select using (
  status = 'active' or profile_id = auth.uid() or public.has_role('admin')
);
create policy providers_insert on public.providers for insert to authenticated
  with check (
    profile_id = auth.uid() and public.has_role('provider')
    and status = 'active' and is_verified = false
  );
create policy providers_update on public.providers for update to authenticated
  using (profile_id = auth.uid() or public.has_role('admin'))
  with check (profile_id = auth.uid() or public.has_role('admin'));

-- Only an admin may change status or verification (RLS can't do column rules)
create or replace function public.protect_provider_fields()
returns trigger language plpgsql as $$
begin
  if auth.uid() is not null and not public.has_role('admin')
     and (new.status is distinct from old.status
          or new.is_verified is distinct from old.is_verified
          or new.profile_id is distinct from old.profile_id) then
    raise exception 'Only an admin can change status or verification';
  end if;
  return new;
end;
$$;
create trigger providers_protect before update on public.providers
  for each row execute function public.protect_provider_fields();

-- services: public reads active ones of active providers; owner manages their own
create policy services_select on public.services for select using (
  public.owns_provider(provider_id) or public.has_role('admin')
  or (is_active and exists (
    select 1 from public.providers p
    where p.id = services.provider_id and p.status = 'active'))
);
create policy services_insert on public.services for insert to authenticated
  with check (public.owns_provider(provider_id));
create policy services_update on public.services for update to authenticated
  using (public.owns_provider(provider_id)) with check (public.owns_provider(provider_id));

-- availability: readable by anyone; owner manages their own
create policy availability_select on public.availability for select using (true);
create policy availability_insert on public.availability for insert to authenticated
  with check (public.owns_provider(provider_id));
create policy availability_update on public.availability for update to authenticated
  using (public.owns_provider(provider_id)) with check (public.owns_provider(provider_id));
create policy availability_delete on public.availability for delete to authenticated
  using (public.owns_provider(provider_id));

-- bookings: customer sees own, provider sees their business's, admin sees all
create policy bookings_select on public.bookings for select to authenticated using (
  customer_id = auth.uid() or public.owns_provider(provider_id) or public.has_role('admin')
);
create policy bookings_insert on public.bookings for insert to authenticated with check (
  customer_id = auth.uid()
  and status = 'pending'
  and start_at > now()
  and public.has_role('customer')
  and exists (
    select 1 from public.services s
    join public.providers p on p.id = s.provider_id
    where s.id = bookings.service_id and s.provider_id = bookings.provider_id
      and s.is_active and p.status = 'active'
  )
);
create policy bookings_update on public.bookings for update to authenticated
  using (customer_id = auth.uid() or public.owns_provider(provider_id))
  with check (customer_id = auth.uid() or public.owns_provider(provider_id));

-- Only the status may change, and only along allowed transitions
create or replace function public.enforce_booking_update()
returns trigger language plpgsql as $$
begin
  if auth.uid() is null then return new; end if;  -- dashboard / service role
  if new.customer_id <> old.customer_id or new.provider_id <> old.provider_id
     or new.service_id <> old.service_id or new.start_at <> old.start_at
     or new.end_at <> old.end_at then
    raise exception 'Only the booking status can be changed';
  end if;
  if new.status = old.status then return new; end if;
  if public.owns_provider(old.provider_id) and (
       (old.status = 'pending' and new.status in ('confirmed', 'declined', 'cancelled'))
    or (old.status = 'confirmed' and new.status in ('cancelled', 'completed'))) then
    return new;
  end if;
  if old.customer_id = auth.uid() and old.status in ('pending', 'confirmed')
     and new.status = 'cancelled' then
    return new;
  end if;
  raise exception 'Invalid status change from % to %', old.status, new.status;
end;
$$;
create trigger bookings_enforce_update before update on public.bookings
  for each row execute function public.enforce_booking_update();

-- Customers need to see which slots are taken without seeing other people's
-- bookings, so this function returns only the busy time ranges
create or replace function public.get_busy_slots(
  p_provider_id uuid, p_from timestamptz, p_to timestamptz)
returns table (start_at timestamptz, end_at timestamptz)
language sql security definer stable set search_path = public as $$
  select b.start_at, b.end_at from public.bookings b
  where b.provider_id = p_provider_id
    and b.status in ('pending', 'confirmed')
    and b.start_at < p_to and b.end_at > p_from;
$$;
grant execute on function public.get_busy_slots(uuid, timestamptz, timestamptz) to anon, authenticated;
