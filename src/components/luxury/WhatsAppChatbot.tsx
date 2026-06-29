"use client";

import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "+256706761092";
const WHATSAPP_DISPLAY = "+256 706 761092";
const WHATSAPP_MESSAGE = "Hello Unzip Africa Safaris, I'd like to inquire about a bespoke safari journey.";

export function WhatsAppChatbot() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Show after a short delay so it doesn't appear instantly on page load
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  // Auto-collapse the chat preview after a few seconds
  useEffect(() => {
    if (!expanded) return;
    const t = setTimeout(() => setExpanded(false), 8000);
    return () => clearTimeout(t);
  }, [expanded]);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[80] flex flex-col items-end gap-3 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      }`}
    >
      {/* Chat preview bubble */}
      {expanded && (
        <div
          className="mb-2 max-w-xs bg-cream border border-border shadow-2xl p-4 origin-bottom-right"
          style={{ borderRadius: 0, animation: "whatsappBubbleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both" }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 flex-shrink-0 bg-[#25D366] flex items-center justify-center">
              <WhatsAppIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-charcoal text-base leading-tight">Chat with us</p>
              <p className="text-xs text-charcoal/60 mt-0.5">We typically reply within minutes</p>
            </div>
            <button
              onClick={() => setExpanded(false)}
              aria-label="Close chat"
              className="text-charcoal/40 hover:text-charcoal transition-colors p-1 -m-1"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-charcoal/75 mt-3 leading-relaxed">
            Have a question about a safari? Send us a WhatsApp message — a specialist is standing by.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white py-2.5 px-4 text-xs font-medium tracking-[0.15em] uppercase transition-colors"
            style={{ borderRadius: 0 }}
          >
            <WhatsAppIcon className="w-4 h-4" />
            Start Chat
          </a>
          <p className="text-[0.65rem] text-charcoal/50 mt-2 text-center">{WHATSAPP_DISPLAY}</p>
        </div>
      )}

      {/* Main floating button — wavy vigorous effect */}
      <button
        onClick={() => setExpanded(!expanded)}
        aria-label="Open WhatsApp chat"
        className="relative w-14 h-14 bg-[#25D366] hover:bg-[#1ebe5d] flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-110 active:scale-95"
        style={{ borderRadius: 0 }}
      >
        {/* Wavy vigorous pulse rings */}
        <span className="absolute inset-0 bg-[#25D366] opacity-60 whatsapp-wave-ring" style={{ borderRadius: 0 }} />
        <span className="absolute inset-0 bg-[#25D366] opacity-40 whatsapp-wave-ring-2" style={{ borderRadius: 0 }} />
        <span className="absolute inset-0 bg-[#25D366] opacity-20 whatsapp-wave-ring-3" style={{ borderRadius: 0 }} />

        {/* Vigorous shake/wave on the icon itself */}
        <span className="relative whatsapp-icon-wiggle">
          {expanded ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <WhatsAppIcon className="w-7 h-7 text-white" />
          )}
        </span>

        {/* Notification dot */}
        {!expanded && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold border-2 border-cream flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-cream rounded-full" />
          </span>
        )}
      </button>
    </div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
