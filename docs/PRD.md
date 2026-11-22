# ServiceFlow SA: Product Requirements Document

## 1. Overview
ServiceFlow SA is a web app where independent service providers publish their
services and availability, and clients book open slots. See `BUSINESS.md` for
the problem, customer and business model.

**Goal of the MVP:** a provider can sign up, list services, set availability and
share a link; a customer can book an open slot; the system never double-books.

## 2. Users and roles
| Role | Who | Can do |
|---|---|---|
| Customer | Client booking a service | Browse providers, book, view and cancel own bookings |
| Provider | Barber, braider, nail tech, etc. | Manage own services and availability, confirm/cancel bookings for own business |
| Admin | Platform owner | View all providers and bookings, verify or suspend providers |

- Customer and provider are chosen at signup. **Admin is never selectable at
  signup**; it is assigned directly in the database.

## 3. Features (MoSCoW)

### Must
1. **Auth:** email and password signup/login/logout with role chosen at signup.
2. **Provider profile:** business name, bio, category, contact number and a
   unique public slug (`/p/:slug`).
3. **Services:** provider creates, edits and deactivates services
   (name, price in ZAR, duration in minutes).
4. **Availability:** provider sets weekly working hours per weekday.
5. **Browse and search:** customer lists providers and filters by category.
6. **Booking:** customer picks a service, date and an open slot, and books.
   Slots are generated from availability minus existing bookings.
7. **No double-booking:** enforced in the database, not just the UI.
8. **Booking management:** provider confirms or declines bookings;
   customer and provider can cancel; statuses are
   `pending → confirmed | declined | cancelled | completed`.
9. **Dashboards:** customer sees "My bookings"; provider sees upcoming bookings
   and their services.
10. **Permissions (RLS):** users only read and write what their role allows
    (see section 6).

### Should
- Admin dashboard: list providers, verify or suspend them.
- "Verified" badge on provider profiles.
- Shareable booking link and copy button on the provider dashboard.
- Mark booking as completed.

### Could
- Email or WhatsApp reminders, reviews and ratings, earnings summary,
  provider photos.

### Won't (this release)
- Online payments or deposits, maps, real-time chat, native mobile apps,
  staff accounts under one provider.

## 4. Key user flows
**Provider:** sign up → create profile → add services → set availability →
share link → confirm incoming bookings.
**Customer:** sign up → browse or open a provider link → choose service →
choose slot → booking created as `pending` → track status in "My bookings".

## 5. Data model (Postgres)
- `profiles` (id → auth.users, role, full_name, phone)
- `providers` (id, profile_id, business_name, slug, category, bio, status)
- `services` (id, provider_id, name, price_cents, duration_min, is_active)
- `availability` (id, provider_id, weekday, start_time, end_time)
- `bookings` (id, customer_id, provider_id, service_id, start_at, end_at,
  status, notes)

**Double-booking rule:** an exclusion constraint on `bookings` using a
`tstzrange(start_at, end_at)` per provider, applied to pending and confirmed
bookings (requires the `btree_gist` extension).

## 6. Permission rules (enforced with RLS)
| Table | Customer | Provider | Admin |
|---|---|---|---|
| profiles | read/update own | read/update own | read all |
| providers | read active | read/update own | read/update all |
| services | read active | CRUD own | read all |
| availability | read | CRUD own | read all |
| bookings | create; read/cancel own | read/update bookings for own business | read all |

Role and ownership checks live in RLS policies; the frontend is not trusted.

## 7. Non-functional requirements
- Responsive: usable at 375px mobile and desktop widths.
- Matches the Stitch designs in `docs/designs/`.
- Inputs validated on client and database (price > 0, duration > 0,
  start before end).
- Loading, empty and error states on every data screen.
- Timestamps stored in UTC and displayed in SAST.

## 8. Tech stack
React + TypeScript (Vite), Tailwind CSS, Supabase (Postgres, Auth, RLS),
Vitest + React Testing Library, GitHub Actions CI (lint, typecheck, test,
build), deployed on Vercel.

## 9. Testing and CI
- Unit tests: slot generation, validation helpers.
- Component tests: login, booking form, provider service form.
- RLS/policy tests: a customer cannot read another customer's bookings; a
  provider cannot edit another provider's services.
- CI on every PR: lint, typecheck, test, build.

## 10. Success criteria (demo-ready)
- A new provider and a new customer can complete the full flow on the live link
  with real data.
- Two customers cannot book the same slot.
- Test logins documented in the README (one customer, one provider, one admin).

## 11. Milestones
| When | Target |
|---|---|
| Mon 23 Nov 10:00 | Repo, BUSINESS.md, PRD, Stitch designs |
| Mon 23 Nov 15:30 | Implementation plan, Issues, frontend started |
| Tue 24 Nov 10:00 | DB, migrations, auth and roles, CI |
| Tue 24 Nov 15:30 | Deployed, first Must features live |
| Wed 25 Nov 10:00 | All Must features live, tests passing |
| Wed 25 Nov 15:30 | Final submission |