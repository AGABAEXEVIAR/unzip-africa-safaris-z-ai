"use client";

import { useRouter, PageId } from "@/lib/router";

export function Footer() {
  const { navigate, openQuote } = useRouter();

  return (
    <footer className="mt-auto bg-forest-deep text-cream pt-24 pb-10 px-6 md:px-10 relative overflow-hidden">
      {/* Giant wordmark — pushed up so it doesn't overlap the bottom bar */}
      <div className="absolute -bottom-32 md:-bottom-40 left-0 right-0 pointer-events-none select-none">
        <div className="font-display text-[18vw] md:text-[14vw] leading-none text-cream/[0.04] text-center tracking-tighter">
          UNZIP AFRICA
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] relative z-10">
        {/* Top — CTA band */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-20 border-b border-cream/10">
          <div className="md:col-span-7">
            <p className="font-eyebrow text-gold mb-6">Begin the Conversation</p>
            <h3 className="font-display text-4xl md:text-6xl leading-[1.05] text-cream max-w-3xl">
              Let us design a safari
              <br />
              <span className="italic text-gold-soft">composed entirely for you.</span>
            </h3>
          </div>
          <div className="md:col-span-5 flex md:justify-end items-end">
            <button onClick={openQuote} className="btn-luxury btn-luxury-light">
              Request a Quote
            </button>
          </div>
        </div>

        {/* Middle — Columns (all 4 follow the same layout pattern) */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 py-16">
          <div className="col-span-2 md:col-span-4">
            <img
              src="/logo.png"
              alt="Unzip Africa Safaris"
              className="h-12 w-auto mb-5"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <p className="text-sm text-cream/60 leading-relaxed max-w-xs">
              Bespoke private safaris across East and Southern Africa. Family-owned, founded in
              Arusha in 2009. Members of ATTA, PACK, and the Long Run.
            </p>
          </div>

          <div className="md:col-span-2 md:col-start-6">
            <p className="font-eyebrow text-cream/40 mb-5">Navigate</p>
            <ul className="space-y-3">
              {([
                ["home", "Home"],
                ["about", "About"],
                ["tours", "Tours"],
                ["accommodation", "Accommodation"],
                ["contact", "Contact"],
              ] as [PageId, string][]).map(([id, label]) => (
                <li key={id}>
                  <button
                    onClick={() => navigate(id)}
                    className="text-sm text-cream/70 hover:text-gold-soft transition-colors duration-500"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="font-eyebrow text-cream/40 mb-5">Offices</p>
            <ul className="space-y-3 text-sm text-cream/70">
              <li>Arusha, Tanzania</li>
              <li>Maun, Botswana</li>
              <li>Kigali, Rwanda</li>
              <li>Windhoek, Namibia</li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="font-eyebrow text-cream/40 mb-5">Inquiries</p>
            <ul className="space-y-3 text-sm text-cream/70">
              <li>
                <a href="mailto:private@unzipafrica.com" className="hover:text-gold-soft transition-colors">
                  private@unzipafrica.com
                </a>
              </li>
              <li>+255 784 920 113</li>
              <li className="text-cream/50">Mon–Fri · 6 AM – 9 PM EAT</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-10 border-t border-cream/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-xs text-cream/40 tracking-wide">
            © {new Date().getFullYear()} Unzip Africa Safaris Ltd. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-cream/40">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
