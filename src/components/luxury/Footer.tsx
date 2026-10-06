"use client";

import { useRouter, PageId } from "@/lib/router";
import { useLang } from "@/lib/language";

export function Footer() {
  const { navigate, openQuote } = useRouter();
  const { t } = useLang();

  return (
    <footer className="mt-auto bg-forest-deep text-cream pt-24 pb-10 px-6 md:px-10 relative overflow-hidden">
      <div className="mx-auto max-w-[1600px] relative z-10">
        {/* Top — CTA band */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-20 border-b border-cream/10">
          <div className="md:col-span-7">
            <p className="font-eyebrow text-gold mb-6">{t("footer.beginConversation")}</p>
            <h3 className="font-display text-4xl md:text-6xl leading-[1.05] text-cream max-w-3xl">
              {t("footer.ctaHeading")}
              <br />
              <span className="italic text-gold-soft">{t("footer.ctaHeading2")}</span>
            </h3>
          </div>
          <div className="md:col-span-5 flex md:justify-end items-end">
            <button onClick={openQuote} className="btn-luxury btn-luxury-light">
              {t("nav.requestQuote")}
            </button>
          </div>
        </div>

        {/* Middle — 4 columns all on the same row (Logo | Navigate | Offices | Inquiries) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-16">
          <div>
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

          <div>
            <p className="font-eyebrow text-cream/40 mb-5">{t("footer.navigate")}</p>
            <ul className="space-y-3">
              {([
                ["home", t("nav.home")],
                ["company", t("nav.company")],
                ["tours", t("nav.tours")],
                ["scheduled-trips", t("nav.scheduledTrips")],
                ["contact", t("nav.contact")],
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

          <div>
            <p className="font-eyebrow text-cream/40 mb-5">{t("footer.offices")}</p>
            <ul className="space-y-3 text-sm text-cream/70">
              <li>Arusha, Tanzania</li>
              <li>Maun, Botswana</li>
              <li>Kigali, Rwanda</li>
              <li>Windhoek, Namibia</li>
            </ul>
          </div>

          <div>
            <p className="font-eyebrow text-cream/40 mb-5">{t("footer.inquiries")}</p>
            <ul className="space-y-2 text-sm text-cream/70">
              <li className="text-cream/50 text-xs uppercase tracking-wider mb-1">Numbers</li>
              <li>Germany: +49 179 9372309</li>
              <li>Uganda: +256 706 761092</li>
              <li className="text-cream/50 text-xs uppercase tracking-wider mt-3 mb-1">Email</li>
              <li>
                <a href="mailto:info@unzipafrica.com" className="hover:text-gold-soft transition-colors">
                  info@unzipafrica.com
                </a>
              </li>
              <li>
                <a href="mailto:booking@unzipafrica.com" className="hover:text-gold-soft transition-colors">
                  booking@unzipafrica.com
                </a>
              </li>
              <li className="text-cream/50 text-xs uppercase tracking-wider mt-3 mb-1">Business Hours</li>
              <li>Mon–Fri: 8:30am – 5pm</li>
              <li>Sat: 10am – 3pm</li>
              <li className="text-cream/50">Sun: Closed</li>
            </ul>
          </div>
        </div>

        {/* Giant wordmark — sits ABOVE the bottom copyright row */}
        <div className="pointer-events-none select-none py-8 overflow-hidden">
          <div className="font-display text-[18vw] md:text-[14vw] leading-none text-cream/[0.04] text-center tracking-tighter">
            UNZIP AFRICA
          </div>
        </div>

        {/* Bottom — copyright + links */}
        <div className="pt-6 border-t border-cream/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-xs text-cream/40 tracking-wide">
            © {new Date().getFullYear()} Unzip Africa Safaris Ltd. {t("footer.rights")}
          </p>
          <div className="flex flex-wrap gap-6 text-xs text-cream/40 items-center">
            <span>{t("footer.privacy")}</span>
            <span>{t("footer.terms")}</span>
            <button
              onClick={() => navigate("admin")}
              className="text-gold-soft hover:text-gold transition-colors underline"
            >
              Admin
            </button>
            <span>
              {t("footer.developedBy")}{" "}
              <a
                href="https://www.agabaexeviar.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-soft hover:text-gold transition-colors underline"
              >
                Agaba Exeviar
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
