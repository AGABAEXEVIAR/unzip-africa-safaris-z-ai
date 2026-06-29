
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

---
Task ID: scroll-reveal-fliptext-testimonials-logo
Agent: main
Task: Implement ScrollReveal effect on all words, FlipText for hero title, new Testimonials component, replace safari video, use uploaded logo as favicon + nav logo

Work Log:
- Installed gsap@3.15.0, react-icons@5.6.0, embla-carousel-autoplay@8.6.0
- Copied uploaded "Add a heading (2).png" to /public/logo.png (300x150 RGBA)
- Downloaded "Blue Wildebeests coming to drink" video from Wikimedia Commons to /public/videos/wildebeest-drinking.webm (16.7MB, 1920x1080, 19.6s) — replaced the lions video
- Created /src/components/luxury/ScrollReveal.tsx — GSAP + ScrollTrigger based word-by-word reveal with blur + rotation, adapted from the provided magicui-style component to support ReactNode children with italic spans
- Created /src/components/luxury/FlipText.tsx — exactly as provided, with character-by-character 3D Y-axis flip animation
- Added flipCharY @keyframes + .flip-char animation CSS to globals.css (rotateY 0→360deg with translateY drift, uses --flip-duration/--flip-delay/--flip-iteration CSS variables)
- Updated SafariHero: title now uses two FlipText components (Luxury Safaris Across + italic gold Uganda, Kenya & Tanzania), video source changed to wildebeest-drinking.webm primary
- Created /src/components/luxury/LuxuryTestimonials.tsx — adapted the Testimonials4 design to luxury palette (forest-deep bg, cream text, gold accents) with 8 safari guest testimonials, vertical embla carousel with autoplay, gradient fades top/bottom
- Replaced old Testimonials component in HomePage with LuxuryTestimonials; removed the now-unused old function
- Applied ScrollReveal to key headings across all 5 pages:
  - Home: narrative intro paragraph, destinations heading, parallax quote, expert carousel heading, final CTA heading
  - About: heritage story paragraph, three commitments heading, experts heading, milestones heading, CTA heading
  - Tours: itinerary heading, final CTA heading
  - Accommodation: intro paragraph, philosophy heading, CTA heading
  - Contact: "Reach us" heading, offices heading, CTA heading
- Updated layout.tsx: added metadataBase, set icons.icon/shortcut/apple + openGraph.images + twitter.images to /logo.png
- Updated Navigation: replaced text logo (Unzip/Africa/Safaris) with the uploaded logo.png image, with filter brightness(0) invert(1) when over dark hero (transparent state) and filter: none when scrolled (cream bg)
- Updated Footer: replaced text wordmark with logo.png image (white via brightness(0) invert(1) filter)

Stage Summary:
- ScrollReveal verified working: 37 words in Home narrative, 51 words in About heritage story, all with .word spans, opacity transitions from 0.1→1 and blur from 5px→0px as user scrolls
- FlipText verified working: 40 flip-char spans in hero, animationName=flipCharY, duration 2.4s, delay 0.6s/1.2s, iteration infinite — characters continuously flip on Y-axis
- New wildebeest video verified playing (readyState 4, paused false)
- Testimonials carousel verified: 8 testimonials with avatars + Quote icons, vertical orientation, autoplay
- Logo image verified in nav (300x150 natural, brightness(0) invert(1) filter for white over dark hero)
- Favicon verified: /logo.png
- ESLint passes with zero warnings/errors
