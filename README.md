<img src="public/brand/logo-horizontal.png" alt="ServiceFlow SA" width="420">

# ServiceFlow SA

> ServiceFlow SA gives independent service providers a simple booking link so
> clients can book instantly, and providers stop losing money to double-bookings,
> no-shows and buried WhatsApp messages.

| | |
|---|---|
| **Live app** | [https://serviceflow-sa.vercel.app/](https://serviceflow-sa.vercel.app/) |
| **Stitch designs** | [View the designs](https://stitch.google.com/projects/15248736337446016447) |
| **Business case** | [BUSINESS.md](./BUSINESS.md) |
| **PRD** | [docs/PRD.md](./docs/PRD.md) |
| **Implementation plan** | [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) |

## The problem

Independent barbers, braiders, nail techs and mobile service providers in South
Africa take most bookings through WhatsApp chats, phone calls and paper diaries.
That leads to double-bookings, no-shows and hours of back-and-forth about prices
and availability. Clients can't see when a provider is free without messaging
them. Read the full business case in [BUSINESS.md](./BUSINESS.md).

## What it does

- **Providers** create a profile, list services (price and duration), set weekly
  availability and share one booking link. They confirm or decline requests from
  a dashboard.
- **Customers** browse providers, pick a service and an open time slot, and book.
  They track and cancel their own bookings.
- **Admins** verify or suspend providers.
- **No double-booking:** overlapping bookings for the same provider are rejected
  by a database constraint, not just the UI.

### Roles and permissions

| Role | Can do |
|---|---|
| Customer | Browse providers, book, view and cancel own bookings |
| Provider | Manage own profile, services and availability; confirm or decline bookings for own business |
| Admin | View all providers and bookings; verify or suspend providers |

Permissions are enforced in the database with Supabase Row Level Security (RLS).
The frontend is not trusted. Admin is never selectable at signup; it is assigned
directly in the database.

## Frontend routes

The app shell currently renders placeholders for these route groups:

| Area | Routes |
|---|---|
| Public | `/`, `/browse`, `/p/:slug`, `/login`, `/signup`, `/booking-confirmed` |
| Customer | `/my-bookings` |
| Provider | `/provider`, `/provider/services`, `/provider/availability`, `/provider/profile` |
| Admin | `/admin` |

Unknown routes show a not-found page. Dashboard routes use a sidebar on desktop
and a fixed bottom tab bar on mobile.

## Screenshots

_Added once the screens are built on the live link._

## Test logins

_Added once the database is seeded (one customer, one provider and one admin)._

| Role | Email | Password |
|---|---|---|
| Customer | _TBA_ | _TBA_ |
| Provider | _TBA_ | _TBA_ |
| Admin | _TBA_ | _TBA_ |

## Tech stack

| Area | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Backend and database | Supabase (Postgres, Auth, Row Level Security) |
| Testing | Vitest, React Testing Library |
| CI | GitHub Actions (lint, typecheck, test, build) |
| Hosting | Vercel |
| Design | Stitch |

## Architecture

```text
 Browser (React + TypeScript SPA)
        |
        |  Supabase JS client (anon key + user session)
        v
 Supabase
   |- Auth      -> signup / login, JWT session
   |- Postgres  -> profiles, providers, services, availability, bookings
   |- RLS       -> role and ownership rules on every table
   '- Constraint-> no overlapping bookings per provider
```

Data model: `profiles`, `providers`, `services`, `availability`, `bookings`.
See section 5 of the [PRD](./docs/PRD.md).

## Run it locally

**Requirements:** Node.js 22 or newer, npm, and a Supabase project.

```bash
# 1. Clone the repo and install dependencies
git clone https://github.com/analystmodikwe/serviceflow-sa.git
cd serviceflow-sa
npm install

# 2. Add your Supabase keys (never commit this file)
cp .env.example .env.local
# then edit .env.local:
#   VITE_SUPABASE_URL=<your project url>
#   VITE_SUPABASE_ANON_KEY=<your anon key>

# 3. Start the dev server
npm run dev
```

_The `.env.example` file and database migrations are added in Phase 2._

## Run the tests and checks

```bash
npm test            # unit and component tests (Vitest)
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm run build       # production build
```

The same four checks run in CI on every pull request.

## How the project is built

This is a solo project built the way the course teaches:
PRD, then Stitch designs, then an implementation plan, then a phase-by-phase
build, then deploy.

- Work is tracked as **GitHub Issues**, grouped into milestones by phase.
- Every change goes **Issue, branch, pull request, merge**, with small, clear commits.
- `main` is protected: no direct pushes, and a pull request needs a passing
  `ci` check before it can merge.

## Project status

| Phase | Status |
|---|---|
| 0. Setup and CI | Done |
| 1. Frontend shell and design system | In progress |
| 2. Database and RLS | Planned |
| 3. Auth and roles | Planned |
| 4. Provider features | Planned |
| 5. Customer booking flow | Planned |
| 6. Admin, tests and polish | Planned |
| 7. Deploy and submit | Planned |

## Known issues

_None recorded yet. Items are added here as they are found._

## Author

Built by **Lesedi**, an AI full-stack developer.
[GitHub](https://github.com/analystmodikwe)