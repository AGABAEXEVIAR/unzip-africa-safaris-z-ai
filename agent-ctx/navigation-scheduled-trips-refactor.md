# Work Record — Navigation + Scheduled Trips Refactor

## Summary
Refactored the luxury safari site navigation and added a dedicated Scheduled Trips page. Moved the Philosophy section from HomePage into AboutPage, and re-organized both the desktop and mobile nav menus and footer links to match the new structure.

## Files Modified
1. `src/components/luxury/Navigation.tsx` — Reworked desktop and mobile nav.
2. `src/app/page.tsx` — Added `company` and `scheduled-trips` routes.
3. `src/components/pages/ScheduledTripsPage.tsx` — New page (filter + sort + grid + CTA).
4. `src/components/pages/HomePage.tsx` — Removed Philosophy/NARRATIVE INTRO section.
5. `src/components/pages/AboutPage.tsx` — Added Philosophy section after "Our Story".
6. `src/components/luxury/Footer.tsx` — Updated navigate-column links.

## New Navigation Structure
- Desktop: Home | About ▾ (Company + Accommodation) | Destinations ▾ | Tours | Scheduled Trips | Contact
- Mobile menu mirrors the same order with About sub-items nested under the "02 · About" header.

## Routing
- `about` and `company` both render `<AboutPage />` (alias for backward compatibility).
- `scheduled-trips` renders `<ScheduledTripsPage />`.
- `scheduled-trip-detail` unchanged (still uses `navigateToScheduledTrip`).

## ScheduledTripsPage Design
- Hero: "Scheduled Trips" heading + subtitle, parallax bg.
- Filters: Destination checkboxes, Price slider, Duration slider, Trip Type checkboxes (uses `accommodationLevel`).
- Sort: Recommended (closest upcoming departure first), Price Low-High, Price High-Low, Duration.
- Cards: image with "Departs {date}" badge (left), discount % badge (right, if `priceOriginal`), "Only N spots" urgency badge (bottom-right when `spotsLeft ≤ 5`), destination eyebrow, duration + group size metadata, description, price, "Explore" button → `navigateToScheduledTrip(trip.id)`.
- "What's Included" band on forest bg (mirrors ToursPage pattern).
- CTA with "Request a Quote" + "View All Tours" secondary link.

## Color & Typography Conformance
- All new components use `const sharp = { borderRadius: 0 } as const;`.
- Headings use `fontFamily: "var(--font-cormorant), serif"` where appropriate.
- Color palette: charcoal, forest, forest-deep, cream, gold, gold-soft, alabaster, canvas — all referenced via existing Tailwind tokens. No blue/indigo.

## Validation
- `npx tsc --noEmit` — no new errors from changed files (only pre-existing errors in unrelated files like ScrollReveal.tsx, ContactPage.tsx, websocket examples).
- `npx eslint` on the 6 changed files — clean, no warnings/errors.
- Dev server compiled successfully and served `GET / 200`.

## Commit
- `feat: About dropdown (Company+Accommodation), Scheduled Trips page, Philosophy moved to About`
