"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Lang = "en" | "de" | "fr" | "zh";

type RouterContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<RouterContextValue | null>(null);

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}

// Comprehensive translation dictionary for all UI strings
// Keys are organized by section for maintainability
const translations: Record<Lang, Record<string, string>> = {
  en: {
    // Nav
    "nav.home": "Home",
    "nav.about": "About",
    "nav.company": "Company",
    "nav.tours": "Tours",
    "nav.scheduledTrips": "Scheduled Trips",
    "nav.destinations": "Destinations",
    "nav.accommodation": "Accommodation",
    "nav.contact": "Contact",
    "nav.requestQuote": "Request a Quote",
    "nav.beginJourney": "Begin Your Journey",
    "nav.exploreTours": "Explore Tours",
    "nav.scroll": "Scroll",
    // Hero
    "hero.eyebrow": "UNZIP AFRICA SAFARI",
    "hero.title1": "Bespoke Safaris Across",
    "hero.title2": "East Africa",
    "hero.subtitle": "Africa is not a destination you simply visit. It is a place you experience.",
    // Welcome
    "welcome.eyebrow": "Welcome to Unzip Africa",
    "welcome.heading1": "Where Africa Becomes",
    "welcome.heading2": "Extraordinary.",
    "welcome.para1": "Discover bespoke luxury safaris across Uganda, Rwanda, Kenya and Tanzania, crafted for discerning travelers seeking authentic experiences, exceptional wildlife and unforgettable moments.",
    "welcome.para2": "From gorilla trekking and the Great Migration to exclusive wilderness escapes, Unzip Africa brings you closer to the heart of East Africa — with every journey tailored around you.",
    "welcome.para3": "Your journey. Your Africa. Unzip it.",
    "welcome.cta1": "Plan Your Safari",
    "welcome.cta2": "Discover Our Story",
    "welcome.stat1": "Countries",
    "welcome.stat2": "Years Experience",
    "welcome.stat3": "Private Journeys",
    // Philosophy
    "philosophy.heading": "Our Philosophy",
    "philosophy.quote": "Travel Deeper. Experience More.",
    // Destinations
    "destinations.eyebrow": "Our Destinations",
    "destinations.heading1": "Our top",
    "destinations.heading2": "safari parks",
    "destinations.subtitle": "Wild Places. Extraordinary Journeys. Discover East Africa's iconic safari parks and reserves, where incredible wildlife, breathtaking landscapes and authentic experiences come together to create unforgettable African adventures.",
    "destinations.scrollHint": "↓ Scroll to pan the filmstrip",
    // Scroll stack
    "scrollstack.heading1": "Explore our most popular",
    "scrollstack.heading2": "popular destinations",
    "scrollstack.subtitle": "Our expert travel designers are on hand to create the perfect trip for you. Take a look at some of the amazing destinations we offer below, or get hold of us and let us tailor-make your trip through East Africa.",
    // Why choose us
    "why.eyebrow": "The Unzip Africa Difference",
    "why.heading1": "Why discerning travellers",
    "why.heading2": "choose us.",
    // Testimonials
    "testimonials.eyebrow": "Voices from the Field",
    "testimonials.heading1": "Trusted by travellers",
    "testimonials.heading2": "who have seen it all.",
    "testimonials.subtitle": "Reduce the noise. Gain the silence. These are the words of guests who arrived as clients and left as lifelong advocates.",
    // FAQ
    "faq.eyebrow": "Questions, Answered",
    "faq.heading1": "Frequently asked",
    "faq.heading2": "questions.",
    "faq.subtitle": "Everything you need to know about composing a journey with us. If your question is not here, a specialist will reply within 24 hours.",
    "faq.askSpecialist": "Ask a Specialist",
    // Final CTA
    "cta.eyebrow": "A Private Invitation",
    "cta.heading1": "The wild is waiting.",
    "cta.heading2": "Are you?",
    "cta.subtitle": "Every journey begins with a single conversation. Tell us where your imagination wanders — we will compose the rest.",
    "cta.requestQuote": "Request a Quote",
    "cta.speakSpecialist": "Speak to a Specialist",
    // Footer
    "footer.beginConversation": "Begin the Conversation",
    "footer.ctaHeading": "Let us design a safari",
    "footer.ctaHeading2": "composed entirely for you.",
    "footer.navigate": "Navigate",
    "footer.offices": "Offices",
    "footer.inquiries": "Inquiries",
    "footer.rights": "All rights reserved.",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "footer.developedBy": "Website developed by",
    // Common
    "common.viewAll": "View All",
    "common.exploreEvery": "Explore every",
    "common.journey": "journey",
    "common.bookNow": "Book Now",
    "common.details": "Details",
    "common.perPerson": "per person",
    "common.days": "Days",
    "common.nights": "Nights",
    "common.minAge": "Min age",
    "common.featured": "Featured",
    "common.off": "Off",
    "common.sortBy": "Sort by",
    "common.recommended": "Recommended",
    "common.priceLow": "Price: Low to High",
    "common.priceHigh": "Price: High to Low",
    "common.duration": "Duration: Longest First",
    "common.filterBy": "Filter By",
    "common.clear": "Clear",
    "common.showResults": "Show Results",
    "common.filters": "Filters",
    "common.journeysFound": "journeys found",
    "common.journeyFound": "journey found",
    "common.noResults": "No journeys match your filters.",
    "common.clearAllFilters": "Clear All Filters",
  },
  de: {
    // Nav
    "nav.home": "Startseite",
    "nav.about": "Über uns",
    "nav.company": "Unternehmen",
    "nav.tours": "Touren",
    "nav.scheduledTrips": "Geplante Touren",
    "nav.destinations": "Reiseziele",
    "nav.accommodation": "Unterkunft",
    "nav.contact": "Kontakt",
    "nav.requestQuote": "Angebot anfordern",
    "nav.beginJourney": "Reise beginnen",
    "nav.exploreTours": "Touren entdecken",
    "nav.scroll": "Scrollen",
    // Hero
    "hero.eyebrow": "UNZIP AFRICA SAFARI",
    "hero.title1": "Maßgeschneiderte Safaris durch",
    "hero.title2": "Ostafrika",
    "hero.subtitle": "Afrika ist kein Ziel, das man einfach besucht. Es ist ein Ort, den man erlebt.",
    // Welcome
    "welcome.eyebrow": "Willkommen bei Unzip Africa",
    "welcome.heading1": "Wecken Sie Ihre",
    "welcome.heading2": "Wanderlust",
    "welcome.para1": "Willkommen bei Unzip Africa, einem Luxus-Safari-Unternehmen, das auf maßgeschneiderte Wildtierabenteuer, Gorilla-Trekking-Erlebnisse, Große Migration-Safaris und exklusive Reisen durch Uganda, Kenia und Tansania spezialisiert ist.",
    "welcome.para2": "Wir schaffen außergewöhnliche Safari-Erlebnisse für Reisende, die Authentizität, Luxus, Abenteuer und bedeutungsvolle Verbindungen mit der Tierwelt und den Kulturen Afrikas suchen.",
    "welcome.cta1": "Safari planen",
    "welcome.cta2": "Unsere Geschichte entdecken",
    "welcome.stat1": "Länder",
    "welcome.stat2": "Jahre Erfahrung",
    "welcome.stat3": "Private Reisen",
    // Philosophy
    "philosophy.heading": "Unsere Philosophie",
    "philosophy.quote": "Keine zwei Reisen sind gleich",
    // Destinations
    "destinations.eyebrow": "Unsere Ziele",
    "destinations.heading1": "Unsere besten",
    "destinations.heading2": "Safariparks",
    "destinations.subtitle": "Afrika beherbergt die ikonischsten Safari-Ziele der Welt und bietet unvergleichliche Wildtierbegegnungen, atemberaubende Landschaften und unvergessliche kulturelle Erlebnisse.",
    "destinations.scrollHint": "↓ Scrollen, um den Filmstreifen zu verschieben",
    // Scroll stack
    "scrollstack.heading1": "Entdecken Sie unsere beliebtesten",
    "scrollstack.heading2": "beliebten Ziele",
    "scrollstack.subtitle": "Unsere erfahrenen Reiseplaner stehen bereit, um die perfekte Reise für Sie zu gestalten. Werfen Sie einen Blick auf einige der erstaunlichen Ziele, die wir anbieten, oder kontaktieren Sie uns und lassen Sie uns Ihre Reise durch Ostafrika maßschneidern.",
    // Why choose us
    "why.eyebrow": "Der Unzip Africa Unterschied",
    "why.heading1": "Warum anspruchsvolle Reisende",
    "why.heading2": "uns wählen.",
    // Testimonials
    "testimonials.eyebrow": "Stimmen aus dem Feld",
    "testimonials.heading1": "Vertraut von Reisenden",
    "testimonials.heading2": "die schon alles gesehen haben.",
    "testimonials.subtitle": "Reduzieren Sie den Lärm. Gewinnen Sie die Stille. Dies sind die Worte von Gästen, die als Kunden kamen und als lebenslange Fürsprecher gingen.",
    // FAQ
    "faq.eyebrow": "Fragen, beantwortet",
    "faq.heading1": "Häufig gestellte",
    "faq.heading2": "Fragen.",
    "faq.subtitle": "Alles, was Sie über die Planung einer Reise mit uns wissen müssen. Wenn Ihre Frage nicht hier ist, antwortet ein Spezialist innerhalb von 24 Stunden.",
    "faq.askSpecialist": "Spezialist fragen",
    // Final CTA
    "cta.eyebrow": "Eine private Einladung",
    "cta.heading1": "Die Wildnis wartet.",
    "cta.heading2": "Und Sie?",
    "cta.subtitle": "Jede Reise beginnt mit einem einzigen Gespräch. Sagen Sie uns, wohin Ihre Vorstellungskraft wandert — wir komponieren den Rest.",
    "cta.requestQuote": "Angebot anfordern",
    "cta.speakSpecialist": "Mit Spezialist sprechen",
    // Footer
    "footer.beginConversation": "Beginnen Sie das Gespräch",
    "footer.ctaHeading": "Lassen Sie uns eine Safari gestalten",
    "footer.ctaHeading2": "die ganz für Sie gemacht ist.",
    "footer.navigate": "Navigation",
    "footer.offices": "Büros",
    "footer.inquiries": "Anfragen",
    "footer.rights": "Alle Rechte vorbehalten.",
    "footer.privacy": "Datenschutz",
    "footer.terms": "AGB",
    "footer.developedBy": "Website entwickelt von",
    // Common
    "common.viewAll": "Alle ansehen",
    "common.exploreEvery": "Jede",
    "common.journey": "Reise entdecken",
    "common.bookNow": "Buchen",
    "common.details": "Details",
    "common.perPerson": "pro Person",
    "common.days": "Tage",
    "common.nights": "Nächte",
    "common.minAge": "Min. Alter",
    "common.featured": "Empfohlen",
    "common.off": "Rabatt",
    "common.sortBy": "Sortieren nach",
    "common.recommended": "Empfohlen",
    "common.priceLow": "Preis: Niedrig zu Hoch",
    "common.priceHigh": "Preis: Hoch zu Niedrig",
    "common.duration": "Dauer: Längste zuerst",
    "common.filterBy": "Filtern nach",
    "common.clear": "Löschen",
    "common.showResults": "Ergebnisse anzeigen",
    "common.filters": "Filter",
    "common.journeysFound": "Reisen gefunden",
    "common.journeyFound": "Reise gefunden",
    "common.noResults": "Keine Reisen entsprechen Ihren Filtern.",
    "common.clearAllFilters": "Alle Filter löschen",
  },
  fr: {
    // Nav
    "nav.home": "Accueil",
    "nav.about": "À propos",
    "nav.company": "Entreprise",
    "nav.tours": "Circuits",
    "nav.scheduledTrips": "Voyages programmés",
    "nav.destinations": "Destinations",
    "nav.accommodation": "Hébergement",
    "nav.contact": "Contact",
    "nav.requestQuote": "Demander un devis",
    "nav.beginJourney": "Commencer votre voyage",
    "nav.exploreTours": "Explorer les circuits",
    "nav.scroll": "Défiler",
    // Hero
    "hero.eyebrow": "UNZIP AFRICA SAFARI",
    "hero.title1": "Safaris sur mesure à travers",
    "hero.title2": "l'Afrique de l'Est",
    "hero.subtitle": "L'Afrique n'est pas une destination qu'on visite simplement. C'est un lieu qu'on vit.",
    // Welcome
    "welcome.eyebrow": "Bienvenue chez Unzip Africa",
    "welcome.heading1": "Nourrissez Votre",
    "welcome.heading2": "Wanderlust",
    "welcome.para1": "Bienvenue chez Unzip Africa, une entreprise de safari de luxe spécialisée dans les aventures sur mesure, les expériences de trekking des gorilles, les safaris de la grande migration et les voyages exclusifs en Ouganda, au Kenya et en Tanzanie.",
    "welcome.para2": "Nous créons des expériences de safari extraordinaires pour les voyageurs en quête d'authenticité, de luxe, d'aventure et de connexions significatives avec la faune et les cultures africaines.",
    "welcome.cta1": "Planifier votre safari",
    "welcome.cta2": "Découvrir notre histoire",
    "welcome.stat1": "Pays",
    "welcome.stat2": "Ans d'expérience",
    "welcome.stat3": "Voyages privés",
    // Philosophy
    "philosophy.heading": "Notre philosophie",
    "philosophy.quote": "Aucun voyage ne se ressemble",
    // Destinations
    "destinations.eyebrow": "Nos destinations",
    "destinations.heading1": "Nos meilleurs",
    "destinations.heading2": "parcs de safari",
    "destinations.subtitle": "L'Afrique abrite les destinations de safari les plus emblématiques du monde, offrant des rencontres avec la faune inégalées, des paysages à couper le souffle et des expériences culturelles inoubliables.",
    "destinations.scrollHint": "↓ Défiler pour faire défiler la pellicule",
    // Scroll stack
    "scrollstack.heading1": "Explorez nos destinations les plus",
    "scrollstack.heading2": "populaires",
    "scrollstack.subtitle": "Nos concepteurs de voyage experts sont là pour créer le voyage parfait pour vous. Jetez un œil à certaines des destinations incroyables que nous offrons ci-dessous, ou contactez-nous et laissez-nous créer votre voyage sur mesure à travers l'Afrique de l'Est.",
    // Why choose us
    "why.eyebrow": "La différence Unzip Africa",
    "why.heading1": "Pourquoi les voyageurs exigeants",
    "why.heading2": "nous choisissent.",
    // Testimonials
    "testimonials.eyebrow": "Voix du terrain",
    "testimonials.heading1": "Approuvé par les voyageurs",
    "testimonials.heading2": "qui ont tout vu.",
    "testimonials.subtitle": "Réduisez le bruit. Gagnez le silence. Ce sont les mots d'invités qui sont arrivés comme clients et sont partis comme défenseurs à vie.",
    // FAQ
    "faq.eyebrow": "Questions, réponses",
    "faq.heading1": "Questions fréquemment",
    "faq.heading2": "posées.",
    "faq.subtitle": "Tout ce que vous devez savoir sur la composition d'un voyage avec nous. Si votre question n'est pas ici, un spécialiste répondra dans les 24 heures.",
    "faq.askSpecialist": "Demander à un spécialiste",
    // Final CTA
    "cta.eyebrow": "Une invitation privée",
    "cta.heading1": "La nature sauvage attend.",
    "cta.heading2": "Et vous ?",
    "cta.subtitle": "Chaque voyage commence par une seule conversation. Dites-nous où votre imagination vagabonde — nous composerons le reste.",
    "cta.requestQuote": "Demander un devis",
    "cta.speakSpecialist": "Parler à un spécialiste",
    // Footer
    "footer.beginConversation": "Commencer la conversation",
    "footer.ctaHeading": "Laissez-nous concevoir un safari",
    "footer.ctaHeading2": "entièrement composé pour vous.",
    "footer.navigate": "Navigation",
    "footer.offices": "Bureaux",
    "footer.inquiries": "Demandes",
    "footer.rights": "Tous droits réservés.",
    "footer.privacy": "Confidentialité",
    "footer.terms": "Conditions",
    "footer.developedBy": "Site web développé par",
    // Common
    "common.viewAll": "Voir tout",
    "common.exploreEvery": "Explorer chaque",
    "common.journey": "voyage",
    "common.bookNow": "Réserver",
    "common.details": "Détails",
    "common.perPerson": "par personne",
    "common.days": "Jours",
    "common.nights": "Nuits",
    "common.minAge": "Âge min.",
    "common.featured": "En vedette",
    "common.off": "Remise",
    "common.sortBy": "Trier par",
    "common.recommended": "Recommandé",
    "common.priceLow": "Prix : Croissant",
    "common.priceHigh": "Prix : Décroissant",
    "common.duration": "Durée : Plus long d'abord",
    "common.filterBy": "Filtrer par",
    "common.clear": "Effacer",
    "common.showResults": "Afficher les résultats",
    "common.filters": "Filtres",
    "common.journeysFound": "voyages trouvés",
    "common.journeyFound": "voyage trouvé",
    "common.noResults": "Aucun voyage ne correspond à vos filtres.",
    "common.clearAllFilters": "Effacer tous les filtres",
  },
  zh: {
    // Nav
    "nav.home": "首页",
    "nav.about": "关于我们",
    "nav.company": "公司",
    "nav.tours": "行程",
    "nav.scheduledTrips": "定期旅行",
    "nav.destinations": "目的地",
    "nav.accommodation": "住宿",
    "nav.contact": "联系",
    "nav.requestQuote": "请求报价",
    "nav.beginJourney": "开启您的旅程",
    "nav.exploreTours": "探索行程",
    "nav.scroll": "滚动",
    // Hero
    "hero.eyebrow": "UNZIP AFRICA SAFARI",
    "hero.title1": "穿越",
    "hero.title2": "东非的定制游猎",
    "hero.subtitle": "非洲不仅仅是一个简单的目的地。它是一个您需要去体验的地方。",
    // Welcome
    "welcome.eyebrow": "欢迎来到 Unzip Africa",
    "welcome.heading1": "满足您的",
    "welcome.heading2": "旅行渴望",
    "welcome.para1": "欢迎来到 Unzip Africa，一家专注于定制野生动物探险、山地大猩猩徒步体验、大角马迁徙游猎以及乌干达、肯尼亚和坦桑尼亚专属旅程的豪华游猎公司。",
    "welcome.para2": "我们为追求真实性、奢华、冒险以及与非洲野生动物和文化建立有意义联系的旅行者创造非凡的游猎体验。",
    "welcome.cta1": "规划您的游猎",
    "welcome.cta2": "发现我们的故事",
    "welcome.stat1": "个国家",
    "welcome.stat2": "年经验",
    "welcome.stat3": "次私人旅程",
    // Philosophy
    "philosophy.heading": "我们的理念",
    "philosophy.quote": "没有两次旅程是相同的",
    // Destinations
    "destinations.eyebrow": "我们的目的地",
    "destinations.heading1": "我们顶级的",
    "destinations.heading2": "游猎公园",
    "destinations.subtitle": "非洲拥有世界上最标志性的游猎目的地，提供无与伦比的野生动物邂逅、令人叹为观止的风景和难忘的文化体验。",
    "destinations.scrollHint": "↓ 滚动以平移胶片条",
    // Scroll stack
    "scrollstack.heading1": "探索我们最受欢迎的",
    "scrollstack.heading2": "目的地",
    "scrollstack.subtitle": "我们的专家旅行设计师随时为您打造完美旅程。请在下方查看我们提供的一些令人惊叹的目的地，或联系我们，让我们为您量身定制东非之旅。",
    // Why choose us
    "why.eyebrow": "Unzip Africa 的独特之处",
    "why.heading1": "为什么挑剔的旅行者",
    "why.heading2": "选择我们。",
    // Testimonials
    "testimonials.eyebrow": "来自现场的声音",
    "testimonials.heading1": "深受看过世界的",
    "testimonials.heading2": "旅行者信赖。",
    "testimonials.subtitle": "减少噪音。获得宁静。这些是作为客户到来、作为终身倡导者离开的客人的话语。",
    // FAQ
    "faq.eyebrow": "问题，已解答",
    "faq.heading1": "常见",
    "faq.heading2": "问题。",
    "faq.subtitle": "关于与我们共同规划旅程您需要了解的一切。如果您的问题不在此处，专家将在24小时内回复。",
    "faq.askSpecialist": "询问专家",
    // Final CTA
    "cta.eyebrow": "一份私人邀请",
    "cta.heading1": "荒野在等待。",
    "cta.heading2": "您呢？",
    "cta.subtitle": "每段旅程都始于一次对话。告诉我们您的想象在哪里游荡——我们将编排其余的一切。",
    "cta.requestQuote": "请求报价",
    "cta.speakSpecialist": "与专家交谈",
    // Footer
    "footer.beginConversation": "开始对话",
    "footer.ctaHeading": "让我们设计一场",
    "footer.ctaHeading2": "完全为您打造的游猎。",
    "footer.navigate": "导航",
    "footer.offices": "办事处",
    "footer.inquiries": "咨询",
    "footer.rights": "版权所有。",
    "footer.privacy": "隐私",
    "footer.terms": "条款",
    "footer.developedBy": "网站开发由",
    // Common
    "common.viewAll": "查看全部",
    "common.exploreEvery": "探索每个",
    "common.journey": "旅程",
    "common.bookNow": "立即预订",
    "common.details": "详情",
    "common.perPerson": "每人",
    "common.days": "天",
    "common.nights": "晚",
    "common.minAge": "最低年龄",
    "common.featured": "精选",
    "common.off": "折扣",
    "common.sortBy": "排序方式",
    "common.recommended": "推荐",
    "common.priceLow": "价格：从低到高",
    "common.priceHigh": "价格：从高到低",
    "common.duration": "时长：最长优先",
    "common.filterBy": "筛选方式",
    "common.clear": "清除",
    "common.showResults": "显示结果",
    "common.filters": "筛选",
    "common.journeysFound": "个旅程已找到",
    "common.journeyFound": "个旅程已找到",
    "common.noResults": "没有符合您筛选条件的旅程。",
    "common.clearAllFilters": "清除所有筛选",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    // Persist to localStorage
    try {
      localStorage.setItem("unzip-africa-lang", next);
    } catch {
      // localStorage unavailable
    }
    // Update html lang attribute for accessibility
    if (typeof document !== "undefined") {
      document.documentElement.lang = next;
    }
  }, []);

  const t = useCallback((key: string) => {
    return translations[lang]?.[key] ?? translations.en[key] ?? key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const languageOptions: { id: Lang; label: string; short: string; flag: string }[] = [
  { id: "en", label: "English", short: "EN", flag: "🇬🇧" },
  { id: "de", label: "Deutsch", short: "DE", flag: "🇩🇪" },
  { id: "fr", label: "Français", short: "FR", flag: "🇫🇷" },
  { id: "zh", label: "中文", short: "中", flag: "🇨🇳" },
];
