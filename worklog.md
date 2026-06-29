
---
Task ID: hero-video-update
Agent: main
Task: Replace HomePage hero with Hero32-inspired design featuring safari animal video background and no border radius on buttons.

Work Log:
- Installed `motion` package (motion@12.42.0) for `motion/react` imports
- Created `/src/components/luxury/SafariHero.tsx` adapting the Hero32 design to Unzip Africa's luxury palette (cream/forest/gold/charcoal instead of sky blue)
- Adapted the spring motion variants from the brief (nav drop-in, title majestic rise, subtitle quick fade, CTA scale-up) plus added an eyebrow element
- Removed `rounded-full` from all buttons — verified all buttons compute to `borderRadius: 0px` (logo, nav items, Request a Quote, Begin Your Journey, Play button)
- Adapted typography to Cormorant Garamond (serif) for the title + Inter (sans) for nav/labels
- Replaced the static background image with a `<video>` element using safari animal footage
- Tried external CDNs (Pexels, Pixabay, Mixkit, Coverr) — all returned 403 in the sandbox
- Downloaded two safari videos from Wikimedia Commons (CC-BY-SA) to `/public/videos/`:
  - `affectionate-lions.webm` (3.9MB, 1920x1080, 28s) — primary
  - `elephant-rumbling.webm` (5.0MB, 1920x1080) — fallback
- Implemented multi-source fallback logic with 8s timeout (if first source doesn't reach readyState 2 within 8s, try next)
- Kept the Unsplash savanna image as poster fallback (visible until video loads, fades out smoothly via opacity transition)
- Updated Navigation component to hide the standard sticky nav when on home page top (so the SafariHero pill nav takes center stage), then fade in once user scrolls past 75vh
- Replaced the old parallax hero in HomePage.tsx with `<SafariHero />`
- All other HomePage sections (narrative intro, destinations filmstrip, parallax quote, expert carousel, testimonials, final CTA) remain intact

Stage Summary:
- New hero: cinematic safari video background (lions) with spring-animated pill nav, eyebrow, serif title with italic gold-soft accent, subtitle, primary CTA + play button — all with NO border radius
- Video verified loading and playing: readyState 4, paused false, 1920x1080
- All buttons verified borderRadius: 0px across desktop and mobile
- Mobile responsive: nav items hidden on small screens (matching original Hero32 design), only logo + Request a Quote button show
- Standard sticky nav appears after scrolling past 75vh on home, allowing seamless transition to the rest of the site
- ESLint passes with zero warnings/errors
- Agent Browser verified: video plays, nav navigates, CTA opens quote modal, play button navigates to Tours
