# ServiceFlow SA: Implementation Plan

Build approach: PRD → Stitch designs → this plan → phase-by-phase build with TDD
→ deploy. Every task is a GitHub Issue → branch → PR → CI green → 1 approval →
merge. Commits are small and written in the imperative ("Add services form").

## Working agreements
- Branch names: `feat/<short-name>`, `fix/<short-name>`, `docs/<short-name>`
- PRs say "Closes #<issue>" and must pass lint, typecheck, tests and build
- Tests are written first for logic-heavy code (slot generation, validation, RLS)
- No secrets in the repo: Supabase keys go in `.env.local` and GitHub/Vercel secrets

## Phases
| # | Phase | Outcome | Target |
|---|---|---|---|
| 0 | Setup and CI | Repo, scaffold, CI, branch protection, docs | Mon 10:00 |
| 1 | Frontend shell and design system | Tailwind tokens from Stitch, layout, routing, landing page, UI components (mock data) | Mon 15:30 |
| 2 | Database and RLS | Supabase project, migrations, double-booking constraint, RLS, seed users | Tue 10:00 |
| 3 | Auth and roles | Signup/login/logout, role on signup, protected routes | Tue 10:00 |
| 4 | Provider features | Profile, services CRUD, availability, booking requests dashboard | Tue 15:30 |
| 5 | Customer booking flow | Browse, provider page, slot picker, book, My bookings | Wed 10:00 |
| 6 | Admin, quality and polish | Admin verify/suspend, states, responsive QA, RLS + component tests | Wed 10:00 |
| 7 | Deploy and submit | Live link, README, screenshots, test logins, Loom, portfolio | Wed 15:30 |

## Order of work and dependencies
1. Phase 1 can use mock data, so it doesn't wait for the database.
2. Phase 2 (schema + RLS) must land before Phases 3 to 5.
3. Phase 3 (auth) unblocks everything role-specific.
4. Phase 4 before 5, because customers need providers, services and availability.
5. Deploy early (Tue 15:30) and redeploy after every merge so problems surface early.

## Risks and mitigations
| Risk | Mitigation |
|---|---|
| Slot logic bugs (timezones, overlaps) | Store UTC, display SAST; unit-test slot generation first |
| RLS policy mistakes | Write RLS tests with two customers and two providers |
| Time pressure | Must features first; admin and extras are Should/Could |
| Lone developer vs approval rule | Agree a reviewer today |