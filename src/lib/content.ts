// Shared content data for Unzip Africa Safaris
// All imagery sourced from Unsplash (royalty-free, retina-ready via their CDN)

export type Destination = {
  id: string;
  name: string;
  country: string;
  tagline: string;
  description: string;
  image: string;
  imagePortrait: string;
  days: string;
  price: string;
};

export type Expert = {
  id: string;
  name: string;
  role: string;
  specialty: string;
  bio: string;
  image: string;
  yearsExperience: string;
};

export type TourPackage = {
  id: string;
  name: string;
  subtitle: string;
  duration: string;
  price: string;
  highlights: string[];
  image: string;
  days: { day: string; title: string; description: string; image: string }[];
};

export type Accommodation = {
  id: string;
  name: string;
  location: string;
  type: string;
  description: string;
  image: string;
  features: string[];
  pricePerNight: string;
};

export const destinations: Destination[] = [
  {
    id: "serengeti",
    name: "Serengeti",
    country: "Tanzania",
    tagline: "The Great Migration",
    description:
      "Witness two million wildebeest thundering across endless golden plains — a primal, deafening tide of life that has reshaped this land for ten thousand years. We position you ahead of the herd, in private mobile camps that move with the migration.",
    image:
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=80",
    imagePortrait:
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=900&q=80",
    days: "8 Days",
    price: "From $48,500",
  },
  {
    id: "bwindi",
    name: "Bwindi Impenetrable Forest",
    country: "Uganda",
    tagline: "Gorilla Encounters",
    description:
      "A mist-shrouded primeval forest where half the world's mountain gorillas live. After a measured trek through ancient undergrowth, you sit in silent reverence seven meters from a silverback — a moment that reorders everything you thought you knew about wildness.",
    image:
      "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1600&q=80",
    imagePortrait:
      "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=900&q=80",
    days: "6 Days",
    price: "From $32,000",
  },
  {
    id: "okavango",
    name: "Okavango Delta",
    country: "Botswana",
    tagline: "The Inland Oasis",
    description:
      "An immense river that never reaches the sea — instead, it spills into the Kalahari, creating a watery Eden of crystal channels, papyrus islands, and silent mokoro passages. Here, you glide past elephant herds half-submerged in lilac water.",
    image:
      "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1600&q=80",
    imagePortrait:
      "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=900&q=80",
    days: "9 Days",
    price: "From $54,200",
  },
  {
    id: "maasai-mara",
    name: "Maasai Mara",
    country: "Kenya",
    tagline: "Big Cat Country",
    description:
      "The northern extension of the Serengeti ecosystem — and the densest concentration of big cats on earth. Our private conservancies grant you off-road access, night drives, and walking safaris impossible inside the main reserve.",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80",
    imagePortrait:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=80",
    days: "7 Days",
    price: "From $42,800",
  },
  {
    id: "namib",
    name: "Sossusvlei",
    country: "Namibia",
    tagline: "The Living Desert",
    description:
      "Iron-red dunes rising a thousand feet from a clay pan white as bone — the oldest desert on earth, sculpted by wind for eighty million years. At dawn we climb Big Daddy in silence, then descend into Dead Vlei, where 900-year-old camel thorn trees stand petrified against orange sand.",
    image:
      "https://images.unsplash.com/photo-1500289466305-babaa6e8b1b3?auto=format&fit=crop&w=1600&q=80",
    imagePortrait:
      "https://images.unsplash.com/photo-1500289466305-babaa6e8b1b3?auto=format&fit=crop&w=900&q=80",
    days: "8 Days",
    price: "From $46,900",
  },
  {
    id: "virunga",
    name: "Virunga Volcanoes",
    country: "Rwanda",
    tagline: "In the Mist",
    description:
      "Five volcanic peaks shrouded in bamboo and Hagenia forest, where Dian Fossey lived and died among the gorillas. The trek is steep, the air thin, the reward transcendental — you sit among a family of twenty, infants tumbling around you, the silverback watching with unhurried eyes.",
    image:
      "https://images.unsplash.com/photo-1568125757388-9adeb77c8e5f?auto=format&fit=crop&w=1600&q=80",
    imagePortrait:
      "https://images.unsplash.com/photo-1568125757388-9adeb77c8e5f?auto=format&fit=crop&w=900&q=80",
    days: "5 Days",
    price: "From $38,500",
  },
];

export const experts: Expert[] = [
  {
    id: "amara",
    name: "Amara Okello",
    role: "Founder & Lead Guide",
    specialty: "Gorilla Trekking · Uganda & Rwanda",
    bio: "Born in Kisoro at the foot of the Virunga range, Amara has tracked mountain gorillas for twenty-three years. She holds the rare distinction of having named three silverbacks and was the first Ugandan woman certified as a Senior Gorilla Guide.",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=80",
    yearsExperience: "23 years",
  },
  {
    id: "tariq",
    name: "Tariq Hassan",
    role: "Director of Operations, East Africa",
    specialty: "Serengeti Migration · Tanzania",
    bio: "A fourth-generation Tanzanian of Hadzabe and Omani descent, Tariq speaks seven tribal languages and has logged over 4,000 hours guiding the migration. His grandfather guided Hemingway's last safari in 1956.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
    yearsExperience: "19 years",
  },
  {
    id: "nala",
    name: "Nala Mwangi",
    role: "Head of Conservation Partnerships",
    specialty: "Okavango Delta · Botswana",
    bio: "A Maasai conservation biologist educated at Oxford, Nala divides her time between Maun and the delta's most remote camps. She has co-authored three papers on human-elephant conflict mitigation and serves on the board of the Botswana Rhino Reintroduction Project.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80",
    yearsExperience: "16 years",
  },
  {
    id: "kofi",
    name: "Kofi Mensah",
    role: "Director of Private Journeys",
    specialty: "Namib Desert · Skeleton Coast",
    bio: "Ghanaian-born, Namibian by choice, Kofi spent a decade as chief pilot for Skeleton Coast Flying Safaris. He has landed on every dirt strip between Sossusvlei and the Angolan border and has a particular love for the desert-adapted lions of Kunene.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    yearsExperience: "21 years",
  },
];

export const tourPackages: TourPackage[] = [
  {
    id: "migration",
    name: "The Migration Symphony",
    subtitle: "Tanzania & Kenya · September–October",
    duration: "12 Days",
    price: "From $78,500 per person",
    highlights: [
      "Private mobile camp that moves with the herd",
      "Hot air balloon flight over the Mara River",
      "Walking safari with a Hadzabe bushman",
      "Private dinner on a kopje at sunset",
    ],
    image:
      "https://images.unsplash.com/photo-1542202229-7d93c33f5d07?auto=format&fit=crop&w=1600&q=80",
    days: [
      {
        day: "Day 01",
        title: "Arrival · Arusha Coffee Lodge",
        description:
          "You land at Kilimanjaro International where Tariq meets you privately on the tarmac. A short drive delivers you to a restored 1900s coffee plantation house. Dinner is served on the verandah under acacia trees; the menu changes nightly around whatever the garden has yielded.",
        image:
          "https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 02–04",
        title: "Serengeti South · Mobile Camp",
        description:
          "A Cessna Caravan lifts you into the southern plains. Your tented camp — moved twice weekly to track the herd — sits alone on a rise, with no other lights visible at night. Days are spent following the migration in a private Land Cruiser, returning to hot bucket showers and sundowners on the hood.",
        image:
          "https://images.unsplash.com/photo-1547621869-cd5e2ef82e1d?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 05–07",
        title: "Western Corridor · Grumeti River",
        description:
          "The migration reaches the Grumeti, where Nile crocodiles — some over a century old — wait in the reeds. We position you at a private conservancy overlooking the crossing points. A balloon flight at dawn on Day 06 reveals the herd from above, an unbroken black ribbon six miles long.",
        image:
          "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 08–09",
        title: "Crossing into the Mara",
        description:
          "You cross into Kenya at a private border post — no queues, no formalities, just a stamp and a handshake. The Mara Conservancy is the densest big-cat territory on earth; we have denoted leopard viewing areas known only to our guides. On Day 09, a walking safari with a Maasai tracker concludes at a bush dinner lit by lanterns.",
        image:
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 10–11",
        title: "Private Kopje Retreat",
        description:
          "Two nights at a private retreat atop a granite kopje, with the entire Mara spread below. A sunrise yoga session, a private chef preparing East African-Indian fusion, and a star-bed sleep-out under the Southern Cross. The finale: a helicopter flight over the Mara River at first light.",
        image:
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 12",
        title: "Departure · Nairobi",
        description:
          "A final leisurely breakfast on the kopje, then a flight to Nairobi's Wilson Airport. A private day room at The Norfolk allows for a shower and lunch before your evening international departure — carrying with you the silence of the plains.",
        image:
          "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    id: "apes",
    name: "Apes of the Mist",
    subtitle: "Uganda & Rwanda · Year-round",
    duration: "9 Days",
    price: "From $62,000 per person",
    highlights: [
      "Two gorilla treks in Bwindi & Volcanoes NP",
      "Chimpanzee habituation in Kibale Forest",
      "Private audience with a conservation researcher",
      "Golden monkey trek in the bamboo zone",
    ],
    image:
      "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1600&q=80",
    days: [
      {
        day: "Day 01",
        title: "Arrival · Kigali",
        description:
          "You land in Kigali where Amara meets you. A short city orientation includes the genocide memorial — a sobering, essential prelude. The night is spent at The Retreat, a sanctuary of butter-cream walls and frangipani trees.",
        image:
          "https://images.unsplash.com/photo-1568125757388-9adeb77c8e5f?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 02–03",
        title: "Volcanoes National Park",
        description:
          "A two-hour drive north delivers you to Singita Kwitonda Lodge, set on a tea plantation at the park's edge. Day 03 begins at 6 AM with the gorilla briefing. The trek through bamboo and Hagenia lasts ninety minutes — then you spend an hour with a family of seventeen, the silverback five meters away.",
        image:
          "https://images.unsplash.com/photo-1517118818301-e82f3a1c3a4f?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 04",
        title: "Golden Monkeys & Crossing to Uganda",
        description:
          "A morning trek for golden monkeys — electric-orange acrobats that live only here — then a private charter across the border to Kisoro, where Amara's family still farms the volcanic slopes below Mount Muhabura.",
        image:
          "https://images.unsplash.com/photo-1601913768173-9d2de8d4d9d3?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 05–06",
        title: "Bwindi Impenetrable Forest",
        description:
          "Two days in Bwindi — the second gorilla trek is deeper, harder, and infinitely more intimate. You track the Rushegura family through primary forest that has not changed in 25,000 years. Evenings at your lodge are spent on the deck overlooking the Bwindi canopy, listening to hornbills.",
        image:
          "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 07–08",
        title: "Kibale Forest · Chimpanzee Habituation",
        description:
          "A charter flight to Kibale, where you spend a full day with a chimp habituation team — not the standard one-hour viewing, but from dawn to dusk, following the troop as they wake, hunt, mate, and nest. This is the rarest primate experience in Africa.",
        image:
          "https://images.unsplash.com/photo-1517213849290-bbbfffdc6da4?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 09",
        title: "Departure · Entebbe",
        description:
          "A morning flight to Entebbe, with a day room at the Protea Hotel by Lake Victoria. A sunset boat cruise to search for shoebill storks precedes your evening international departure.",
        image:
          "https://images.unsplash.com/photo-1547621869-cd5e2ef82e1d?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    id: "delta",
    name: "The Delta & The Desert",
    subtitle: "Botswana & Namibia · May–September",
    duration: "14 Days",
    price: "From $94,000 per person",
    highlights: [
      "Mokoro safaris through papyrus channels",
      "Charter flight over the Okavango at flood",
      "Three nights on the Skeleton Coast",
      "Sossusvlei dunes at first light",
    ],
    image:
      "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1600&q=80",
    days: [
      {
        day: "Day 01",
        title: "Arrival · Maun",
        description:
          "Nala meets you in Maun — the dusty gateway to the delta — for a briefing over gin and tonics at your safari-style hotel. Tomorrow the water world begins.",
        image:
          "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 02–05",
        title: "Okavango Delta · Mombo Camp",
        description:
          "Four nights at Mombo, the 'place of plenty' on Chief's Island. Days alternate between game drives, mokoro (dugout canoe) glides through papyrus, and helicopter flights over the floodplains. The big five are all here — including the only rhino population in the delta.",
        image:
          "https://images.unsplash.com/photo-1547621869-cd5e2ef82e1d?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 06–07",
        title: "Kalahari · Central San Lands",
        description:
          "A charter south to the Central Kalahari, where you walk with San Bushmen — the original inhabitants of southern Africa — learning the tracking skills that built our species. Evenings are spent around a fire listening to their language, with its 104 distinct click sounds.",
        image:
          "https://images.unsplash.com/photo-1500289466305-babaa6e8b1b3?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 08–10",
        title: "Skeleton Coast · Namibia",
        description:
          "Kofi takes over in Namibia. Three nights at Shipwreck Lodge on the Skeleton Coast — a place of fog, seal colonies, and rusted whaling ships run aground in 1909. A drive along the beach reveals desert-adapted elephants walking in the surf.",
        image:
          "https://images.unsplash.com/photo-1500916434205-0c964904b3e1?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 11–12",
        title: "Damaraland · Desert Rhinos",
        description:
          "Two days tracking the free-ranging desert black rhino on foot with Save the Rhino Trust — perhaps the rarest wildlife encounter on earth. The landscape is volcanic, lunar, and silent in a way that recalibrates your nervous system.",
        image:
          "https://images.unsplash.com/photo-1500916434205-0c964904b3e1?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 13",
        title: "Sossusvlei · Big Daddy Dune",
        description:
          "A pre-dawn drive to the dunes. You climb Big Daddy — at 380 meters, one of the tallest on earth — in the cool dark, reaching the summit as the sun ignites the sand from coral to crimson. Below, Dead Vlei's petrified camel thorns stand like calligraphy.",
        image:
          "https://images.unsplash.com/photo-1500289466305-babaa6e8b1b3?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 14",
        title: "Departure · Windhoek",
        description:
          "A scenic flight to Windhoek, with the dunes receding into the khaki interior. A day room at The Olive Exclusive precedes your evening departure.",
        image:
          "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
];

export const accommodations: Accommodation[] = [
  {
    id: "singita",
    name: "Singita Pamushana",
    location: "Malilangwe Wildlife Reserve, Zimbabwe",
    type: "Lodge",
    description:
      "A cliff-top lodge of pale stone and leadwood timber overlooking an ancient lake. Six suites, each with a private plunge pool and a view that has not changed in eight hundred years.",
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
    features: ["Private plunge pool", "Outrigger canoe deck", "Wine cellar — 12,000 bottles", "Spa & gym"],
    pricePerNight: "From $4,800",
  },
  {
    id: "mombo",
    name: "Mombo Camp",
    location: "Chief's Island, Okavango Delta",
    type: "Tented Camp",
    description:
      "The 'place of plenty' — nine raised tented suites on the delta's most game-rich island. Built entirely of canvas and reclaimed hardwood, with wrap-around decks that put you at eye level with passing elephant.",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    features: ["Saline plunge pool", "Star bed on deck", "Hammam spa", "Private guide & vehicle"],
    pricePerNight: "From $5,200",
  },
  {
    id: "bisate",
    name: "Bisate Lodge",
    location: "Volcanoes National Park, Rwanda",
    type: "Forest Lodge",
    description:
      "Six thatched forest pods nested into a natural amphitheatre of bamboo, with the Virunga volcanopes rising behind. Each pod is a geodesic dome of woven bamboo and volcanic stone.",
    image:
      "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=1200&q=80",
    features: ["Forest pod suite", "Private butler", "Conservation lab on-site", "Heated plunge pool"],
    pricePerNight: "From $4,400",
  },
  {
    id: "sossus",
    name: "&Beyond Sossusvlei Desert Lodge",
    location: "NamibRand Nature Reserve, Namibia",
    type: "Desert Lodge",
    description:
      "Ten glass-and-stone suites set against the Namib escarpment, each with a star-gazing skylight above the bed and a private verandah facing the world's oldest desert.",
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
    features: ["Bedroom skylight", "Private infinity pool", "Resident astronomer & observatory", "Electric fat-bike trails"],
    pricePerNight: "From $3,900",
  },
  {
    id: "lapalala",
    name: "Lapalala Wilderness Lodge",
    location: "Waterberg, South Africa",
    type: "Wilderness Lodge",
    description:
      "A tented camp of just four suites on the Palala River, accessible only by chartered Cessna. Black rhino, sable antelope, and a breeding pair of Cape vultures call this 48,000-hectare reserve home.",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
    features: ["River-tent suite", "Private guide, vehicle & tracker", "Rhino tracking on foot", "Bush sleep-out deck"],
    pricePerNight: "From $3,400",
  },
  {
    id: "mwamba",
    name: "Mwamba Bush Camp",
    location: "South Luangwa, Zambia",
    type: "Mobile Bush Camp",
    description:
      "A seasonal camp of just three reed-and-thatch chalets on the Mwamba River — the most intimate walking safari camp in Africa. No electricity, no Wi-Fi, no other humans within ten miles.",
    image:
      "https://images.unsplash.com/photo-1547621869-cd5e2ef82e1d?auto=format&fit=crop&w=1200&q=80",
    features: ["Reed-and-thatch chalet", "Walking safari focus", "Open-air star bath", "Last-broadcast radio at 7 PM"],
    pricePerNight: "From $2,800",
  },
];

export const testimonials = [
  {
    quote:
      "Unzip Africa did not plan a safari. They orchestrated a week that has permanently recalibrated my sense of time, scale, and silence. Eight months later, I am still processing it.",
    author: "Marcus V.",
    title: "Founder, Private Equity Firm — London",
  },
  {
    quote:
      "We have travelled to 130 countries. Nothing has come close to what Amara and Tariq built for us in the Serengeti. The level of access — to the land, to the people, to the silence — was beyond anything we imagined possible.",
    author: "Dr. Elena R.",
    title: "Patron of Conservation — Milan",
  },
  {
    quote:
      "The gorilla trek in Bwindi was the single most profound hour of my life. Sitting seven meters from a silverback, watching his chest rise and fall — I understood, for the first time, what wildness actually means.",
    author: "James K.",
    title: "Tech Founder — San Francisco",
  },
];
