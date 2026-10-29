"use client";

import { useRouter } from "@/lib/router";
import { Reveal } from "@/components/luxury/Reveal";
import { ArrowLeft } from "lucide-react";

const sharp = { borderRadius: 0 } as const;

export function TermsPage() {
  const { navigate } = useRouter();

  return (
    <div className="page-enter min-h-screen bg-canvas">
      <section className="bg-forest-deep text-cream py-20 md:py-28 px-6 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-eyebrow text-gold-soft mb-6">Legal</p>
          <h1 className="font-display text-4xl md:text-6xl tracking-tight" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Terms of Service
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
                <h2 className="font-display text-xl text-charcoal mb-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>1. Acceptance of Terms</h2>
                <p>By accessing and using the Unzip Africa Safaris website (unzipafrica.com) and our services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website or services.</p>
              </div>

              <div>
                <h2 className="font-display text-xl text-charcoal mb-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>2. Services Provided</h2>
                <p>Unzip Africa Safaris Ltd. provides bespoke safari experiences across East and Southern Africa, including but not limited to:</p>
                <ul className="list-disc list-inside mt-3 space-y-1">
                  <li>Custom-designed safari itineraries in Uganda, Kenya, Tanzania, and Rwanda</li>
                  <li>Gorilla trekking, chimpanzee tracking, and wildlife viewing experiences</li>
                  <li>Cultural immersion, photography, birding, and mountaineering adventures</li>
                  <li>Luxury, mid-range, and ultra-luxury accommodation bookings</li>
                  <li>Scheduled group trip departures and private tailor-made journeys</li>
                  <li>Ground transportation, professional guiding, and full-board safari packages</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-xl text-charcoal mb-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>3. Bookings and Reservations</h2>
                <p>When you submit a booking or inquiry through our website:</p>
                <ul className="list-disc list-inside mt-3 space-y-1">
                  <li>All bookings are subject to availability and confirmation by our team</li>
                  <li>A deposit may be required to secure your reservation, particularly for gorilla trekking permits and peak-season accommodations</li>
                  <li>Booking confirmation is only valid once you receive written confirmation from Unzip Africa Safaris</li>
                  <li>Pricing is quoted in USD and may be subject to change due to currency fluctuations, park fee adjustments, or fuel price changes</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-xl text-charcoal mb-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>4. Payment Terms</h2>
                <p>A deposit of 30% of the total safari cost is required to confirm your booking. The remaining balance is due 45 days before your departure date. Payments can be made via bank transfer or approved online payment methods. Prices include park entry fees, accommodation, ground transport, professional guide services, and meals as specified in your itinerary unless otherwise stated.</p>
              </div>

              <div>
                <h2 className="font-display text-xl text-charcoal mb-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>5. Cancellation Policy</h2>
                <p>Cancellation charges apply as follows:</p>
                <ul className="list-disc list-inside mt-3 space-y-1">
                  <li>More than 60 days before departure: Deposit refunded less administrative fees</li>
                  <li>45-60 days before departure: 30% of total cost retained</li>
                  <li>30-44 days before departure: 50% of total cost retained</li>
                  <li>15-29 days before departure: 75% of total cost retained</li>
                  <li>Less than 15 days before departure: 100% of total cost retained</li>
                </ul>
                <p className="mt-3">Gorilla trekking permits are non-refundable once purchased from the wildlife authority. We strongly recommend purchasing travel insurance that covers cancellation.</p>
              </div>

              <div>
                <h2 className="font-display text-xl text-charcoal mb-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>6. Travel Insurance</h2>
                <p>Comprehensive travel insurance is mandatory for all safari participants. Your insurance must cover medical evacuation, trip cancellation, baggage loss, and emergency medical expenses. Unzip Africa Safaris is not liable for any costs arising from lack of adequate insurance coverage.</p>
              </div>

              <div>
                <h2 className="font-display text-xl text-charcoal mb-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>7. Health and Vaccinations</h2>
                <p>Travelers are responsible for obtaining required vaccinations and medications before traveling to Africa. A valid Yellow Fever vaccination certificate is required for entry into Uganda, Kenya, Tanzania, and Rwanda. We recommend consulting a travel health specialist at least 4-6 weeks before departure. Malaria prophylaxis is strongly recommended.</p>
              </div>

              <div>
                <h2 className="font-display text-xl text-charcoal mb-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>8. Passport and Visa Requirements</h2>
                <p>Travelers must hold a valid passport with at least 6 months validity beyond the date of intended departure from Africa. Visas are required for most nationalities visiting Uganda, Kenya, Tanzania, and Rwanda. East African Tourist Visas are available and allow travel between Kenya, Uganda, and Rwanda on a single visa. Gorilla trekking permits must be obtained in advance through Unzip Africa Safaris.</p>
              </div>

              <div>
                <h2 className="font-display text-xl text-charcoal mb-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>9. Limitation of Liability</h2>
                <p>Unzip Africa Safaris acts as an organizer and agent for various travel services. While we take every precaution to ensure the safety and quality of our safaris, we are not liable for:</p>
                <ul className="list-disc list-inside mt-3 space-y-1">
                  <li>Loss or damage to personal belongings</li>
                  <li>Illness, injury, or death during safari activities</li>
                  <li>Delays or cancellations due to weather, wildlife behavior, or circumstances beyond our control</li>
                  <li>Changes to itineraries due to park closures, government regulations, or safety concerns</li>
                  <li>Services provided by third-party operators (lodges, airlines, ground handlers)</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-xl text-charcoal mb-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>10. Force Majeure</h2>
                <p>We shall not be liable for failure or delay in performing our obligations under these Terms where such failure results from circumstances beyond our reasonable control, including but not limited to acts of God, natural disasters, epidemics, war, terrorism, civil unrest, government actions, or extreme weather conditions.</p>
              </div>

              <div>
                <h2 className="font-display text-xl text-charcoal mb-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>11. Website Use</h2>
                <p>You agree not to misuse our website, including attempting to gain unauthorized access, introducing viruses or malicious code, scraping content, or using the site for any unlawful purpose. All content on this website, including text, images, and design, is the property of Unzip Africa Safaris Ltd. and may not be reproduced without permission.</p>
              </div>

              <div>
                <h2 className="font-display text-xl text-charcoal mb-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>12. Governing Law</h2>
                <p>These Terms of Service are governed by the laws of the Republic of Uganda. Any disputes arising from these terms shall be resolved in the courts of Uganda, unless otherwise agreed in writing.</p>
              </div>

              <div>
                <h2 className="font-display text-xl text-charcoal mb-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>13. Contact Us</h2>
                <p>For questions about these Terms of Service, please contact us:</p>
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
