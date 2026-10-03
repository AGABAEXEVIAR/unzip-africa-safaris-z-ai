// Destination content data for Unzip Africa Safaris
// Each country has: hero, intro, experiences, whyChoose, luxurySection, bestPlaces, whenToGo, itineraries, beyondBigFive, faqs, cta

export type Destination = {
  country: string;
  tagline: string;
  subtitle: string;
  heroImage: string;
  intro: {
    eyebrow: string;
    title: string;
    body: string[];
    cta: string;
  };
  unzipped: {
    heading: string;
    body: string[];
  };
  experiences: {
    heading: string;
    subheading: string;
    items: { name: string; description: string; experience: string }[];
  };
  whyChoose: {
    heading: string;
    items: { title: string; body: string }[];
  };
  luxury: {
    heading: string;
    body: string[];
    cta: string;
  };
  bestPlaces: {
    heading: string;
    items: { name: string; description: string }[];
  };
  whenToGo: {
    heading: string;
    body: string[];
  };
  itineraries?: {
    heading: string;
    items: { name: string; description: string }[];
  };
  beyondBigFive: {
    heading: string;
    body: string[];
    tagline: string;
  };
  faqs: { q: string; a: string }[];
  cta: {
    heading: string;
    body: string;
    cta: string;
    tagline: string;
  };
  conservation?: {
    heading: string;
    body: string[];
    tagline: string;
  };
};

export const destinations: Record<string, Destination> = {
  kenya: {
    country: "Kenya",
    tagline: "The Soul of Safari",
    subtitle: "Where Iconic Africa Comes to Life",
    heroImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=2400&q=85",
    intro: {
      eyebrow: "KENYA",
      title: "The Soul of Safari",
      body: [
        "Welcome to Kenya, where endless savannahs, legendary wildlife, dramatic landscapes and rich cultures create some of East Africa's most extraordinary travel experiences.",
        "At Unzip Africa, we create bespoke luxury Kenya safaris for travellers who want to experience the country beyond a standard itinerary. From the legendary Maasai Mara and elephant-filled Amboseli to the wilderness of Samburu and the Indian Ocean coast, every journey is thoughtfully designed around you.",
      ],
      cta: "Plan My Kenya Safari",
    },
    unzipped: {
      heading: "Kenya, Unzipped",
      body: [
        "Kenya is home to some of Africa's most celebrated wildlife landscapes, from the savannahs of the Maasai Mara and Amboseli to the northern wilderness and Indian Ocean coast. Kenya Wildlife Service manages a wide network of national parks, reserves and marine protected areas across the country.",
        "But Kenya is more than the Big Five. It is sunrise over the Mara, elephants beneath Mount Kilimanjaro, encounters with local communities, intimate conservancy experiences, ancient coastal cultures and evenings beneath vast African skies. This is Kenya for travellers who want to experience Africa deeply.",
      ],
    },
    experiences: {
      heading: "Signature Kenya Experiences",
      subheading: "Extraordinary Encounters, Thoughtfully Curated",
      items: [
        { name: "The Maasai Mara", description: "Experience one of Africa's most iconic safari landscapes, where expansive grasslands provide exceptional opportunities for wildlife viewing. Go beyond the classic safari with carefully selected camps, private guiding and experiences that allow you to experience the Mara at your own pace.", experience: "Big Five · Great Migration season · Private game drives · Cultural experiences" },
        { name: "Amboseli & Mount Kilimanjaro", description: "Watch large elephant herds move across open plains with Mount Kilimanjaro rising dramatically in the distance. Amboseli is particularly known for its elephant encounters, spectacular scenery and opportunities for cultural experiences with Maasai communities.", experience: "Elephant encounters · Wildlife photography · Maasai culture · Scenic landscapes" },
        { name: "Samburu & Northern Kenya", description: "Travel north into a more remote Kenya, where rugged landscapes, distinctive wildlife and rich cultural traditions create a very different safari experience. For travellers seeking exclusive and less conventional Kenya safari experiences, northern Kenya offers an extraordinary sense of space and wilderness.", experience: "Remote wilderness · Wildlife · Cultural encounters · Private conservancies" },
        { name: "Tsavo National Parks", description: "Discover the vast wilderness of Tsavo East and Tsavo West, among Kenya's most expansive protected landscapes. From dramatic volcanic scenery to open savannah and iconic wildlife, Tsavo offers a more untamed safari experience away from the better-known routes.", experience: "Big game · Wilderness · Scenic landscapes · Private safari experiences" },
        { name: "Lake Nakuru", description: "Explore the landscapes surrounding Lake Nakuru National Park, with opportunities to encounter rhino, buffalo, giraffe and diverse birdlife. It can be seamlessly combined with the Maasai Mara, Amboseli or other destinations as part of a private Kenya safari.", experience: "Rhino · Birdlife · Wildlife viewing · Scenic landscapes" },
        { name: "Kenya's Indian Ocean Coast", description: "Extend your safari to the coast and exchange savannah sunsets for white-sand beaches, turquoise waters and Swahili culture. From Diani and Mombasa to Watamu and Lamu, Kenya's coast offers the perfect way to slow down after an adventurous safari.", experience: "Beach escapes · Marine experiences · Swahili culture · Private coastal retreats" },
      ],
    },
    whyChoose: {
      heading: "One Destination. Many Ways to Experience Africa.",
      items: [
        { title: "Iconic Wildlife", body: "Experience elephants, lions, rhinos, buffalo, giraffes and an extraordinary variety of other wildlife across Kenya's protected areas." },
        { title: "The Great Migration", body: "Plan your safari around the seasonal movement of wildebeest and other wildlife through the greater Mara–Serengeti ecosystem." },
        { title: "Private Conservancy Experiences", body: "Discover a more intimate approach to safari through carefully selected private and community conservancy experiences." },
        { title: "Extraordinary Landscapes", body: "From the Great Rift Valley and Mount Kenya to the Mara plains and Indian Ocean coastline." },
        { title: "Rich Cultural Heritage", body: "Meet communities and discover the traditions and stories that form an important part of Kenya's identity." },
        { title: "Safari & Beach", body: "Combine a classic Kenya safari with a luxurious Indian Ocean escape." },
      ],
    },
    luxury: {
      heading: "Luxury Is in the Details",
      body: [
        "At Unzip Africa, luxury means more than an exceptional lodge. It is private guiding, seamless transfers, carefully chosen camps, remarkable locations and experiences designed around your interests.",
        "We create tailor-made Kenya journeys for couples, families, private groups, photographers, honeymooners and discerning travellers seeking a more personal safari experience. From the moment you arrive in Kenya to your final departure, every detail is thoughtfully coordinated.",
      ],
      cta: "Create My Kenya Safari",
    },
    bestPlaces: {
      heading: "From Savannah to Sea",
      items: [
        { name: "Maasai Mara National Reserve", description: "Iconic wildlife, expansive savannah and exceptional safari experiences." },
        { name: "Amboseli National Park", description: "Elephant encounters and spectacular views of Mount Kilimanjaro." },
        { name: "Samburu National Reserve", description: "Rugged northern landscapes, distinctive wildlife and cultural experiences." },
        { name: "Tsavo East National Park", description: "Vast wilderness and classic East African wildlife." },
        { name: "Tsavo West National Park", description: "Dramatic volcanic landscapes, wildlife and wilderness experiences." },
        { name: "Lake Nakuru National Park", description: "Rhino, birdlife and beautiful Rift Valley scenery." },
        { name: "Laikipia & Private Conservancies", description: "Exclusive wildlife experiences, conservation and intimate safari settings." },
        { name: "Mount Kenya", description: "Mountain landscapes, trekking and high-altitude adventure." },
        { name: "Nairobi National Park", description: "A unique wildlife experience close to Kenya's capital." },
        { name: "Diani Beach", description: "Tropical beaches, ocean experiences and luxury coastal stays." },
        { name: "Watamu", description: "Marine experiences, beaches and coastal relaxation." },
        { name: "Lamu", description: "Swahili culture, historic architecture and an intimate Indian Ocean atmosphere." },
      ],
    },
    whenToGo: {
      heading: "Every Season Tells a Different Story",
      body: [
        "Kenya can be experienced throughout the year, but the ideal timing depends on what you want to see and experience.",
        "For travellers interested in wildlife viewing and the Great Migration, we plan your itinerary around seasonal wildlife movements and your preferred safari experience. For a safari and beach holiday, we can combine the timing of your wildlife journey with the Kenyan coast for a seamless transition from wilderness to ocean.",
        "Tell us what you want to experience, and we'll recommend the right timing for your journey.",
      ],
    },
    itineraries: {
      heading: "Journeys Designed Around You",
      items: [
        { name: "The Classic Kenya Safari", description: "Experience the iconic landscapes and wildlife of Maasai Mara, Lake Nakuru and Amboseli in one carefully designed journey." },
        { name: "Kenya Wildlife & Wilderness", description: "Combine the Mara with Laikipia or Samburu for a deeper exploration of Kenya's diverse landscapes." },
        { name: "Kenya Safari & Beach", description: "Begin with an unforgettable wildlife safari before relaxing on the Indian Ocean coast." },
        { name: "Kenya Honeymoon", description: "Combine private game drives, intimate luxury camps, romantic wilderness experiences and a beautiful coastal escape." },
        { name: "Kenya Family Safari", description: "Create a private journey with family-friendly camps, engaging wildlife experiences and a comfortable pace designed around your group." },
        { name: "Kenya & Tanzania", description: "Combine the Maasai Mara and Serengeti for an extraordinary cross-border East African safari." },
      ],
    },
    beyondBigFive: {
      heading: "Kenya Has More Stories to Tell",
      body: [
        "A luxury Kenya safari can be about much more than wildlife. Experience Maasai culture, conservation initiatives, photography, walking safaris, private dinners, scenic flights, mountain adventures and coastal experiences.",
        "We help you discover the Kenya that matches your idea of Africa. Your interests shape the journey.",
      ],
      tagline: "Your interests shape the journey.",
    },
    faqs: [
      { q: "What is Kenya best known for?", a: "Kenya is renowned for world-class wildlife safaris, the Maasai Mara, the Great Migration, elephants in Amboseli, diverse landscapes and its Indian Ocean coastline." },
      { q: "What is the best place for a safari in Kenya?", a: "Kenya has several exceptional safari destinations, including Maasai Mara, Amboseli, Samburu, Laikipia, Tsavo and Lake Nakuru. The right destination depends on your interests, travel dates and preferred safari style." },
      { q: "Is Kenya suitable for a luxury safari?", a: "Absolutely. Kenya offers a wide range of luxury lodges, private camps, conservancy experiences, private guiding and tailor-made safari options." },
      { q: "When is the best time to visit Kenya for safari?", a: "Kenya is a year-round safari destination. The best time depends on whether your priority is wildlife viewing, the Great Migration, photography, fewer crowds or combining safari with a beach holiday." },
      { q: "Can I see the Great Migration in Kenya?", a: "Yes. The Maasai Mara is an important part of the greater Mara–Serengeti ecosystem and can provide spectacular seasonal wildlife experiences during the migration period." },
      { q: "Can I combine Kenya with Tanzania?", a: "Yes. A Kenya and Tanzania safari can combine destinations such as the Maasai Mara and Serengeti, creating a broader East African wildlife journey." },
      { q: "Can I combine a Kenya safari with a beach holiday?", a: "Yes. Kenya's Indian Ocean coastline makes it possible to combine a luxury safari with a beach escape in destinations such as Diani, Watamu or Lamu." },
      { q: "Is Kenya good for a honeymoon?", a: "Kenya is well suited to tailor-made honeymoons, combining private wildlife experiences, luxury camps, romantic wilderness settings and Indian Ocean beaches." },
    ],
    cta: {
      heading: "Ready to Experience Kenya?",
      body: "Tell us what you imagine when you think of Kenya — the Great Migration, elephants beneath Kilimanjaro, a private safari, a romantic escape, family adventure or safari and beach. Our Kenya destination specialists will transform your ideas into a personalised journey.",
      cta: "Plan My Kenya Safari",
      tagline: "Your Africa. Your way. Unzip Kenya.",
    },
  },
  uganda: {
    country: "Uganda",
    tagline: "The Pearl of Africa",
    subtitle: "Where Wild Africa Feels Personal",
    heroImage: "https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg",
    intro: {
      eyebrow: "UGANDA",
      title: "The Pearl of Africa",
      body: [
        "Welcome to Uganda — the Pearl of Africa, a destination where mist-covered forests, open savannahs, powerful rivers and extraordinary wildlife come together.",
        "At Unzip Africa, we create bespoke luxury Uganda safaris for travellers looking to experience Uganda beyond the ordinary. From intimate encounters with mountain gorillas in Bwindi to chimpanzee trekking in Kibale, classic game drives and unforgettable wilderness experiences, every journey is thoughtfully designed around you.",
      ],
      cta: "Plan Your Uganda Safari",
    },
    unzipped: {
      heading: "Uganda, Unzipped",
      body: [
        "Uganda offers an extraordinary diversity of experiences within one destination. Its protected areas range from tropical forests and mountain ecosystems to expansive savannah landscapes, with ten national parks managed by the Uganda Wildlife Authority.",
        "What makes Uganda special is the opportunity to combine primate encounters, classic African wildlife, dramatic landscapes and authentic cultural experiences in one carefully crafted journey. This is Africa for travellers who want to go deeper.",
      ],
    },
    experiences: {
      heading: "Signature Uganda Experiences",
      subheading: "Extraordinary Encounters, Thoughtfully Curated",
      items: [
        { name: "Gorilla Trekking in Bwindi", description: "Step into the ancient forests of Bwindi Impenetrable National Park for one of Africa's most remarkable wildlife experiences — encountering mountain gorillas in their natural habitat. Gorilla trekking also takes place in Mgahinga Gorilla National Park.", experience: "Gorilla trekking · Private guiding · Forest walks" },
        { name: "Chimpanzee Tracking in Kibale", description: "Enter the lush forests of Kibale National Park, renowned for its chimpanzee tracking experiences and remarkable primate diversity. For travellers fascinated by Africa's great apes, Kibale can become one of the defining moments of a Uganda safari.", experience: "Chimpanzee tracking · Primate experiences · Forest exploration" },
        { name: "Queen Elizabeth National Park", description: "Combine classic savannah wildlife with dramatic landscapes in Queen Elizabeth National Park. From game drives to the Ishasha sector, Uganda's wildlife experiences can be combined with forest and primate adventures.", experience: "Game drives · Tree-climbing lions · Wildlife photography · Boat Safaris" },
        { name: "Murchison Falls National Park", description: "Experience one of Uganda's most spectacular wilderness destinations, where the mighty Nile moves through the park before reaching the dramatic Murchison Falls.", experience: "Wildlife safari · Nile experiences · Murchison Falls · Boat Safaris" },
        { name: "Kidepo Valley National Park", description: "For travellers seeking a more remote wilderness experience, Kidepo Valley National Park offers dramatic landscapes and a distinctly wild atmosphere in northeastern Uganda.", experience: "Remote wilderness · Game drives · Wildlife photography · Karamajong Culture" },
        { name: "Jinja & the Source of the Nile", description: "Experience Jinja, Uganda's adventure capital, where the Nile begins its journey north from Lake Victoria. Enjoy private river experiences, scenic boat cruises, cultural encounters and exhilarating adventure activities.", experience: "Adventure · White water rafting · Source of the Nile" },
      ],
    },
    whyChoose: {
      heading: "One Journey. Remarkable Diversity.",
      items: [
        { title: "Gorillas & Great Apes", body: "Encounter Mountain gorillas in Bwindi and chimpanzees in Kibale." },
        { title: "Classic African Wildlife", body: "Explore Uganda's savannah parks in search of elephants, lions, buffalo, giraffes and more." },
        { title: "Wild Landscapes", body: "From tropical forests and volcanic mountains to the Nile and open savannahs." },
        { title: "Authentic Experiences", body: "Go beyond wildlife to discover Uganda's cultures, communities and local stories." },
        { title: "Adventure & Wilderness", body: "Combine safari with trekking, hiking, river experiences and other outdoor adventures." },
        { title: "A More Personal Safari", body: "Uganda allows us to design journeys that combine different landscapes and experiences rather than following a single safari formula." },
      ],
    },
    luxury: {
      heading: "Your Journey, Elevated",
      body: [
        "Luxury in Uganda is not simply about where you sleep. It is about how you experience the destination. We carefully select lodges, camps, guides and experiences that complement your journey — creating a seamless combination of comfort, privacy, exceptional service and authentic connection with the wilderness.",
        "Whether you are planning a private Uganda safari, luxury honeymoon, family safari, gorilla trekking adventure or multi-country East African journey, our specialists create an itinerary around your priorities.",
      ],
      cta: "Create My Uganda Safari",
    },
    bestPlaces: {
      heading: "From Forest to Savannah",
      items: [
        { name: "Bwindi Impenetrable National Park", description: "Mountain gorilla trekking and forest experiences." },
        { name: "Mgahinga Gorilla National Park", description: "Gorilla trekking and the Virunga landscape." },
        { name: "Kibale National Park", description: "Chimpanzee tracking and primate experiences." },
        { name: "Queen Elizabeth National Park", description: "Savannah wildlife and diverse landscapes." },
        { name: "Murchison Falls National Park", description: "Wildlife, Nile experiences and Murchison Falls." },
        { name: "Kidepo Valley National Park", description: "Remote wilderness and spectacular scenery." },
        { name: "Rwenzori Mountains", description: "Mountain trekking and dramatic highland landscapes." },
        { name: "Lake Mburo National Park", description: "Wildlife and a more intimate safari experience." },
        { name: "Jinja", description: "Source of the Nile, scenic river experiences, adventure activities." },
        { name: "Sipi Falls", description: "Spectacular waterfalls, coffee experiences, hiking and breathtaking views." },
      ],
    },
    whenToGo: {
      heading: "Uganda Is a Year-Round Destination",
      body: [
        "Uganda can be travelled throughout the year, with different seasons offering different advantages depending on your interests.",
        "For gorilla and chimpanzee trekking, the experience can be enjoyed throughout the year, while wildlife viewing in savannah areas is generally particularly rewarding during drier periods. Rather than relying on a standard itinerary, we recommend planning your travel dates around what you most want to experience.",
      ],
    },
    beyondBigFive: {
      heading: "Uganda Has More Stories to Tell",
      body: [
        "A luxury Uganda safari can include primate encounters, classic wildlife, cultural experiences, adventure activities and community visits beyond the national parks.",
        "We help you discover the Uganda that matches your idea of Africa.",
      ],
      tagline: "Your interests shape the journey.",
    },
    faqs: [
      { q: "What is Uganda best known for?", a: "Uganda is particularly renowned for mountain gorilla trekking, chimpanzee tracking, diverse wildlife, dramatic landscapes and adventure experiences. Its protected areas include forests, savannahs, mountains and wetlands." },
      { q: "Where can I go gorilla trekking in Uganda?", a: "Gorilla trekking takes place in Bwindi Impenetrable National Park and Mgahinga Gorilla National Park." },
      { q: "Is Uganda good for a luxury safari?", a: "Yes. Uganda can be designed as a private, tailor-made luxury safari, combining premium accommodation, private guiding, gorilla trekking, wildlife experiences and personalised travel arrangements." },
      { q: "How long should I spend in Uganda?", a: "A well-rounded Uganda safari can range from approximately 7 to 14 days, depending on whether you want to focus on gorillas, wildlife, primates, adventure or combine several regions." },
      { q: "Can I combine Uganda with Kenya or Tanzania?", a: "Absolutely. Uganda can be combined with Kenya or Tanzania to create a wider East African safari, allowing you to experience Uganda's forests and great apes alongside the iconic savannahs of Kenya or Tanzania." },
      { q: "Is Uganda suitable for a honeymoon?", a: "Yes. A tailor-made Uganda honeymoon can combine private wildlife experiences, gorilla trekking, beautiful lodges, intimate wilderness stays and personalised activities." },
    ],
    cta: {
      heading: "Ready to Discover the Pearl of Africa?",
      body: "Tell us what you want from your Uganda safari — gorillas, chimpanzees, wildlife, adventure, culture, luxury or all of it. Our destination specialists will turn your ideas into a personalized journey through Uganda.",
      cta: "Plan My Uganda Safari",
      tagline: "Unzip Uganda. Experience Africa differently.",
    },
    conservation: {
      heading: "Protecting What Makes Uganda Extraordinary",
      body: [
        "We believe responsible luxury travel should create value beyond the journey. Unzip Africa supports wildlife conservation, local communities and ranger welfare as part of our commitment to responsible tourism.",
        "For every safari booking, 5% of Unzip Africa's net safari revenue is dedicated to ranger welfare, helping support the people working on the frontline of protecting Africa's wildlife and wilderness.",
      ],
      tagline: "Travel beautifully. Leave something meaningful behind.",
    },
  },
  tanzania: {
    country: "Tanzania",
    tagline: "The Wild, Unfiltered",
    subtitle: "Where Africa Feels Infinite",
    heroImage: "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
    intro: {
      eyebrow: "TANZANIA",
      title: "The Wild, Unfiltered",
      body: [
        "Welcome to Tanzania, a land of vast savannahs, extraordinary wildlife, ancient landscapes and pristine Indian Ocean islands.",
        "At Unzip Africa, we create bespoke luxury Tanzania safaris for discerning travellers seeking more than a standard safari. From the endless plains of the Serengeti and the wildlife-rich Ngorongoro Crater to the remote wilderness of Nyerere and the tropical shores of Zanzibar, every journey is carefully designed around you.",
      ],
      cta: "Plan My Tanzania Safari",
    },
    unzipped: {
      heading: "Tanzania, Unzipped",
      body: [
        "Tanzania is home to some of Africa's most celebrated wilderness areas, including the Serengeti National Park, Ngorongoro Conservation Area, Tarangire National Park and Nyerere National Park.",
        "But Tanzania's magic goes beyond its famous parks. It is the silence of the Serengeti at sunrise, elephants beneath ancient baobabs, the spectacle of the Great Migration, the volcanic landscapes of Ngorongoro and the warm Swahili culture of Zanzibar. This is Tanzania for travellers who want to experience Africa at its most immersive.",
      ],
    },
    experiences: {
      heading: "Signature Tanzania Experiences",
      subheading: "Extraordinary Encounters, Thoughtfully Curated",
      items: [
        { name: "The Serengeti", description: "Enter one of Africa's most iconic wilderness landscapes, where vast grasslands stretch towards the horizon and wildlife moves with the rhythm of the seasons.", experience: "Great Migration · Big Five · Private game drives · Wildlife photography" },
        { name: "Ngorongoro Crater", description: "Descend into the spectacular Ngorongoro Crater, a UNESCO World Heritage Site and one of Tanzania's most remarkable wildlife destinations.", experience: "Big Five · Crater safari · Scenic viewpoints · Maasai culture" },
        { name: "Tarangire National Park", description: "Discover a landscape defined by ancient baobab trees, seasonal rivers and large elephant populations. Tarangire offers a distinctive safari experience and pairs beautifully with Serengeti and Ngorongoro.", experience: "Elephants · Baobabs · Wildlife photography · Private game drives" },
        { name: "Nyerere National Park", description: "Venture into southern Tanzania for a more expansive and immersive wilderness experience. Formerly known as the Selous Game Reserve, Nyerere National Park offers an opportunity to explore Tanzania beyond the traditional northern safari circuit.", experience: "Boat safaris · Walking experiences · Wildlife · Remote wilderness" },
        { name: "Ruaha National Park", description: "Discover one of Tanzania's most dramatic and less-visited wilderness destinations. Ruaha National Park is known for its rugged landscapes, large elephant populations and exceptional sense of remoteness.", experience: "Remote safari · Elephants · Predators · Photography" },
        { name: "Zanzibar", description: "End your safari beside the Indian Ocean on the beautiful island of Zanzibar. Explore historic Stone Town, discover Swahili culture, relax on white-sand beaches or enjoy private ocean experiences after your time in the wilderness.", experience: "Luxury beach escapes · Stone Town · Swahili culture · Indian Ocean" },
      ],
    },
    whyChoose: {
      heading: "One Country. Endless Possibilities.",
      items: [
        { title: "Iconic Wildlife", body: "Experience some of Africa's most celebrated wildlife landscapes and exceptional game viewing." },
        { title: "The Great Migration", body: "Follow one of nature's most extraordinary wildlife spectacles through the Serengeti ecosystem." },
        { title: "Remarkable Landscapes", body: "From volcanic craters and endless savannah to baobab-dotted wilderness and tropical islands." },
        { title: "Private Wilderness", body: "Discover remote southern and western Tanzania for a more intimate safari experience." },
        { title: "Rich Culture", body: "Connect with Tanzania's diverse communities and discover the country's Swahili heritage." },
        { title: "Safari & Beach", body: "Combine an unforgettable safari with a relaxing luxury escape in Zanzibar." },
      ],
    },
    luxury: {
      heading: "Designed Around the Way You Travel",
      body: [
        "Luxury is not simply about a beautiful lodge. It is privacy, thoughtful service, exceptional locations, seamless logistics and the freedom to experience Tanzania at your own pace.",
        "Unzip Africa creates tailor-made Tanzania safaris for couples, honeymooners, families, photographers, private groups and discerning travellers. We carefully select accommodation and experiences to create a journey that feels effortless from beginning to end.",
      ],
      cta: "Create My Tanzania Safari",
    },
    bestPlaces: {
      heading: "From the Serengeti to Zanzibar",
      items: [
        { name: "Serengeti National Park", description: "Iconic wildlife, vast plains and the Great Migration." },
        { name: "Ngorongoro Conservation Area", description: "Dramatic volcanic landscapes, wildlife and Maasai cultural experiences." },
        { name: "Tarangire National Park", description: "Elephants, ancient baobabs and beautiful seasonal landscapes." },
        { name: "Lake Manyara National Park", description: "Diverse habitats, birdlife and scenic Rift Valley landscapes." },
        { name: "Nyerere National Park", description: "Vast wilderness, boat safaris and a more remote southern Tanzania experience." },
        { name: "Ruaha National Park", description: "Rugged landscapes, elephants and exceptional wilderness." },
        { name: "Mahale Mountains National Park", description: "Remote lakeside wilderness and chimpanzee experiences." },
        { name: "Kilimanjaro", description: "Africa's highest mountain and one of the continent's most iconic landscapes." },
        { name: "Zanzibar", description: "Tropical beaches, Swahili culture and luxury Indian Ocean escapes." },
      ],
    },
    whenToGo: {
      heading: "The Right Season for Your Story",
      body: [
        "Tanzania is a year-round destination, but different seasons offer different safari experiences.",
        "For Great Migration safaris, your travel dates are particularly important. For general wildlife viewing, photography, honeymoon travel or a safari-and-beach holiday, we can recommend the timing and route based on your priorities.",
        "Tell us when you want to travel and we'll help you understand what Tanzania can offer during your dates and design the itinerary accordingly.",
      ],
    },
    beyondBigFive: {
      heading: "Discover the Tanzania Behind the Safari",
      body: [
        "Tanzania offers far more than traditional game drives. Experience walking safaris, cultural encounters, photography, mountain trekking, private wilderness experiences, Swahili heritage and Indian Ocean adventures.",
        "We help you combine the experiences that matter most to you into one seamless journey.",
      ],
      tagline: "See more. Feel more. Experience Tanzania deeply.",
    },
    faqs: [
      { q: "What is Tanzania best known for?", a: "Tanzania is renowned for the Serengeti, the Great Migration, Ngorongoro Crater, Mount Kilimanjaro, exceptional wildlife and Zanzibar's Indian Ocean beaches." },
      { q: "What is the best place for a safari in Tanzania?", a: "Tanzania has several outstanding safari destinations, including Serengeti, Ngorongoro, Tarangire, Nyerere and Ruaha. The best choice depends on your travel dates, interests and preferred safari experience." },
      { q: "Is Tanzania good for a luxury safari?", a: "Yes. Tanzania offers exceptional luxury lodges, private camps, exclusive experiences and tailor-made safari options." },
      { q: "When is the best time to visit Tanzania?", a: "Tanzania can be visited throughout the year. The ideal time depends on your priorities, particularly if you want to experience the Great Migration, specific wildlife events or combine your safari with Zanzibar." },
      { q: "When is the Great Migration in Tanzania?", a: "The Great Migration is a continuous annual movement rather than a single event. Wildlife moves through the Serengeti and wider Mara–Serengeti ecosystem throughout the year." },
      { q: "Can I see the Big Five in Tanzania?", a: "Tanzania is one of East Africa's major destinations for lion, leopard, elephant, buffalo and rhinoceros sightings, although wildlife sightings are naturally never guaranteed." },
      { q: "Can I combine Tanzania with Zanzibar?", a: "Yes. A Tanzania safari and Zanzibar holiday is one of the most popular ways to combine wildlife and wilderness with an Indian Ocean beach escape." },
      { q: "Can I combine Tanzania with Kenya?", a: "Yes. Kenya and Tanzania can be combined into a single East African safari, including destinations such as the Maasai Mara and Serengeti." },
      { q: "Can I combine Tanzania with Uganda?", a: "Yes. Combining Tanzania with Uganda allows travellers to experience Serengeti wildlife and the Great Migration alongside Uganda's gorilla trekking and primate experiences." },
      { q: "Is Tanzania suitable for a honeymoon?", a: "Tanzania is an excellent destination for a tailor-made honeymoon, combining private safaris, luxury camps, romantic wilderness settings and a Zanzibar beach escape." },
    ],
    cta: {
      heading: "Ready to Unzip Tanzania?",
      body: "Tell us what you are dreaming about — the Great Migration, the Serengeti, Kilimanjaro, a private luxury safari, a honeymoon or a safari and Zanzibar escape. Our Tanzania specialists will turn your ideas into a personalised East African journey.",
      cta: "Plan My Tanzania Safari",
      tagline: "Your Africa. Your way. Unzip Tanzania.",
    },
  },
  rwanda: {
    country: "Rwanda",
    tagline: "The Land of a Thousand Hills",
    subtitle: "Intimate. Extraordinary. Unforgettable.",
    heroImage: "https://sfile.chatglm.cn/images-ppt/09d7d51041e7.jpg",
    intro: {
      eyebrow: "RWANDA",
      title: "The Land of a Thousand Hills",
      body: [
        "Welcome to Rwanda, a beautifully transformed destination where mist-covered mountains, ancient forests, remarkable wildlife and vibrant culture create an entirely different way to experience Africa.",
        "At Unzip Africa, we design bespoke luxury Rwanda safaris for discerning travellers seeking intimate wildlife encounters, exceptional hospitality and meaningful experiences. From mountain gorilla trekking in Volcanoes National Park to chimpanzees in Nyungwe Forest and wildlife safaris in Akagera, Rwanda offers remarkable experiences within a beautifully compact destination.",
      ],
      cta: "Plan My Rwanda Safari",
    },
    unzipped: {
      heading: "Rwanda, Unzipped",
      body: [
        "Rwanda may be small, but its landscapes and experiences are remarkably diverse. Travel through rolling green hills, enter ancient rainforest, encounter endangered mountain gorillas and explore savannah landscapes where elephants, lions, leopards, buffalo and rhinos can be found.",
        "Beyond wildlife, Rwanda offers rich cultural experiences, exceptional hospitality, conservation stories and Kigali's contemporary energy. For travellers looking for a sophisticated and immersive East African journey, Rwanda offers a compelling combination of wilderness, culture and understated luxury.",
      ],
    },
    experiences: {
      heading: "Signature Rwanda Experiences",
      subheading: "Extraordinary Encounters, Thoughtfully Curated",
      items: [
        { name: "Gorilla Trekking in Volcanoes National Park", description: "Come face-to-face with one of Africa's most extraordinary wildlife experiences. Volcanoes National Park is home to endangered mountain gorillas and forms part of the wider Virunga mountain ecosystem.", experience: "Gorilla trekking · Private guiding · Mountain landscapes · Wildlife photography" },
        { name: "Chimpanzee Trekking in Nyungwe", description: "Enter the ancient rainforest of Nyungwe National Park, one of Africa's remarkable forest ecosystems. Track chimpanzees through dense forest and discover a rich diversity of primates and birdlife. For an elevated forest experience, the Nyungwe canopy walkway offers spectacular views over the rainforest.", experience: "Chimpanzee trekking · Canopy walkway · Forest exploration · Birdwatching" },
        { name: "Akagera National Park", description: "Discover Rwanda's savannah side in Akagera National Park, a landscape of lakes, wetlands, woodland and open plains. The park offers classic African wildlife experiences, including opportunities to see the Big Five, alongside beautiful scenery and birdlife.", experience: "Big Five · Game drives · Boat safaris · Birdwatching" },
        { name: "Kigali", description: "Begin or end your journey in Kigali, Rwanda's vibrant and beautifully organised capital. Discover contemporary restaurants, art, design, local markets and important historical sites before continuing into the wilderness.", experience: "City discovery · Art & culture · Culinary experiences · Local life" },
        { name: "Lake Kivu", description: "Slow down beside the tranquil waters of Lake Kivu, one of Africa's Great Lakes. Enjoy scenic boat experiences, lakeside relaxation, nature walks and authentic encounters around one of Rwanda's most beautiful landscapes.", experience: "Lakeside escapes · Boat trips · Scenic landscapes · Relaxation" },
        { name: "Rwanda's Cultural Experiences", description: "A Rwanda journey becomes richer when you connect with the people and traditions behind the landscape. From community experiences to local food, crafts and cultural encounters, we help you discover Rwanda beyond its national parks.", experience: "Local culture · Culinary experiences · Community visits · Authentic encounters" },
      ],
    },
    whyChoose: {
      heading: "Small Country. Extraordinary Experiences.",
      items: [
        { title: "Mountain Gorillas", body: "Experience one of Africa's most sought-after wildlife encounters in Volcanoes National Park." },
        { title: "Primate Adventures", body: "Combine gorilla trekking with chimpanzee and other primate experiences in Rwanda's forests." },
        { title: "Classic Safari", body: "Explore Akagera's savannah landscapes and discover Rwanda's remarkable wildlife." },
        { title: "Exceptional Landscapes", body: "From the Virunga volcanoes and rainforest to rolling hills and Lake Kivu." },
        { title: "Culture & History", body: "Discover Rwanda's people, traditions, cuisine, art and remarkable journey of transformation." },
        { title: "Easy to Combine", body: "Rwanda can be combined with Uganda, Kenya and Tanzania to create a wider East African adventure." },
      ],
    },
    luxury: {
      heading: "Quiet Luxury. Deeply Personal.",
      body: [
        "For us, luxury is not about excess. It is exceptional service, beautiful surroundings, privacy, seamless logistics and the freedom to experience Rwanda at your own pace.",
        "We carefully select boutique hotels, luxury lodges, camps, guides and experiences that complement your journey. Whether you are planning a luxury Rwanda safari, gorilla trekking holiday, honeymoon, family adventure or multi-country East African safari, we tailor every element around you.",
      ],
      cta: "Create My Rwanda Safari",
    },
    bestPlaces: {
      heading: "Rwanda's Remarkable Destinations",
      items: [
        { name: "Volcanoes National Park", description: "Mountain gorilla trekking and the Virunga mountain landscape." },
        { name: "Nyungwe National Park", description: "Chimpanzee trekking, canopy walkway and ancient rainforest." },
        { name: "Akagera National Park", description: "Savannah wildlife, Big Five and beautiful lake landscapes." },
        { name: "Kigali", description: "Rwanda's capital — art, culture, cuisine and history." },
        { name: "Lake Kivu", description: "Lakeside escapes, boat trips and scenic relaxation." },
        { name: "Musanze Caves", description: "Underground cave exploration and geological wonders." },
      ],
    },
    whenToGo: {
      heading: "Choose the Season Around Your Experience",
      body: [
        "Rwanda is a year-round destination, but the ideal timing depends on what you want to experience.",
        "For gorilla and chimpanzee trekking, conditions can vary by season, while Akagera offers different wildlife-viewing opportunities throughout the year. If gorilla trekking is the centrepiece of your journey, we recommend planning your itinerary around your preferred dates and then building the rest of your Rwanda experience around them.",
        "Tell us when you want to travel and we'll help you design the right combination of wildlife, wilderness, culture and luxury for your dates.",
      ],
    },
    beyondBigFive: {
      heading: "Discover Rwanda's Other Stories",
      body: [
        "Rwanda's gorillas may be its most famous attraction, but they are only part of the story. Explore chimpanzee-filled forests, savannah wildlife, volcanic landscapes, Lake Kivu, local culture and Kigali's contemporary energy.",
        "Our role is to connect these experiences into a seamless journey that feels personal rather than packaged.",
      ],
      tagline: "Come for the gorillas. Stay for everything else.",
    },
    faqs: [
      { q: "What is Rwanda best known for?", a: "Rwanda is best known for mountain gorilla trekking, Volcanoes National Park, its beautiful rolling hills, Nyungwe rainforest, Akagera National Park and vibrant Kigali." },
      { q: "Where can I see gorillas in Rwanda?", a: "Mountain gorilla trekking takes place in Volcanoes National Park, in the Virunga Mountains of northern Rwanda." },
      { q: "Is Rwanda good for a luxury safari?", a: "Yes. Rwanda offers luxury lodges, boutique accommodation, private guiding and tailor-made wildlife experiences, particularly around Volcanoes National Park and other major destinations." },
      { q: "How long should I spend in Rwanda?", a: "A Rwanda safari can range from 4 to 10+ days, depending on whether you want to focus on gorillas or combine gorilla trekking with Akagera, Nyungwe, Lake Kivu and Kigali." },
      { q: "Can I combine Rwanda with Uganda?", a: "Yes. Rwanda and Uganda are particularly well suited to a combined gorilla and primate safari, allowing travellers to experience different landscapes and wildlife experiences in two neighbouring countries." },
      { q: "Can I combine Rwanda with Kenya or Tanzania?", a: "Yes. Rwanda can be combined with Kenya or Tanzania for a broader East African itinerary, pairing gorilla trekking with classic savannah safaris." },
      { q: "What can I do in Rwanda besides gorilla trekking?", a: "You can experience chimpanzee trekking, Big Five safaris, canopy walks, cultural experiences, Lake Kivu, hiking, birdwatching and Kigali's art, food and history." },
      { q: "Is Rwanda suitable for a honeymoon?", a: "Yes. A tailor-made Rwanda honeymoon can combine gorilla trekking, luxury accommodation, private experiences, scenic landscapes and relaxing stays around Lake Kivu." },
    ],
    cta: {
      heading: "Ready to Unzip Rwanda?",
      body: "Tell us what you are dreaming about — gorillas, chimpanzees, Big Five wildlife, volcanoes, Lake Kivu, culture or a luxurious East African escape. Our Rwanda specialists will create a journey around your interests, travel dates and style.",
      cta: "Plan My Rwanda Safari",
      tagline: "Your Africa. Your way. Unzip Rwanda.",
    },
  },
};

export const destinationCountries = [
  { id: "uganda", label: "Uganda" },
  { id: "kenya", label: "Kenya" },
  { id: "tanzania", label: "Tanzania" },
  { id: "rwanda", label: "Rwanda" },
];
