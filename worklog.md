
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

---
Task ID: tours-redesign-faq-whatsapp-cookie-etc
Agent: main
Task: Multiple home/tours/footer changes including Tours page redesign with filters, FAQ, Why Choose Us, WhatsApp chatbot, GDPR cookie consent, testimonials infinite scroll, footer fixes

Work Log:
- Removed FlipText animation from hero title (reverted to static text)
- Converted testimonials from embla carousel to CSS-based vertical infinite marquee scroll (60s linear infinite, pause on hover, 8 testimonials doubled for seamless loop)
- Philosophy section: changed "Our Philosophy" from small eyebrow to large h2 (text-3xl/4xl), added curly quotes around "No two journeys are alike", made it smaller than the heading
- Request a Quote button in nav: added 1px solid border with no border radius, adaptive colors (cream border over dark hero, charcoal border when scrolled)
- Created WhatsAppChatbot component: sticky bottom-right, #25D366 green button with three concentric wavy pulse rings (staggered 0.8s apart), vigorous icon wiggle animation (rotates -12° to +12° every 3s, continuous on hover), expandable chat preview bubble with "Start Chat" CTA linking to https://wa.me/256706761092
- Created CookieConsent component: GDPR banner with Accept/Deny buttons, stores choice in localStorage, slides up from bottom, uses queueMicrotask pattern to avoid setState-in-effect lint rule
- Added WhatsAppChatbot + CookieConsent to main page.tsx
- Created FAQSection: 8 safari-specific FAQs with accordion (expand/collapse, gold + icon rotates to ×)
- Created WhyChooseUsSection: 6 reasons with numbered display (01-06), custom SVG icons, hover effects
- Added both sections to HomePage between Testimonials and Final CTA
- Footer fixes: made Inquiries section layout parallel to Navigate/Offices (removed extra pt-2 spacing), pushed UNZIP AFRICA wordmark down (-bottom-32 instead of -bottom-6) so it doesn't overlap the copyright row, removed "Conservation Pledge" link
- Expanded tourPackages data from 3 to 13 tours with new filterable fields (destination, activities, tripType, accommodationLevel, nationalPark, durationDays, priceFrom, minAge, featured, priceOriginal for discounts)
- Completely rewrote ToursPage with filter sidebar design per reference screenshot:
  • Left sidebar: "Filter By" with 7 expandable sections (Destination checkboxes, Price range slider, Duration range slider, Activities checkboxes, Trip Types, Accommodation Level, National Parks)
  • Right: tour cards grid (3 columns on desktop, responsive) with image, Featured/Discount badges, title, metadata (duration/age/location), activity tags, price with strikethrough for discounts, Details + Book Now buttons
  • Sort dropdown (Recommended/Price Low-High/High-Low/Duration)
  • Result count
  • Mobile filter toggle with slide-in panel
  • Tour detail modal with full highlights, activities, pricing, Book This Journey CTA
  • "What's Included" band + final CTA preserved

Stage Summary:
- All 12 requested changes implemented and verified via Agent Browser
- Hero title static (0 flip-chars), philosophy heading 36px vs 11px subtitle with quotes, RAQ button bordered with 0px radius
- WhatsApp button links to wa.me/256706761092 with prefilled message, cookie consent stores choice in localStorage
- Tours page: 13 tours, 7 filter sections, 3-column card grid, sort dropdown, detail modal — filtering verified (Uganda filter shows 3 tours)
- Testimonials: CSS marquee with testimonialsScroll animation, 60s infinite, 16 items
- FAQ: 8 questions with accordion, Why Choose Us: 6 numbered reasons
- Footer: Conservation Pledge removed, Inquiries parallel to Offices, UNZIP AFRICA wordmark pushed below footer bottom
- ESLint passes with zero warnings/errors

---
Task ID: whatsapp-colors-scrollstack-testimonials-speed-milestones-footer
Agent: main
Task: Change WhatsApp colors to website palette, add ScrollStack section, increase testimonials speed, move Why Choose Us, alternate milestones, fix footer wordmark + inquiries layout

Work Log:
- WhatsApp chatbot: replaced all #25D366 (bright green) with website palette — button bg is now forest (#2C3A2E), icon is gold-soft (#C9B187), pulse rings are forest + gold, added gold/40 border. Verified via getComputedStyle: btnBg rgb(44,58,46), iconColor rgb(201,177,135), rings forest+gold+gold
- Created /src/components/luxury/ScrollStack.tsx — adapted the provided component for Next.js + TypeScript, uses window scroll (compatible with the site's top-level Lenis), removed the internal Lenis instance to avoid conflict, listens to window scroll + resize events
- Created /src/components/luxury/SafariScrollStack.tsx — wrapper section with 5 safari image cards (Maasai Mara, Bwindi, Serengeti, Okavango, Sossusvlei), each card is purely an image with gradient overlay + minimal caption (number + title + location), no h1/paragraphs on the cards
- Added SafariScrollStack to HomePage immediately after the Philosophy section, before HorizontalDestinations
- Moved WhyChooseUsSection to after HorizontalDestinations (was after Testimonials) — new order: Philosophy → ScrollStack → Destinations → Why Choose Us → ParallaxQuote → ExpertCarousel → Testimonials → FAQ → CTA
- Increased testimonials vertical scroll speed: changed animation duration from 60s to 30s (twice as fast) in globals.css
- Milestones timeline: created MilestoneItem component with useIsDesktop hook. On desktop/tablet (≥768px): even indices (2009, 2017, 2024) animate from LEFT and sit in left column (text-right), odd indices (2013, 2021) animate from RIGHT and sit in right column (col-start-2). On mobile: all animate from the left and stay in the single left column. Fixed the RTL direction hack that was breaking column placement — now uses explicit md:col-start-1 / md:col-start-2. Verified: 2009 LEFT, 2013 RIGHT, 2017 LEFT, 2021 RIGHT, 2024 LEFT on desktop; all LEFT/CENTER on mobile
- Footer: rewrote to use md:grid-cols-4 (4 equal columns: Logo | Navigate | Offices | Inquiries all on the same row, was using md:grid-cols-12 with col-span 4+2+3+3 that overflowed). Moved UNZIP AFRICA wordmark from absolute position (-bottom-32) into normal document flow as a block element BETWEEN the columns and the bottom copyright row. Verified: 4 grid children, all columns in same grid, wordmark at y=16755 is above copyright at y=17035

Stage Summary:
- WhatsApp button now uses forest green + gold (matches website palette, no more bright green)
- ScrollStack with 5 safari images added after Philosophy section — cards scale/stack/blur on scroll
- Testimonials scroll 2x faster (30s instead of 60s)
- Why Choose Us moved to after Destinations section
- Milestones alternate left/right on desktop/tablet, all-left on mobile
- Footer: 4 columns on same row, UNZIP AFRICA wordmark above copyright row
- ESLint passes with zero warnings/errors
