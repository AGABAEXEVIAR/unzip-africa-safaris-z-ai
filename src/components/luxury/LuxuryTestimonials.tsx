"use client";

import { Reveal } from "@/components/luxury/Reveal";

const testimonials = [
  {
    name: "Marcus Verhoeven",
    role: "Founder, Private Equity Firm — London",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
    content:
      "Unzip Africa did not plan a safari. They orchestrated a week that has permanently recalibrated my sense of time, scale, and silence. Eight months later, I am still processing it.",
  },
  {
    name: "Dr. Elena Rinaldi",
    role: "Patron of Conservation — Milan",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    content:
      "We have travelled to 130 countries. Nothing has come close to what Amara and Tariq built for us in the Serengeti. The level of access — to the land, to the people, to the silence — was beyond anything we imagined possible.",
  },
  {
    name: "James K. Tanaka",
    role: "Tech Founder — San Francisco",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    content:
      "The gorilla trek in Bwindi was the single most profound hour of my life. Sitting seven meters from a silverback, watching his chest rise and fall — I understood, for the first time, what wildness actually means.",
  },
  {
    name: "Sophie Laurent",
    role: "Gallery Owner — Paris",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    content:
      "I have commissioned many things in my life — paintings, buildings, gowns. Unzip Africa composed a week in the Okavango that belongs in the same conversation. It was art, plain and simple.",
  },
  {
    name: "Richard Aldridge",
    role: "Retired CEO — Sydney",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    content:
      "At 71, I assumed I had seen enough to be unsurpriseable. Sossusvlei at dawn — the dunes igniting from coral to crimson in absolute silence — proved me wrong. I wept. My wife wept. We are returning next year.",
  },
  {
    name: "Amara Okafor",
    role: "Author — Lagos",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
    content:
      "I came to write a single chapter. I left with a book. Unzip Africa understood what I needed before I could articulate it — solitude, access, and the kind of silence that makes sentences possible.",
  },
  {
    name: "Henrik Møller",
    role: "Architect — Copenhagen",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    content:
      "I have spent my career thinking about light, materials, and restraint. Bisate Lodge in Rwanda is the most beautifully considered piece of architecture I have ever stayed in — and the gorillas were the encore.",
  },
  {
    name: "Isabella Fontaine",
    role: "Vintner — Bordeaux",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    content:
      "Twelve days. Three countries. Not a single moment that felt staged, commercial, or rushed. The team at Unzip Africa has perfected something rare — the art of stepping back so the wild can step forward.",
  },
];

export function LuxuryTestimonials() {
  // Duplicate the list so the marquee can loop seamlessly
  const doubled = [...testimonials, ...testimonials];

  return (
    <section className="bg-forest-deep text-cream py-24 md:py-40 px-6 md:px-10 relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(201,177,135,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl relative">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — heading */}
          <div className="flex flex-col items-start space-y-6 text-left">
            <Reveal variant="up">
              <p className="font-eyebrow text-gold-soft mb-2">Voices from the Field</p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-cream">
                Trusted by travellers
                <br />
                who have <span className="italic text-gold-soft">seen it all.</span>
              </h2>
              <p className="text-cream/65 text-base md:text-lg max-w-md mt-6 leading-relaxed">
                Reduce the noise. Gain the silence. These are the words of guests
                who arrived as clients and left as lifelong advocates.
              </p>
            </Reveal>
          </div>

          {/* Right — vertical infinite marquee scroll */}
          <div className="relative h-[420px] w-full lg:h-[520px] overflow-hidden">
            {/* Top fade */}
            <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-20 bg-gradient-to-b from-forest-deep to-transparent" />
            {/* Bottom fade */}
            <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-20 bg-gradient-to-t from-forest-deep to-transparent" />

            {/* Marquee track — animates upward infinitely */}
            <div className="testimonials-marquee">
              {doubled.map((testimonial, index) => (
                <div key={index} className="testimonials-marquee-item">
                  <div className="bg-cream/[0.06] backdrop-blur-sm border border-cream/10 transition-all duration-300 hover:bg-cream/[0.1] p-5 md:p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-gold/30 flex-shrink-0">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-cream text-sm font-medium font-display tracking-tight">
                            {testimonial.name}
                          </span>
                          <span className="text-cream/55 text-xs">
                            {testimonial.role}
                          </span>
                        </div>
                      </div>
                      <svg
                        className="h-5 w-5 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        style={{ color: "var(--gold)" }}
                      >
                        <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                      </svg>
                    </div>
                    <p className="text-cream/85 text-sm leading-relaxed italic font-display">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
