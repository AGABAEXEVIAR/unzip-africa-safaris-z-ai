"use client";

import { useRouter } from "@/lib/router";
import { Reveal } from "@/components/luxury/Reveal";
import { ArrowLeft } from "lucide-react";

const sharp = { borderRadius: 0 } as const;

export function PrivacyPage() {
  const { navigate } = useRouter();

  return (
    <div className="page-enter min-h-screen bg-canvas">
      <section className="bg-forest-deep text-cream py-20 md:py-28 px-6 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-eyebrow text-gold-soft mb-6">Legal</p>
          <h1 className="font-display text-4xl md:text-6xl tracking-tight" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Privacy Policy
          </h1>
          <p className="text-cream/60 mt-4 text-sm">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="mx-auto max-w-3xl space-y-8">
          <button onClick={() => navigate("home")} className="flex items-center gap-2 text-sm text-charcoal/60 hover:text-gold transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>

          <Reveal variant="up">
            <div className="space-y-6 text-sm md:text-base text-charcoal/80 leading-relaxed">
              <div>
                <h2 className="font-display text-xl text-charcoal mb-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>1. Information We Collect</h2>
                <p>At Unzip Africa Safaris, we collect information that you provide directly to us when you use our website or services. This includes:</p>
                <ul className="list-disc list-inside mt-3 space-y-1">
                  <li>Personal details: full name, email address, phone number, country of residence</li>
                  <li>Travel preferences: destinations of interest, preferred duration, budget range, number of travelers, approximate travel dates</li>
                  <li>Interests and experiences: gorilla trekking, photography, cultural immersion, birding, and other safari activities</li>
                  <li>Additional notes: dietary requirements, mobility considerations, special occasions, and personal requests</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-xl text-charcoal mb-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>2. How We Use Your Information</h2>
                <p>We use the information you provide to:</p>
                <ul className="list-disc list-inside mt-3 space-y-1">
                  <li>Design and craft bespoke safari itineraries tailored to your interests and preferences</li>
                  <li>Communicate with you regarding your inquiry, booking confirmation, and travel arrangements</li>
                  <li>Process tour bookings and scheduled trip reservations</li>
                  <li>Provide customer support before, during, and after your safari</li>
                  <li>Send travel-related updates and promotional materials (only with your consent)</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-xl text-charcoal mb-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>3. Information Sharing</h2>
                <p>We never sell, trade, or rent your personal information to third parties. We may share your information with:</p>
                <ul className="list-disc list-inside mt-3 space-y-1">
                  <li>Safari lodges, camps, and accommodation partners to secure your reservations</li>
                  <li>Local guides, drivers, and ground operators in Uganda, Kenya, Tanzania, and Rwanda</li>
                  <li>Government authorities and park services for permit processing (e.g., gorilla trekking permits)</li>
                  <li>Payment processors for secure transaction handling</li>
                </ul>
                <p className="mt-3">All partners are bound by confidentiality agreements and are only provided with information necessary for your safari arrangements.</p>
              </div>

              <div>
                <h2 className="font-display text-xl text-charcoal mb-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>4. Data Security</h2>
                <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encrypted data transmission, secure database storage, and restricted internal access controls. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
              </div>

              <div>
                <h2 className="font-display text-xl text-charcoal mb-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>5. Cookies</h2>
                <p>Our website may use cookies to enhance your browsing experience, analyze website traffic, and remember your preferences. You can control and manage cookies through your browser settings. Disabling cookies may affect some features of the website.</p>
              </div>

              <div>
                <h2 className="font-display text-xl text-charcoal mb-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>6. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc list-inside mt-3 space-y-1">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate or incomplete information</li>
                  <li>Request deletion of your personal data</li>
                  <li>Opt out of marketing communications at any time</li>
                  <li>Withdraw consent for data processing</li>
                </ul>
                <p className="mt-3">To exercise any of these rights, contact us at info@unzipafrica.com.</p>
              </div>

              <div>
                <h2 className="font-display text-xl text-charcoal mb-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>7. Data Retention</h2>
                <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. Booking and inquiry records are typically retained for 5 years for legal and accounting purposes.</p>
              </div>

              <div>
                <h2 className="font-display text-xl text-charcoal mb-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>8. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy or how we handle your data, please contact us:</p>
                <ul className="list-none mt-3 space-y-1">
                  <li>Email: info@unzipafrica.com</li>
                  <li>Phone (Kenya): +105539265</li>
                  <li>Phone (Uganda): +256 706 761092</li>
                  <li>Offices: Jinja, Uganda · Nairobi, Kenya · Arusha, Tanzania</li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
