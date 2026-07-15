export const fallbackFacilities = [
  {
    id: "rooms-non-ac",
    title: "Non-AC Rooms",
    category: "rooms",
    description: "Comfortable and well-ventilated non-AC patient rooms designed for routine observation. Equipped with standard amenities, doctor call bells, and comfortable visitor seating.",
    amenities: ["Attached washroom", "Visitor chair", "Nurse call system", "24/7 power backup"],
    images: [
      { imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80", altText: "Non-AC Room interior" }
    ],
    videoUrl: "",
    order: 1,
    active: true
  },
  {
    id: "rooms-ac",
    title: "AC Rooms",
    category: "rooms",
    description: "Climate-controlled personal recovery rooms offering quiet privacy and comfort during recovery. Features air conditioning, semi-fowler beds, and personal storage.",
    amenities: ["Air conditioning", "Semi-Fowler bed", "Attached washroom", "Television", "24/7 nursing support"],
    images: [
      { imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80", altText: "AC Room interior" }
    ],
    videoUrl: "",
    order: 2,
    active: true
  },
  {
    id: "rooms-suite",
    title: "Premium Suite Rooms",
    category: "rooms",
    description: "Deluxe suite accommodations offering spacious comfort, private lounge area, personal refrigerator, and premium patient care services for families seeking maximum privacy.",
    amenities: ["Premium patient bed", "Private visitor lounge", "Refrigerator & TV", "Attached deluxe washroom", "Dedicated nurse assistance"],
    images: [
      { imageUrl: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=800&q=80", altText: "Premium Suite interior" }
    ],
    videoUrl: "",
    order: 3,
    active: true
  },
  {
    id: "icu",
    title: "Intensive Care Unit (ICU)",
    category: "icu",
    description: "Equipped with multipara monitors, oxygen flowmeters, and emergency crash carts. Serves critical monitoring pathways with round-the-clock intensive care nursing.",
    amenities: ["Defibrillator & Crash Cart", "Multipara Monitors", "Central Oxygen Support", "24/7 ICU Nurse Supervision"],
    images: [
      { imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80", altText: "ICU setup" }
    ],
    videoUrl: "",
    order: 4,
    active: true
  },
  {
    id: "advanced-tech",
    title: "Advanced Technology Showcase",
    category: "tech",
    description: "State-of-the-art incubation chambers, sterile clean rooms conforming to ICMR guidelines, and micromanipulator stations for ICSI.",
    amenities: ["Laser-Assisted Hatching", "Stereo Zoom Microscopes", "Trigas Incubators", "Clean Room HEPA Filters"],
    images: [
      { imageUrl: "https://images.unsplash.com/photo-1579156286657-41d3d68aa0a9?auto=format&fit=crop&w=800&q=80", altText: "Advanced incubator technology" }
    ],
    videoUrl: "",
    order: 5,
    active: true
  },
  {
    id: "welfare",
    title: "Welfare Programs for Society",
    category: "welfare",
    description: "Our community outreach programs focus on spreading reproductive health awareness, organizing free initial checks, and counseling programs for local families.",
    amenities: ["Free Screening Camps", "Rural Health Seminars", "Medically Safe Guidelines", "Community Support Teams"],
    images: [
      { imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80", altText: "Community counselling sessions" }
    ],
    videoUrl: "",
    order: 6,
    active: true
  },
  {
    id: "ivf-labs",
    title: "IVF Laboratory",
    category: "ivf",
    description: "Advanced clean-room design ensuring sterile micro-environments for embryo culture, egg retrievals, and ICSI procedures under leading embryologists.",
    amenities: ["Laminar Flow Cabinets", "CO2 Incubators", "Advanced Embryology Tools", "ICMR Certified Safety Protocols"],
    images: [
      { imageUrl: "https://images.unsplash.com/photo-1581093458791-9d2fcea0a349?auto=format&fit=crop&w=800&q=80", altText: "IVF embryology lab" }
    ],
    videoUrl: "",
    order: 7,
    active: true
  },
  {
    id: "ot",
    title: "OT (Operation Theatre)",
    category: "ot",
    description: "Equipped with premium surgical tables, anaesthetic machines, and high-definition laparoscopy/hysteroscopy towers for egg retrieval and fertility procedures.",
    amenities: ["HD Laparoscopy Tower", "Anaesthetic Gas Monitors", "C-Arm Compatible Table", "Sterile Air Flow System"],
    images: [
      { imageUrl: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80", altText: "OT suite" }
    ],
    videoUrl: "",
    order: 8,
    active: true
  },
  {
    id: "lab",
    title: "Diagnostic Lab",
    category: "lab",
    description: "Comprehensive diagnostic testing services covering baseline hormones, semen analysis, and infectious disease screens under rigid laboratory quality control.",
    amenities: ["Hormone Analyzer", "Automated Semen Profiler", "Infectious Disease Assay Setup", "NABL Standard Audits"],
    images: [
      { imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80", altText: "Diagnostic lab bench" }
    ],
    videoUrl: "",
    order: 9,
    active: true
  },
  {
    id: "board-room",
    title: "Board Room",
    category: "boardroom",
    description: "Space dedicated for medical conferences, case reviews, and clinical strategy sessions where doctors align on complex treatment cycles.",
    amenities: ["AV Presentation System", "Specialist Conference Setup", "Case Discussion Board", "High-Speed Connectivity"],
    images: [
      { imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80", altText: "Board room interior" }
    ],
    videoUrl: "",
    order: 10,
    active: true
  }
]
