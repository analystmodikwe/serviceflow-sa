# ServiceFlow SA — Changelog

All notable changes to this project are documented here.

---

## [Unreleased]

---

## 2026-11-25

### fix(contrast) — PR #52 · `fix/contrast-dark-bg-text`

**Files:** `src/pages/LandingPage.tsx`, `src/components/layout/DashboardLayout.tsx`

Fixed all dark-on-dark text across the app by overriding the global `h1–h6 { color: var(--color-brand-600) }` base rule (defined in `src/index.css`) that was silently beating Tailwind utility classes.

| Location | Element | Before | After |
|---|---|---|---|
| Landing — provider band | `h2` headline | dim teal (global override) | `!text-white` (#fff) |
| Landing — provider band | `h3` benefit titles ×3 | dim teal (global override) | `!text-white` (#fff) |
| Landing — provider band | `p` body / benefit copy | `text-brand-100` / `text-white/75` | `text-white` (#fff) |
| Landing — provider band | section background | `bg-brand-700` | `bg-brand-900` (deeper contrast) |
| Sidebar (all roles) | `h1` role label | global override → dim navy | `!text-white` (#fff) |
| Sidebar (all roles) | `p` profile name | `text-brand-100` | `text-white` (#fff) |

---

## 2026-11-24

### feat(landing) — PR · `feat/landing-page` · Closes #6

**Files:** `src/pages/LandingPage.tsx` *(new)*, `src/pages/LandingPage.test.tsx` *(new)*, `src/App.tsx`, `src/App.test.tsx`, `src/pages/BrowsePage.tsx`

Built the real landing page at `/` to replace the "Coming soon" placeholder.

#### Implemented as specified
- **Hero:** headline, sub-copy, "Find a provider" (amber → `/browse`), "I'm a provider" / "Go to your dashboard" (role-aware via `homePathForRole`).
- **Featured providers:** real `listProviders()` call, skeleton while loading, brand icon illustration fallback if none found. No fake providers.
- **How it works:** 3 steps with inline SVG icons (no packages).
- **Categories:** 5 cards (Barbers, Braiders, Nail techs, Car wash, Other) linking to `/browse?category=...`.
- **Provider band:** navy background, benefits, "Create your provider profile" CTA.
- **Final CTA:** "Ready to book?" + Find a provider button.
- Tests: 2 component tests covering signed-out and signed-in states.

#### Deviations from the PRD / implementation plan

| # | Area | Specified | What was built | Reason |
|---|---|---|---|---|
| 1 | `BrowsePage` category filter | Not specified (pre-existing page) | Added `?category=` query-param support via lazy `useState` initialiser so landing category links pre-populate the chip filter | Required to make the category cards useful; no behaviour change when arriving without a param |
| 2 | Category chip URL sync | Not specified | Chips update **local state only** (not the URL); only the initial URL param is read | Avoids the `react-hooks/set-state-in-effect` lint violation that a `useEffect`-based sync would cause |
| 3 | Provider band background | Spec said "navy background" | Used `bg-brand-700` initially, later corrected to `bg-brand-900` in the contrast fix | `brand-900` (`#07182A`) gives deeper contrast; both satisfy "navy" |

---

### feat(availability-dashboard) — `feat/provider-availability-dashboard` · Closes #17, #18

Provider availability editor and provider dashboard.

---

### feat(customer-booking-flow) — `feat/customer-booking-flow` · Closes #19–#23

Customer booking flow: browse, provider page, slot picker, booking confirmation, my-bookings.

---

### feat(rls-tests) — `feat/rls-tests` · Closes #26

Automated RLS integration tests against the hosted Supabase project using the public anon key.
