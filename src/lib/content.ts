// Shared content data for Unzip Africa Safaris
// All imagery sourced from Unsplash (royalty-free, retina-ready via their CDN)

export type GamePark = {
  id: string;
  name: string;
  destinationId: string; // links to Destination.id (the country)
  description: string;
  image: string;
  wildlife: string[];
};

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
  gameParks?: GamePark[];
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
  durationDays: number;
  durationNights: number;
  price: string;
  priceFrom: number;
  priceOriginal?: number;
  highlights: string[];
  image: string;
  galleryImages?: string[];
  days: { day: string; title: string; description: string; image: string }[];
  destination: string;
  activities: string[];
  tripType: string;
  accommodationLevel: string;
  nationalPark: string;
  featured?: boolean;
  minAge: number;
  accommodationIds: string[];
};

export type Accommodation = {
  id: string;
  name: string;
  location: string;
  type: string;
  description: string;
  image: string;
  galleryImages?: string[];
  features: string[];
  pricePerNight: string;
};

export type ScheduledTrip = {
  id: string;
  name: string;
  destination: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  durationDays: number;
  priceFrom: number;
  priceOriginal?: number;
  image: string;
  galleryImages?: string[];
  description: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  groupSize: string;
  spotsLeft: number;
  accommodationLevel: string;
  stops?: { day: string; title: string; description: string; image: string }[];
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  published: boolean;
  date: string; // ISO date
};

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  body: string; // multi-paragraph, separated by \n\n
  coverImage: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  publishedDate: string; // ISO date
  tags: string[];
  category: string;
  readTimeMins: number;
  published: boolean;
  featured?: boolean;
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
    gameParks: [
      { id: "gp-serengeti", name: "Serengeti National Park", destinationId: "serengeti", description: "The flagship park — endless plains, the great migration, and predator densities found nowhere else on earth.", image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80", wildlife: ["Lion", "Leopard", "Cheetah", "Wildebeest", "Elephant"] },
      { id: "gp-ngorongoro", name: "Ngorongoro Crater", destinationId: "serengeti", description: "A collapsed volcano caldera teeming with wildlife — the densest concentration of predators in Africa.", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80", wildlife: ["Black Rhino", "Lion", "Hyena", "Buffalo"] },
      { id: "gp-tarangire", name: "Tarangire National Park", destinationId: "serengeti", description: "Ancient baobab trees and the largest elephant population in northern Tanzania.", image: "https://images.unsplash.com/photo-1568126756329-5ddba3f1f3be?auto=format&fit=crop&w=1200&q=80", wildlife: ["Elephant", "Lion", "Python", "Oryx"] },
    ],
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
    gameParks: [
      { id: "gp-bwindi", name: "Bwindi Impenetrable National Park", destinationId: "bwindi", description: "Home to half the world's mountain gorillas — mist-shrouded ancient forest on steep volcanic slopes.", image: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=80", wildlife: ["Mountain Gorilla", "Chimpanzee", "Forest Elephant"] },
      { id: "gp-murchison", name: "Murchison Falls National Park", destinationId: "bwindi", description: "The Nile explodes through a 7-meter gorge — Uganda's largest park with buffalo, giraffe, and lion.", image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=1200&q=80", wildlife: ["Lion", "Elephant", "Giraffe", "Hipppo"] },
      { id: "gp-kibale", name: "Kibale Forest National Park", destinationId: "bwindi", description: "13 primate species including the highest density of chimpanzees in East Africa.", image: "https://images.unsplash.com/photo-1517114593411-6c1a7a5c8b9b?auto=format&fit=crop&w=1200&q=80", wildlife: ["Chimpanzee", "Colobus Monkey", "Forest Hog"] },
    ],
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
      "https://sfile.chatglm.cn/images-ppt/84ed8813798e.jpg",
    imagePortrait:
      "https://sfile.chatglm.cn/images-ppt/4dd444015d49.jpg",
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
      "https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg",
    imagePortrait:
      "https://sfile.chatglm.cn/images-ppt/55f6eb85ac39.jpg",
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
    durationDays: 12,
    durationNights: 11,
    price: "From $78,500 per person",
    priceFrom: 78500,
    highlights: [
      "Private mobile camp that moves with the herd",
      "Hot air balloon flight over the Mara River",
      "Walking safari with a Hadzabe bushman",
      "Private dinner on a kopje at sunset",
    ],
    image:
      "https://images.unsplash.com/photo-1542202229-7d93c33f5d07?auto=format&fit=crop&w=1600&q=80",
    destination: "Tanzania",
    activities: ["Game Drives", "Hot Air Balloon", "Walking Safaris", "Cultural Tours"],
    tripType: "Luxury Safaris",
    accommodationLevel: "Luxury Lodges",
    nationalPark: "Serengeti National Park",
    featured: true,
    minAge: 8,
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
          "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
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
    accommodationIds: ["singita", "mombo"],
    galleryImages: ["https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg", "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg", "https://sfile.chatglm.cn/images-ppt/25ee49aa2374.jpg"],
  },
  {
    id: "apes",
    name: "Apes of the Mist",
    subtitle: "Uganda & Rwanda · Year-round",
    duration: "9 Days",
    durationDays: 9,
    durationNights: 8,
    price: "From $62,000 per person",
    priceFrom: 62000,
    priceOriginal: 65000,
    highlights: [
      "Two gorilla treks in Bwindi & Volcanoes NP",
      "Chimpanzee habituation in Kibale Forest",
      "Private audience with a conservation researcher",
      "Golden monkey trek in the bamboo zone",
    ],
    image:
      "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1600&q=80",
    destination: "Uganda",
    activities: ["Gorilla Trekking", "Chimp Trekking", "Walking Safaris", "Cultural Tours"],
    tripType: "Luxury Safaris",
    accommodationLevel: "Luxury Lodges",
    nationalPark: "Bwindi Impenetrable National Park",
    featured: true,
    minAge: 15,
    days: [
      {
        day: "Day 01",
        title: "Arrival · Kigali",
        description:
          "You land in Kigali where Amara meets you. A short city orientation includes the genocide memorial — a sobering, essential prelude. The night is spent at The Retreat, a sanctuary of butter-cream walls and frangipani trees.",
        image:
          "https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg",
      },
      {
        day: "Day 02–03",
        title: "Volcanoes National Park",
        description:
          "A two-hour drive north delivers you to Singita Kwitonda Lodge, set on a tea plantation at the park's edge. Day 03 begins at 6 AM with the gorilla briefing. The trek through bamboo and Hagenia lasts ninety minutes — then you spend an hour with a family of seventeen, the silverback five meters away.",
        image:
          "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg",
      },
      {
        day: "Day 04",
        title: "Golden Monkeys & Crossing to Uganda",
        description:
          "A morning trek for golden monkeys — electric-orange acrobats that live only here — then a private charter across the border to Kisoro, where Amara's family still farms the volcanic slopes below Mount Muhabura.",
        image:
          "https://sfile.chatglm.cn/images-ppt/25ee49aa2374.jpg",
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
          "https://sfile.chatglm.cn/images-ppt/ac9862af7e88.jpg",
      },
      {
        day: "Day 09",
        title: "Departure · Entebbe",
        description:
          "A morning flight to Entebbe, with a day room at the Protea Hotel by Lake Victoria. A sunset boat cruise to search for shoebill storks precedes your evening international departure.",
        image:
          "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
      },
    ],
    accommodationIds: ["bisate", "mwamba"],
    galleryImages: ["https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg", "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg", "https://sfile.chatglm.cn/images-ppt/ac9862af7e88.jpg"],
  },
  {
    id: "delta",
    name: "The Delta & The Desert",
    subtitle: "Botswana & Namibia · May–September",
    duration: "14 Days",
    durationDays: 14,
    durationNights: 13,
    price: "From $94,000 per person",
    priceFrom: 94000,
    highlights: [
      "Mokoro safaris through papyrus channels",
      "Charter flight over the Okavango at flood",
      "Three nights on the Skeleton Coast",
      "Sossusvlei dunes at first light",
    ],
    image:
      "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1600&q=80",
    destination: "Botswana",
    activities: ["Mokoro Safaris", "Game Drives", "Photography", "Stargazing"],
    tripType: "Luxury Safaris",
    accommodationLevel: "Luxury Lodges",
    nationalPark: "Okavango Delta",
    featured: false,
    minAge: 12,
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
          "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
      },
      {
        day: "Day 06–07",
        title: "Kalahari · Central San Lands",
        description:
          "A charter south to the Central Kalahari, where you walk with San Bushmen — the original inhabitants of southern Africa — learning the tracking skills that built our species. Evenings are spent around a fire listening to their language, with its 104 distinct click sounds.",
        image:
          "https://sfile.chatglm.cn/images-ppt/84ed8813798e.jpg",
      },
      {
        day: "Day 08–10",
        title: "Skeleton Coast · Namibia",
        description:
          "Kofi takes over in Namibia. Three nights at Shipwreck Lodge on the Skeleton Coast — a place of fog, seal colonies, and rusted whaling ships run aground in 1909. A drive along the beach reveals desert-adapted elephants walking in the surf.",
        image:
          "https://sfile.chatglm.cn/images-ppt/4423f54c77e6.jpg",
      },
      {
        day: "Day 11–12",
        title: "Damaraland · Desert Rhinos",
        description:
          "Two days tracking the free-ranging desert black rhino on foot with Save the Rhino Trust — perhaps the rarest wildlife encounter on earth. The landscape is volcanic, lunar, and silent in a way that recalibrates your nervous system.",
        image:
          "https://sfile.chatglm.cn/images-ppt/4423f54c77e6.jpg",
      },
      {
        day: "Day 13",
        title: "Sossusvlei · Big Daddy Dune",
        description:
          "A pre-dawn drive to the dunes. You climb Big Daddy — at 380 meters, one of the tallest on earth — in the cool dark, reaching the summit as the sun ignites the sand from coral to crimson. Below, Dead Vlei's petrified camel thorns stand like calligraphy.",
        image:
          "https://sfile.chatglm.cn/images-ppt/84ed8813798e.jpg",
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
    accommodationIds: ["mombo", "lapalala"],
    galleryImages: ["https://sfile.chatglm.cn/images-ppt/1b293846f02b.jpg", "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg", "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg"],
  },
  {
    id: "gorilla-classic",
    name: "Gorilla Trek Classic",
    subtitle: "Rwanda · Year-round",
    duration: "5 Days",
    durationDays: 5,
    durationNights: 4,
    price: "From $38,500 per person",
    priceFrom: 38500,
    highlights: [
      "Two gorilla treks in Volcanoes National Park",
      "Golden monkey trek in the bamboo zone",
      "Stay at Bisate Lodge — geodesic forest pods",
      "Visit the Dian Fossey Fund research station",
    ],
    image:
      "https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg",
    destination: "Rwanda",
    activities: ["Gorilla Trekking", "Walking Safaris", "Cultural Tours"],
    tripType: "Family Safaris",
    accommodationLevel: "Luxury Lodges",
    nationalPark: "Volcanoes National Park",
    featured: false,
    minAge: 15,
    days: [
      {
        day: "Day 01",
        title: "Arrival · Kigali",
        description: "Arrive Kigali, city tour including the genocide memorial, overnight at The Retreat.",
        image: "https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg",
      },
      {
        day: "Day 02–04",
        title: "Volcanoes National Park · Bisate Lodge",
        description: "Three nights at Bisate Lodge with two gorilla treks and a golden monkey trek.",
        image: "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg",
      },
      {
        day: "Day 05",
        title: "Departure",
        description: "Return to Kigali for international departure.",
        image: "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
      },
    ],
    accommodationIds: ["bisate", "singita"],
    galleryImages: ["https://sfile.chatglm.cn/images-ppt/25ee49aa2374.jpg", "https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg", "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg"],
  },
  {
    id: "maasai-mara-classic",
    name: "Maasai Mara Big Cat Safari",
    subtitle: "Kenya · July–October",
    duration: "7 Days",
    durationDays: 7,
    durationNights: 6,
    price: "From $42,800 per person",
    priceFrom: 42800,
    highlights: [
      "Private conservancy with off-road access",
      "Night drives for nocturnal predators",
      "Walking safari with Maasai trackers",
      "Hot air balloon flight at dawn",
    ],
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80",
    destination: "Kenya",
    activities: ["Game Drives", "Walking Safaris", "Hot Air Balloon", "Photography"],
    tripType: "Luxury Safaris",
    accommodationLevel: "Luxury Lodges",
    nationalPark: "Maasai Mara National Reserve",
    featured: true,
    minAge: 8,
    days: [
      {
        day: "Day 01",
        title: "Arrival · Nairobi",
        description: "Arrive Nairobi, overnight at The Norfolk.",
        image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 02–06",
        title: "Mara Conservancy",
        description: "Five nights at a private conservancy with daily game drives and walking safaris.",
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 07",
        title: "Departure",
        description: "Flight to Nairobi for international departure.",
        image: "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
      },
    ],
    accommodationIds: ["singita", "mombo"],
    galleryImages: ["https://sfile.chatglm.cn/images-ppt/1b293846f02b.jpg", "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg", "https://sfile.chatglm.cn/images-ppt/84ed8813798e.jpg"],
  },
  {
    id: "namib-duchesert",
    name: "Namib Desert & Sossusvlei",
    subtitle: "Namibia · April–September",
    duration: "8 Days",
    durationDays: 8,
    durationNights: 7,
    price: "From $46,900 per person",
    priceFrom: 46900,
    highlights: [
      "Climb Big Daddy dune at dawn",
      "Photograph Dead Vlei's petrified trees",
      "Skeleton Coast shipwrecks and seal colonies",
      "Stargazing at &Beyond Sossusvlei observatory",
    ],
    image:
      "https://sfile.chatglm.cn/images-ppt/84ed8813798e.jpg",
    destination: "Namibia",
    activities: ["Photography", "Stargazing", "Walking Safaris", "Cultural Tours"],
    tripType: "Luxury Safaris",
    accommodationLevel: "Luxury Lodges",
    nationalPark: "Namib-Naukluft National Park",
    featured: false,
    minAge: 10,
    days: [
      {
        day: "Day 01",
        title: "Arrival · Windhoek",
        description: "Arrive Windhoek, overnight at The Olive Exclusive.",
        image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 02–05",
        title: "Sossusvlei Desert Lodge",
        description: "Four nights exploring the dunes, Dead Vlei, and the night sky.",
        image: "https://sfile.chatglm.cn/images-ppt/84ed8813798e.jpg",
      },
      {
        day: "Day 06–07",
        title: "Skeleton Coast",
        description: "Two nights at Shipwreck Lodge on the Skeleton Coast.",
        image: "https://sfile.chatglm.cn/images-ppt/4423f54c77e6.jpg",
      },
      {
        day: "Day 08",
        title: "Departure",
        description: "Return to Windhoek for departure.",
        image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    accommodationIds: ["sossus", "mwamba"],
    galleryImages: ["https://sfile.chatglm.cn/images-ppt/97c40e4746f3.jpg", "https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg", "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg"],
  },
  {
    id: "family-tanzania",
    name: "Tanzania Family Adventure",
    subtitle: "Tanzania · Year-round",
    duration: "10 Days",
    durationDays: 10,
    durationNights: 9,
    price: "From $36,400 per person",
    priceFrom: 36400,
    highlights: [
      "Age-appropriate activities for children 8+",
      "Family suites at each lodge",
      "Junior ranger program",
      "Visit to a Maasai village school",
    ],
    image:
      "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
    destination: "Tanzania",
    activities: ["Game Drives", "Cultural Tours", "Walking Safaris"],
    tripType: "Family Safaris",
    accommodationLevel: "Mid-Range Lodges",
    nationalPark: "Tarangire National Park",
    featured: false,
    minAge: 6,
    days: [
      {
        day: "Day 01–02",
        title: "Arusha & Tarangire",
        description: "Arrival and two nights at Tarangire with family-friendly game drives.",
        image: "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
      },
      {
        day: "Day 03–05",
        title: "Ngorongoro Crater",
        description: "Three nights at Ngorongoro with crater descents and a Maasai village visit.",
        image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 06–09",
        title: "Serengeti",
        description: "Four nights in the Serengeti with the junior ranger program.",
        image: "https://images.unsplash.com/photo-1542202229-7d93c33f5d07?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 10",
        title: "Departure",
        description: "Flight to Kilimanjaro for international departure.",
        image: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    accommodationIds: ["singita", "mombo"],
    galleryImages: ["https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg", "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg", "https://sfile.chatglm.cn/images-ppt/25ee49aa2374.jpg"],
  },
  {
    id: "chimp-uganda",
    name: "Chimp Habituation Experience",
    subtitle: "Uganda · Year-round",
    duration: "6 Days",
    durationDays: 6,
    durationNights: 5,
    price: "From $28,900 per person",
    priceFrom: 28900,
    priceOriginal: 31000,
    highlights: [
      "Full day with chimp habituation team in Kibale",
      "Forest walk in Bigodi Wetland Sanctuary",
      "Visit to Ngamba Island chimpanzee sanctuary",
      "Boat cruise on the Kazinga Channel",
    ],
    image:
      "https://sfile.chatglm.cn/images-ppt/ac9862af7e88.jpg",
    destination: "Uganda",
    activities: ["Chimp Trekking", "Walking Safaris", "Birding Tours", "Cultural Tours"],
    tripType: "Budget Safaris",
    accommodationLevel: "Mid-Range Lodges",
    nationalPark: "Kibale Forest National Park",
    featured: false,
    minAge: 12,
    days: [
      {
        day: "Day 01",
        title: "Arrival · Entebbe",
        description: "Arrive Entebbe, overnight at Protea Hotel by Lake Victoria.",
        image: "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
      },
      {
        day: "Day 02",
        title: "Ngamba Island",
        description: "Boat to Ngamba Island chimpanzee sanctuary.",
        image: "https://sfile.chatglm.cn/images-ppt/ac9862af7e88.jpg",
      },
      {
        day: "Day 03–05",
        title: "Kibale Forest",
        description: "Three nights with a full-day chimp habituation experience.",
        image: "https://sfile.chatglm.cn/images-ppt/ac9862af7e88.jpg",
      },
      {
        day: "Day 06",
        title: "Departure",
        description: "Flight to Entebbe for departure.",
        image: "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
      },
    ],
    accommodationIds: ["bisate", "mwamba"],
    galleryImages: ["https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg", "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg", "https://sfile.chatglm.cn/images-ppt/ac9862af7e88.jpg"],
  },
  {
    id: "botswana-fly-in",
    name: "Botswana Fly-In Safari",
    subtitle: "Botswana · May–September",
    duration: "7 Days",
    durationDays: 7,
    durationNights: 6,
    price: "From $32,400 per person",
    priceFrom: 32400,
    highlights: [
      "Three luxury camps by light aircraft",
      "Mokoro (dugout canoe) safaris in the delta",
      "Game drives on Chief's Island",
      "Sunset boat cruise on the Chobe River",
    ],
    image:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1600&q=80",
    destination: "Botswana",
    activities: ["Game Drives", "Mokoro Safaris", "Birding Tours", "Photography"],
    tripType: "Fly In Safaris",
    accommodationLevel: "Luxury Lodges",
    nationalPark: "Chobe National Park",
    featured: false,
    minAge: 8,
    days: [
      {
        day: "Day 01",
        title: "Arrival · Maun",
        description: "Arrive Maun, charter flight to first camp.",
        image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 02–03",
        title: "Okavango Delta Camp",
        description: "Two nights at a delta camp with mokoro and game drives.",
        image: "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
      },
      {
        day: "Day 04–05",
        title: "Chief's Island",
        description: "Two nights at Mombo Camp on Chief's Island.",
        image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 06",
        title: "Chobe River",
        description: "Charter to Chobe for a sunset river cruise.",
        image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 07",
        title: "Departure",
        description: "Flight to Maun for international departure.",
        image: "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
      },
    ],
    accommodationIds: ["mombo", "lapalala"],
    galleryImages: ["https://sfile.chatglm.cn/images-ppt/1b293846f02b.jpg", "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg", "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg"],
  },
  {
    id: "rwanda-cultural",
    name: "Rwanda Cultural & Wildlife",
    subtitle: "Rwanda · Year-round",
    duration: "8 Days",
    durationDays: 8,
    durationNights: 7,
    price: "From $44,200 per person",
    priceFrom: 44200,
    highlights: [
      "Gorilla trek in Volcanoes National Park",
      "Coffee experience at a cooperative",
      "Visit the King's Palace Museum",
      "Canopy walk in Nyungwe Forest",
    ],
    image:
      "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=1600&q=80",
    destination: "Rwanda",
    activities: ["Gorilla Trekking", "Cultural Tours", "Walking Safaris", "Birding Tours"],
    tripType: "Group Safaris",
    accommodationLevel: "Mid-Range Lodges",
    nationalPark: "Nyungwe Forest National Park",
    featured: false,
    minAge: 12,
    days: [
      {
        day: "Day 01",
        title: "Arrival · Kigali",
        description: "Arrive Kigali, city tour and genocide memorial.",
        image: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 02–04",
        title: "Volcanoes NP",
        description: "Three nights with a gorilla trek and golden monkey trek.",
        image: "https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg",
      },
      {
        day: "Day 05–06",
        title: "Lake Kivu",
        description: "Two nights on Lake Kivu with a coffee experience.",
        image: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 07",
        title: "Nyungwe Forest",
        description: "Canopy walk in Nyungwe Forest.",
        image: "https://sfile.chatglm.cn/images-ppt/ac9862af7e88.jpg",
      },
      {
        day: "Day 08",
        title: "Departure",
        description: "Return to Kigali for departure.",
        image: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    accommodationIds: ["bisate", "singita"],
    galleryImages: ["https://sfile.chatglm.cn/images-ppt/25ee49aa2374.jpg", "https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg", "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg"],
  },
  {
    id: "kenya-birding",
    name: "Kenya Birding Safari",
    subtitle: "Kenya · November–April",
    duration: "11 Days",
    durationDays: 11,
    durationNights: 10,
    price: "From $34,800 per person",
    priceFrom: 34800,
    highlights: [
      "Over 400 bird species in 11 days",
      "Lake Nakuru's flamingo spectacle",
      " Kakamega Forest's rare forest species",
      "Expert ornithologist guide throughout",
    ],
    image:
      "https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=1600&q=80",
    destination: "Kenya",
    activities: ["Birding Tours", "Game Drives", "Walking Safaris", "Photography"],
    tripType: "Group Safaris",
    accommodationLevel: "Mid-Range Lodges",
    nationalPark: "Lake Nakuru National Park",
    featured: false,
    minAge: 12,
    days: [
      {
        day: "Day 01",
        title: "Arrival · Nairobi",
        description: "Arrive Nairobi, briefing with ornithologist guide.",
        image: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 02–11",
        title: "Birding Circuit",
        description: "Ten days birding across Nakuru, Baringo, Kakamega, and the Mara.",
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 11",
        title: "Departure",
        description: "Return to Nairobi for departure.",
        image: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    accommodationIds: ["singita", "mombo"],
    galleryImages: ["https://sfile.chatglm.cn/images-ppt/1b293846f02b.jpg", "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg", "https://sfile.chatglm.cn/images-ppt/84ed8813798e.jpg"],
  },
  {
    id: "uganda-gorilla-murchison",
    name: "Uganda Gorillas & Murchison Falls",
    subtitle: "Uganda · Year-round",
    duration: "9 Days",
    durationDays: 9,
    durationNights: 8,
    price: "From $31,200 per person",
    priceFrom: 31200,
    highlights: [
      "Gorilla trek in Bwindi Impenetrable Forest",
      "Game drives in Murchison Falls NP",
      "Nile River cruise to the base of the falls",
      "Chimp trek in Budongo Forest",
    ],
    image:
      "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1600&q=80",
    destination: "Uganda",
    activities: ["Gorilla Trekking", "Game Drives", "Walking Safaris", "Birding Tours"],
    tripType: "Budget Safaris",
    accommodationLevel: "Mid-Range Lodges",
    nationalPark: "Murchison Falls National Park",
    featured: false,
    minAge: 15,
    days: [
      {
        day: "Day 01",
        title: "Arrival · Entebbe",
        description: "Arrive Entebbe, overnight at Protea Hotel.",
        image: "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
      },
      {
        day: "Day 02–04",
        title: "Murchison Falls NP",
        description: "Three nights with game drives and a Nile River cruise.",
        image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 05",
        title: "Budongo Forest",
        description: "Chimp trek in Budongo Forest.",
        image: "https://sfile.chatglm.cn/images-ppt/ac9862af7e88.jpg",
      },
      {
        day: "Day 06–08",
        title: "Bwindi Impenetrable Forest",
        description: "Three nights with a gorilla trek.",
        image: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 09",
        title: "Departure",
        description: "Flight to Entebbe for departure.",
        image: "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
      },
    ],
    accommodationIds: ["bisate", "mwamba"],
    galleryImages: ["https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg", "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg", "https://sfile.chatglm.cn/images-ppt/ac9862af7e88.jpg"],
  },
  {
    id: "tanzania-zanzibar",
    name: "Serengeti & Zanzibar",
    subtitle: "Tanzania · Year-round",
    duration: "12 Days",
    durationDays: 12,
    durationNights: 11,
    price: "From $48,600 per person",
    priceFrom: 48600,
    priceOriginal: 52000,
    highlights: [
      "Serengeti safari with private vehicle",
      "Ngorongoro Crater descent",
      "Five nights on Zanzibar's beaches",
      "Stone Town cultural tour",
    ],
    image:
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=80",
    destination: "Tanzania",
    activities: ["Game Drives", "Cultural Tours", "Birding Tours", "Photography"],
    tripType: "Family Safaris",
    accommodationLevel: "Luxury Lodges",
    nationalPark: "Serengeti National Park",
    featured: false,
    minAge: 6,
    days: [
      {
        day: "Day 01",
        title: "Arrival · Arusha",
        description: "Arrive Arusha, overnight at a coffee lodge.",
        image: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 02–05",
        title: "Serengeti",
        description: "Four nights in the Serengeti with a private vehicle.",
        image: "https://images.unsplash.com/photo-1542202229-7d93c33f5d07?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 06",
        title: "Ngorongoro Crater",
        description: "Crater descent and overnight on the rim.",
        image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 07–11",
        title: "Zanzibar",
        description: "Five nights on Zanzibar's beaches with a Stone Town tour.",
        image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80",
      },
      {
        day: "Day 12",
        title: "Departure",
        description: "Flight from Zanzibar for international departure.",
        image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    accommodationIds: ["singita", "mombo"],
    galleryImages: ["https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg", "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg", "https://sfile.chatglm.cn/images-ppt/25ee49aa2374.jpg"],
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
      "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
    features: ["Reed-and-thatch chalet", "Walking safari focus", "Open-air star bath", "Last-broadcast radio at 7 PM"],
    pricePerNight: "From $2,800",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Marcus Verhoeven",
    role: "Founder, Private Equity Firm — London",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
    content:
      "Unzip Africa did not plan a safari. They orchestrated a week that has permanently recalibrated my sense of time, scale, and silence. Eight months later, I am still processing it.",
    published: true,
    date: "2025-10-14",
  },
  {
    id: "t2",
    name: "Dr. Elena Rinaldi",
    role: "Patron of Conservation — Milan",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    content:
      "We have travelled to 130 countries. Nothing has come close to what Amara and Tariq built for us in the Serengeti. The level of access — to the land, to the people, to the silence — was beyond anything we imagined possible.",
    published: true,
    date: "2025-09-22",
  },
  {
    id: "t3",
    name: "James K. Tanaka",
    role: "Tech Founder — San Francisco",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    content:
      "The gorilla trek in Bwindi was the single most profound hour of my life. Sitting seven meters from a silverback, watching his chest rise and fall — I understood, for the first time, what wildness actually means.",
    published: true,
    date: "2025-08-08",
  },
  {
    id: "t4",
    name: "Sophie Laurent",
    role: "Gallery Owner — Paris",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    content:
      "I have commissioned many things in my life — paintings, buildings, gowns. Unzip Africa composed a week in the Okavango that belongs in the same conversation. It was art, plain and simple.",
    published: true,
    date: "2025-10-02",
  },
  {
    id: "t5",
    name: "Richard Aldridge",
    role: "Retired CEO — Sydney",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    content:
      "At 71, I assumed I had seen enough to be unsurpriseable. Sossusvlei at dawn — the dunes igniting from coral to crimson in absolute silence — proved me wrong. I wept. My wife wept. We are returning next year.",
    published: true,
    date: "2025-07-30",
  },
  {
    id: "t6",
    name: "Amara Okafor",
    role: "Author — Lagos",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
    content:
      "I came to write a single chapter. I left with a book. Unzip Africa understood what I needed before I could articulate it — solitude, access, and the kind of silence that makes sentences possible.",
    published: true,
    date: "2025-09-05",
  },
  {
    id: "t7",
    name: "Henrik Møller",
    role: "Architect — Copenhagen",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    content:
      "I have spent my career thinking about light, materials, and restraint. Bisate Lodge in Rwanda is the most beautifully considered piece of architecture I have ever stayed in — and the gorillas were the encore.",
    published: true,
    date: "2025-08-19",
  },
  {
    id: "t8",
    name: "Isabella Fontaine",
    role: "Vintner — Bordeaux",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    content:
      "Twelve days. Three countries. Not a single moment that felt staged, commercial, or rushed. The team at Unzip Africa has perfected something rare — the art of stepping back so the wild can step forward.",
    published: true,
    date: "2025-10-20",
  },
];

export const scheduledTrips: ScheduledTrip[] = [
  {
    id: "st-migration-river-crossing",
    name: "Migration River Crossing",
    destination: "Tanzania",
    startDate: "2026-10-14",
    endDate: "2026-10-20",
    durationDays: 7,
    priceFrom: 6800,
    priceOriginal: 7500,
    image:
      "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
    galleryImages: [
      "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
      "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg",
      "https://sfile.chatglm.cn/images-ppt/25ee49aa2374.jpg",
      "https://sfile.chatglm.cn/images-ppt/ac9862af7e88.jpg",
    ],
    description:
      "Witness the great migration herds mass along the Mara River as they prepare to cross into Kenya. A small-group departure limited to 12 guests, with private mobile camps positioned at the heart of the action.",
    highlights: [
      "Mara River crossing viewings",
      "Hot-air balloon flight at dawn",
      "Private mobile camp with en-suite tents",
      "Walking safari with a Hadzabe guide",
    ],
    inclusions: [
      "All lodging in luxury mobile camps",
      "Private guide and 4x4 vehicle",
      "All meals, drinks and park fees",
      "Internal charter flights",
    ],
    exclusions: [
      "International airfare",
      "Travel insurance",
      "Visa fees",
      "Personal items and gratuities",
    ],
    groupSize: "Max 12 guests",
    spotsLeft: 4,
    accommodationLevel: "Luxury Tented Camp",
    stops: [
      { day: "Day 01", title: "Arrival · Arusha", description: "Arrive at Kilimanjaro International Airport and transfer to a restored coffee-plantation lodge. Welcome dinner on the verandah.", image: "https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg" },
      { day: "Day 02-03", title: "Serengeti South Plains", description: "Charter into the southern Serengeti. Two full days following the herds across the short-grass plains from your private mobile camp.", image: "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg" },
      { day: "Day 04-05", title: "Mara River Crossings", description: "Move north to the Mara River. Spend two days in position for the dramatic crossings, where wildebeest and zebra brave the crocodiles.", image: "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg" },
      { day: "Day 06-07", title: "Hot-Air Balloon & Departure", description: "Dawn balloon flight over the herds. After brunch, fly back to Arusha for a day room and your onward flight home.", image: "https://sfile.chatglm.cn/images-ppt/25ee49aa2374.jpg" },
    ],
  },
  {
    id: "st-gorilla-trek-mist",
    name: "Gorilla Trek in the Mist",
    destination: "Rwanda",
    startDate: "2026-11-04",
    endDate: "2026-11-09",
    durationDays: 6,
    priceFrom: 5400,
    image:
      "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg",
    galleryImages: [
      "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg",
      "https://sfile.chatglm.cn/images-ppt/25ee49aa2374.jpg",
      "https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg",
      "https://sfile.chatglm.cn/images-ppt/ac9862af7e88.jpg",
    ],
    description:
      "An intimate six-day Rwanda departure built around two gorilla treks and a golden-monkey walk, based from a forest lodge on the slopes of the Virunga volcanoes.",
    highlights: [
      "Two gorilla treks in Volcanoes NP",
      "Golden monkey trek in the bamboo zone",
      "Visit to the Dian Fossey Fund lab",
      "Cultural evening with a local village",
    ],
    inclusions: [
      "Two gorilla permits per person",
      "Golden monkey trek permit",
      "All lodge stays on full board",
      "Private vehicle and guide",
    ],
    exclusions: [
      "International airfare",
      "Visa fees",
      "Tips for trackers and guides",
      "Travel insurance",
    ],
    groupSize: "Max 8 guests",
    spotsLeft: 3,
    accommodationLevel: "Forest Lodge",
    stops: [
      { day: "Day 01", title: "Arrival · Kigali", description: "Arrive in Kigali. Visit the genocide memorial and overnight at a boutique hotel in the city.", image: "https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg" },
      { day: "Day 02-03", title: "First Gorilla Trek & Forest Lodge", description: "Drive north to Volcanoes National Park. Briefing at park HQ and your first trek into the bamboo forest to spend an hour with a gorilla family.", image: "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg" },
      { day: "Day 04", title: "Golden Monkeys", description: "A gentler morning trek for the endangered golden monkey, followed by an afternoon at the Dian Fossey Fund research lab.", image: "https://sfile.chatglm.cn/images-ppt/25ee49aa2374.jpg" },
      { day: "Day 05-06", title: "Second Trek & Departure", description: "A second gorilla trek to a different family group. Drive back to Kigali for your departure flight.", image: "https://sfile.chatglm.cn/images-ppt/ac9862af7e88.jpg" },
    ],
  },
  {
    id: "st-maasai-mara-big-cat",
    name: "Maasai Mara Big Cat Safari",
    destination: "Kenya",
    startDate: "2026-11-18",
    endDate: "2026-11-25",
    durationDays: 8,
    priceFrom: 5200,
    priceOriginal: 5800,
    image:
      "https://sfile.chatglm.cn/images-ppt/1b293846f02b.jpg",
    galleryImages: [
      "https://sfile.chatglm.cn/images-ppt/1b293846f02b.jpg",
      "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
      "https://sfile.chatglm.cn/images-ppt/84ed8813798e.jpg",
      "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg",
      "https://sfile.chatglm.cn/images-ppt/25ee49aa2374.jpg",
    ],
    description:
      "Eight days in the Mara Conservancy during peak big-cat season, with a private guide and exclusive use of a small tented camp on the Talek River.",
    highlights: [
      "Big-cat territory with expert guide",
      "Night drive in a private conservancy",
      "Maasai village visit and walking safari",
      "Hot-air balloon flight at dawn",
    ],
    inclusions: [
      "All lodge and camp stays",
      "Private 4x4 with guide",
      "Park and conservancy fees",
      "All meals and selected drinks",
    ],
    exclusions: [
      "International airfare",
      "Optional balloon flight",
      "Visa fees",
      "Travel insurance",
    ],
    groupSize: "Max 10 guests",
    spotsLeft: 6,
    accommodationLevel: "Tented Camp",
    stops: [
      { day: "Day 01", title: "Arrival · Nairobi", description: "Arrive in Nairobi. Transfer to a quiet boutique hotel near the Karura Forest for dinner and rest.", image: "https://sfile.chatglm.cn/images-ppt/1b293846f02b.jpg" },
      { day: "Day 02-04", title: "Mara North Conservancy", description: "Fly into the Mara. Three full days of game drives focused on the resident prides and cheetah families.", image: "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg" },
      { day: "Day 05-06", title: "Talek River & Walking Safari", description: "Move south to the Talek River. Two days combining drives with a guided walking safari and a Maasai village visit.", image: "https://sfile.chatglm.cn/images-ppt/84ed8813798e.jpg" },
      { day: "Day 07-08", title: "Hot-Air Balloon & Departure", description: "Optional dawn balloon flight, brunch on the plains, then fly back to Nairobi for your onward flight.", image: "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg" },
    ],
  },
  {
    id: "st-uganda-apes-wildlife",
    name: "Uganda Apes & Wildlife",
    destination: "Uganda",
    startDate: "2026-12-02",
    endDate: "2026-12-09",
    durationDays: 8,
    priceFrom: 4950,
    image:
      "https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg",
    galleryImages: [
      "https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg",
      "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg",
      "https://sfile.chatglm.cn/images-ppt/ac9862af7e88.jpg",
      "https://sfile.chatglm.cn/images-ppt/25ee49aa2374.jpg",
      "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
      "https://sfile.chatglm.cn/images-ppt/84ed8813798e.jpg",
    ],
    description:
      "Eight days through Uganda's primate heartlands — one gorilla trek, two chimpanzee experiences, and a classic savannah finale in Queen Elizabeth National Park.",
    highlights: [
      "Gorilla trek in Bwindi Impenetrable",
      "Full-day chimp habituation in Kibale",
      "Tree-climbing lions of Ishasha",
      "Boat cruise on the Kazinga Channel",
    ],
    inclusions: [
      "One gorilla permit per person",
      "Chimp habituation experience",
      "All lodging on full board",
      "Private vehicle and guide",
    ],
    exclusions: [
      "International airfare",
      "Visa fees",
      "Tips and personal expenses",
      "Travel insurance",
    ],
    groupSize: "Max 8 guests",
    spotsLeft: 2,
    accommodationLevel: "Lodge & Tented Camp",
    stops: [
      { day: "Day 01", title: "Arrival · Entebbe", description: "Arrive at Entebbe. Transfer to a lakeside lodge on the shores of Lake Victoria.", image: "https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg" },
      { day: "Day 02-03", title: "Kibale Chimp Habituation", description: "Drive to Kibale Forest for a full day with a chimpanzee habituation team, following a troop from dawn to dusk.", image: "https://sfile.chatglm.cn/images-ppt/ac9862af7e88.jpg" },
      { day: "Day 04-05", title: "Queen Elizabeth NP", description: "Savannah game drives in search of the famous tree-climbing lions and a sunset boat cruise on the Kazinga Channel.", image: "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg" },
      { day: "Day 06-08", title: "Bwindi Gorilla Trek & Departure", description: "Trek into Bwindi Impenetrable Forest for one hour with a mountain-gorilla family. Then back to Entebbe for your flight home.", image: "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg" },
    ],
  },
  {
    id: "st-serengeti-calving",
    name: "Serengeti Calving Season",
    destination: "Tanzania",
    startDate: "2027-01-15",
    endDate: "2027-01-22",
    durationDays: 8,
    priceFrom: 5800,
    image:
      "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
    galleryImages: [
      "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
      "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg",
      "https://sfile.chatglm.cn/images-ppt/25ee49aa2374.jpg",
      "https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg",
    ],
    description:
      "Eight days on the southern Serengeti plains during the wildebeest calving season. Tens of thousands of calves are born each day, with big cats and wild dogs following close behind.",
    highlights: [
      "Calving-season predator action",
      "Olduvai Gorge and shifting-sands walk",
      "Night drive in a private conservancy",
      "Maasai cultural exchange",
    ],
    inclusions: [
      "All lodge and mobile-camp stays",
      "Private guide and 4x4 vehicle",
      "Park fees and conservancy fees",
      "All meals and drinks",
    ],
    exclusions: [
      "International airfare",
      "Visa fees",
      "Optional night-drive surcharge",
      "Travel insurance",
    ],
    groupSize: "Max 12 guests",
    spotsLeft: 8,
    accommodationLevel: "Luxury Mobile Camp",
    stops: [
      { day: "Day 01", title: "Arrival · Arusha", description: "Arrive at Kilimanjaro International Airport and transfer to your hotel. Dinner with your guide.", image: "https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg" },
      { day: "Day 02-04", title: "Ndutu Southern Plains", description: "Three full days on the southern Serengeti short-grass plains, where calving is in full swing and predators are never far away.", image: "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg" },
      { day: "Day 05-06", title: "Olduvai & Ngorongoro Crater", description: "A morning at Olduvai Gorge, then a day on the floor of the Ngorongoro Crater for one of the densest game populations on earth.", image: "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg" },
      { day: "Day 07-08", title: "Walking Safari & Departure", description: "A morning walking safari with a Maasai guide, then fly back to Arusha for your onward flight.", image: "https://sfile.chatglm.cn/images-ppt/25ee49aa2374.jpg" },
    ],
  },
  {
    id: "st-rwanda-cultural-wildlife",
    name: "Rwanda Cultural & Wildlife",
    destination: "Rwanda",
    startDate: "2027-02-12",
    endDate: "2027-02-18",
    durationDays: 7,
    priceFrom: 4650,
    image:
      "https://sfile.chatglm.cn/images-ppt/25ee49aa2374.jpg",
    galleryImages: [
      "https://sfile.chatglm.cn/images-ppt/25ee49aa2374.jpg",
      "https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg",
      "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg",
      "https://sfile.chatglm.cn/images-ppt/ac9862af7e88.jpg",
    ],
    description:
      "A seven-day cultural and wildlife journey across Rwanda, pairing a single gorilla trek with the country's coffee heartlands, the Nyungwe Forest canopy, and historic Kigali.",
    highlights: [
      "Gorilla trek in Volcanoes NP",
      "Nyungwe Forest canopy walk",
      "Coffee farm visit at Lake Kivu",
      "Kigali Genocide Memorial & city tour",
    ],
    inclusions: [
      "One gorilla permit per person",
      "All lodge stays on full board",
      "Canopy walk permit in Nyungwe",
      "Private vehicle and guide",
    ],
    exclusions: [
      "International airfare",
      "Visa fees",
      "Tips and personal expenses",
      "Travel insurance",
    ],
    groupSize: "Max 10 guests",
    spotsLeft: 5,
    accommodationLevel: "Lodge",
    stops: [
      { day: "Day 01", title: "Arrival · Kigali", description: "Arrive in Kigali. City tour including the Genocide Memorial and a coffee-shop tasting in the Kimironko neighbourhood.", image: "https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg" },
      { day: "Day 02-03", title: "Volcanoes NP & Gorilla Trek", description: "Drive north to the volcanoes. Briefing at park HQ and your trek into the bamboo forest for an hour with a gorilla family.", image: "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg" },
      { day: "Day 04-05", title: "Lake Kivu & Nyungwe", description: "Drive along Lake Kivu, visit a coffee farm, then continue south to Nyungwe Forest for the canopy walk.", image: "https://sfile.chatglm.cn/images-ppt/25ee49aa2374.jpg" },
      { day: "Day 06-07", title: "Canopy Walk & Departure", description: "Morning canopy walk in Nyungwe, chimpanzee trek optional, then drive back to Kigali for your onward flight.", image: "https://sfile.chatglm.cn/images-ppt/ac9862af7e88.jpg" },
    ],
  },
];

/* ============================================================
 * Blog Posts — seed content for the Blog page + admin CRUD
 * ============================================================ */
export const blogPosts: BlogPost[] = [
  {
    id: "blog-gorilla-trekking-guide",
    title: "Gorilla Trekking in Rwanda: A QuietConversation with the Wild",
    excerpt:
      "An hour with a silverback family rewrites everything you thought you knew about stillness, hierarchy, and what it means to be a guest on someone else's land.",
    body:
      "We left the lodge at 5:40 AM, long before the mist had lifted from the bamboo forest above Kinigi. Our guide, Jean-Pierre, had been tracking the Susa family for eleven years; he could read the bent stems of bamboo the way a librarian reads a card catalogue.\n\nThe trek took ninety minutes — steep, wet, gloriously quiet. And then we were there, ten metres from a 200-kilogram silverback chewing on bamboo shoots with the unhurried calm of a man who has nothing to prove. Around him, infants wrestled, juveniles swung from vines, a mother nursed. They ignored us entirely, as well they should. We were the visitors; they were home.\n\nThe hour passed in a kind of concentrated silence that I have only otherwise felt in cathedrals. When Jean-Pierre whispered that our time was up, the silverback raised his head, looked directly at us for perhaps four seconds, and then returned to his shoots. A dismissal, but not an unkind one.\n\nIf there is one rule of gorilla trekking it is this: you do not approach them. You wait. You wait until the forest decides you have been seen, and then you wait a little longer. The reward for that patience is something no photograph can carry — the recognition that wildness is not the opposite of intimacy. Sometimes, in the right hands, it is the door to it.",
    coverImage: "https://sfile.chatglm.cn/images-ppt/55f6eb85ac39.jpg",
    author: "Agaba Exeviar",
    authorRole: "Founder & Lead Guide, Unzip Africa Safaris",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    publishedDate: "2026-09-12",
    tags: ["Gorilla Trekking", "Rwanda", "Conservation", "Field Notes"],
    category: "Field Notes",
    readTimeMins: 6,
    published: true,
    featured: true,
  },
  {
    id: "blog-migration-when-where",
    title: "The Great Migration: When, Where, and How to Witness It",
    excerpt:
      "Two million wildebeest don't move on a schedule — but they do move on a rhythm. Here's how we plan journeys around the herds without resorting to guesswork.",
    body:
      "The Migration is not a single event. It is a 1,800-kilometre loop that the wildebeest walk every year of their lives, following the rains and the grass that follows them. To 'see the Migration' means almost nothing without context — what matters is where the herds are in the cycle when you arrive.\n\nJanuary through March: the southern Serengeti. Calving season. Half a million wildebeest born in a three-week window. Predators concentrated. Dramatic, dense, dusty.\n\nApril through May: the long rains. The herds begin to move west and north. Fewer visitors, lusher landscape, lower lodge rates — a favourite of returning clients.\n\nJune: the Grumeti river crossings. Smaller in scale than the Mara crossings but intimate and far less crowded. We position our mobile camps ahead of the herd here.\n\nJuly through October: the Mara river crossings in the northern Serengeti. This is the iconic scene — wildebeest leaping off cliffs into crocodile-infested water. It is also the most crowded window. We prefer to position our guests in private concessions adjacent to the river, where you watch the same drama without the convoy of vehicles.\n\nNovember through December: the herds turn south again, dispersing through the eastern Serengeti and into the Loliondo concessions. Quiet, beautiful, and dramatically under-visited.\n\nThere is no 'best' month. There is only the best month for what you want to feel. Tell us that, and we will tell you where to stand.",
    coverImage: "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
    author: "Agaba Exeviar",
    authorRole: "Founder & Lead Guide, Unzip Africa Safaris",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    publishedDate: "2026-08-28",
    tags: ["Great Migration", "Serengeti", "Safari Planning", "Wildlife"],
    category: "Safari Planning",
    readTimeMins: 8,
    published: true,
    featured: true,
  },
  {
    id: "blog-why-private-guide",
    title: "Why a Private Guide Changes Everything",
    excerpt:
      "A shared vehicle answers questions. A private guide anticipates them. The difference, measured over a week in the bush, is enormous.",
    body:
      "On a shared safari, the guide has eight guests, six of whom want different things. The birder wants to stop for the lilac-breasted roller; the photographer wants the cheetah in the shade of the acacia; the family with young children needs a bush toilet. The guide compromises beautifully, and everyone has a perfectly nice day.\n\nOn a private safari, none of those compromises are necessary. Your guide learns, in the first half-day, that you are secretly a birder, that you'd rather watch one elephant family for forty minutes than chase the Big Five in forty minutes, that your ten-year-old is obsessed with dung beetles. By Day Three, the guide is spotting things for you that you didn't know you wanted to see.\n\nThe economics are not trivial — a private guide costs more. But the value compounds. Over a week, the difference between 'a safari' and 'your safari' is not 20% better; it is a different category of experience entirely. We tell clients: if you have to choose between an extra night in a more luxurious lodge and a private guide for the journey, take the guide. The lodge is a place to sleep. The guide is the lens through which you will see the entire country.",
    coverImage: "https://sfile.chatglm.cn/images-ppt/e9781ad7f905.jpg",
    author: "Agaba Exeviar",
    authorRole: "Founder & Lead Guide, Unzip Africa Safaris",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    publishedDate: "2026-08-10",
    tags: ["Private Guide", "Safari Philosophy", "Travel Design"],
    category: "Safari Philosophy",
    readTimeMins: 5,
    published: true,
    featured: false,
  },
  {
    id: "blog-okavango-from-above",
    title: "The Okavango from Above: Why We Fly You In",
    excerpt:
      "There is no road into the heart of the Delta. There is only a six-seater Cessna, a low-altitude glide, and the moment the world reorganises itself into water and islands.",
    body:
      "You can drive into the Okavango's outer edge. You cannot drive into its heart. To reach the private concessions of the inner Delta — the places where the elephant densities are highest, where the wild dog den sites are protected, where the night drives are permitted — you must fly.\n\nThe flight itself is the first safari of the journey. A Cessna 206, six passengers, no co-pilot, the pilot doubling as narrator. You climb out of Maun, the desert town that frames the Delta's southern edge, and within three minutes the brown Kalahari gives way to something else: water. Lagoons. Channels. Hippo paths visible as dark tracings through the papyrus. Elephant herds casting small, dark shadows on the floodplain. From 800 feet, a hippo looks like a half-submerged suitcase.\n\nThe landing strip is a dirt ribbon cleared of grass. Sometimes giraffe scatter as the wheels touch. There will be a vehicle waiting — your guide, your first cold towel, your first gin and tonic if it's late afternoon. Within ten minutes of landing, you are in the bush.\n\nWe have clients who ask if we can shorten the flight, as if it were a commute. The answer is no. The flight is the threshold. You cross it, and the world you came from recedes.",
    coverImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80",
    author: "Agaba Exeviar",
    authorRole: "Founder & Lead Guide, Unzip Africa Safaris",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    publishedDate: "2026-07-22",
    tags: ["Okavango Delta", "Bush Flights", "Botswana", "Travel Design"],
    category: "Travel Design",
    readTimeMins: 4,
    published: true,
    featured: false,
  },
];
