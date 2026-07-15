import { fallbackFacilities } from '../mockData/facilities'
import {
  Award,
  Baby,
  CalendarHeart,
  Clock,
  HeartHandshake,
  HeartPulse,
  MapPin,
  Microscope,
  PlayCircle,
  Ribbon,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  TrendingUp,
  UsersRound,
} from 'lucide-react'

export const placeholderImages = {
  hero: '/hero-care-team.jpg',
  familySupport:
    'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=1400&q=80',
  consultation:
    'https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=1400&q=80',
  lab:
    'https://images.unsplash.com/photo-1581093458791-9d2fcea0a349?auto=format&fit=crop&w=1400&q=80',
  doctor:
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1000&q=80',
  family:
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1400&q=80',
  care:
    'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1400&q=80',
}

export const publicSettings = {
  hospitalName: 'Sreya Hospitals & IVF Centre',
  tagline: 'Focused fertility treatments and fertility testing with calm clinical guidance.',
  practicingSinceYear: 2009,
  doctorExperienceYears: 17,
  phone: '',
  whatsapp: '',
  email: '',
  address:
    'Address pending confirmation - Narasaraopet, Palnadu District, Andhra Pradesh 522601',
  mapEmbedUrl: '',
  businessHours: 'Daily consultation timings pending hospital confirmation.',
  logoUrl: '',
  maintenanceMode: false,
  socialLinks: {
    instagram: '',
    facebook: '',
    youtube: '',
    justdial: '',
  },
  utilityBar: {
    enabled: true,
    leftLinks: [
      { label: 'Find Our Doctor', href: '/doctors', iconKey: 'Stethoscope' },
      { label: 'Hospital Gallery', href: '/gallery', iconKey: 'GalleryHorizontal' },
    ],
    phoneLabel: 'Call Sreya Hospitals',
    appointmentLabel: 'Book An Appointment',
    appointmentLink: '/appointment',
  },
  navItems: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Doctors', href: '/doctors' },
    { label: 'Facilities', href: '/facilities' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  heroStats: [
    {
      label: 'Years of Experience',
      value: 'experienceYears',
      suffix: '+',
      iconKey: 'Award',
      sourceField: 'practicingSinceYear',
      needsVerification: true,
    },
    { label: 'Successful IVF/Delivery Cases', value: '2000', suffix: '+', iconKey: 'Baby', needsVerification: true },
    { label: 'Patient Rating', value: '4.8', suffix: '★', iconKey: 'Star', needsVerification: true },
    { label: 'Families Counselled', value: '600', suffix: '+', iconKey: 'UsersRound', needsVerification: true },
  ],
  stats: [
    { label: 'Years of experience', value: 'experienceYears', suffix: '+', sourceField: 'practicingSinceYear' },
    { label: 'Parenthood journeys', value: '2000', suffix: '+', needsVerification: true },
    { label: 'Care categories', value: '2' },
    { label: 'Directory rating', value: '4.8', needsVerification: true },
  ],
  expertiseSection: {
    eyebrow: 'Our Expertise',
    title: 'Comprehensive Fertility Care & Testing',
    body: 'Browse care categories maintained by the hospital team through Firestore.',
    buttonLabel: 'View All Specialities',
  },
  quickServiceSection: {
    viewAllLabel: 'View All Services',
  },
  trustSection: {
    eyebrow: 'How To Choose',
    title: 'Choose care that feels clear before it feels clinical',
    body: 'These trust points are editable from the admin panel and appear only where the public site needs them.',
  },
  differentiatorSection: {
    eyebrow: 'What Makes Sreya Different',
    title: 'Built around one hospital, one local community, and personal attention',
    body: 'Hospital-wide differentiators can also be reused on service pages unless a sub-service has its own override.',
  },
  testimonialSection: {
    eyebrow: 'Patient Stories',
    title: 'Video and written success stories',
    body: 'Real testimonials should be published only after consent is confirmed by the hospital.',
    viewAllLabel: 'View All',
    galleryTitle: 'Moments of care, trust, and clinical attention',
    galleryBody: 'Admin-uploaded photos from the gallery can be used here to show real hospital spaces and team moments.',
  },
  ctaSection: {
    eyebrow: 'Start with a consultation',
    title: 'Book a visit for fertility treatment or fertility testing.',
    body: 'Online appointment requests are stored as pending until the hospital confirms them.',
    primaryLabel: 'Book Appointment',
    secondaryLabel: 'WhatsApp',
  },
  pageBanners: {
    services: {
      badge: 'Services',
      title: 'Comprehensive fertility care and testing',
      subtitle: 'Every category and sub-service is editable from the admin panel.',
      imageUrl: placeholderImages.lab,
    },
    about: {
      badge: 'About Sreya Hospitals',
      title: 'Fertility care for Palnadu families',
      subtitle: 'A premium hospital website foundation built so every public detail can be verified and edited by staff.',
      imageUrl: placeholderImages.care,
    },
    doctors: {
      badge: 'Doctors',
      title: 'Specialist-led fertility care',
      subtitle: 'Doctor details are editable and verification-aware.',
      imageUrl: placeholderImages.doctor,
    },
    successStories: {
      badge: 'Facilities',
      title: 'Advanced Infrastructure & Wards',
      subtitle: 'Take a tour of our diagnostic testing labs, cleanroom IVF labs, and premium recovery rooms.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80',
    },
    gallery: {
      badge: 'Gallery',
      title: 'A visual look at care spaces',
      subtitle: 'Replace placeholder images with verified hospital photographs from admin.',
      imageUrl: placeholderImages.care,
    },
    blog: {
      badge: 'Blog',
      title: 'Patient education for informed care',
      subtitle: 'Blog posts are stored as plain paragraph arrays to avoid unsafe HTML.',
      imageUrl: placeholderImages.consultation,
    },
    contact: {
      badge: 'Contact',
      title: 'Reach the Sreya Hospitals team',
      subtitle: 'Phone and exact address are intentionally pending until hospital confirmation.',
      imageUrl: placeholderImages.care,
    },
    appointment: {
      badge: 'Appointment',
      title: 'Request an appointment',
      subtitle: 'Your request is stored as pending until the hospital confirms it.',
      imageUrl: placeholderImages.consultation,
    },
  },
  aboutPage: {
    eyebrow: 'Our Story',
    title: 'Care that starts with clarity.',
    paragraphs: [
      'Sreya Hospitals & IVF Centre is positioned as a focused fertility treatment and fertility testing destination in Narasaraopet. The seed content includes public-directory claims only as verification-needed placeholders until hospital staff confirms the exact details.',
      'The website is designed for non-technical admins: every hero, service, doctor profile, blog post, gallery item, FAQ, announcement, and appointment department can be managed from the admin panel.',
    ],
    milestones: [
      { year: 2009, title: 'Specialist practice begins', description: 'Practicing start year is editable and used for dynamic experience calculations.' },
      { year: 2026, title: 'Advanced admin-first website', description: 'The public website is wired to Firestore-managed content and theme tokens.' },
    ],
  },
  seo: {
    title: 'Sreya Hospitals & IVF Centre | IVF Centre Narasaraopet',
    description:
      'Sreya Hospitals & IVF Centre offers fertility treatments and fertility testing in Narasaraopet, Palnadu.',
    ogImage: placeholderImages.hero,
  },
  announcementBar: {
    enabled: true,
    text: 'Advanced oocyte and embryo culture services under specialist guidance in Narasaraopet.',
    link: '/appointment',
    bgColor: '#0D9488',
    textColor: '#FFFFFF',
    marquee: true,
  },
  googleRating: "4.8",
  googleReviewCount: "120",
  googleReviewUrl: '',
  googleReviews: [],
  homeBridgeSection: {
    badgeText: "Empowering Your Pathway",
    title: "Personalised Care Guided By Decades of Clinical Experience",
    body: "At Sreya, you consult directly with our lead specialist at every step. From standard follicular scans to advanced clean-room embryo monitoring, your family journey is managed with continuous transparency.",
    bridgeImageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=80",
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=80",
    overlayColor: "#0F172A",
    overlayOpacity: 0.58,
    primaryButtonLabel: "Book Appointment",
    primaryButtonLink: "/appointment",
    secondaryButtonLabel: "Hospital Gallery",
    secondaryButtonLink: "/gallery"
  },
  parallaxExperience: {
    badgeText: "Proven Clinical Leadership",
    title: "Pioneering Fertility Breakthroughs in Narasaraopet",
    body: "Guided by Dr. Vasanta Kiran Mekala, Sreya has spent nearly two decades bringing state-of-the-art reproductive science and transparent IVF practices to the Palnadu region.",
    imageUrl: "https://images.unsplash.com/photo-1579156286657-41d3d68aa0a9?auto=format&fit=crop&w=1600&q=80"
  },
  hospitalMomentsVideo1: "/videos/hospital-moments-1.mp4",
  hospitalMomentsVideo2: "/videos/hospital-moments-2.mp4",
  doctorsPage: {
    heroTitle: "Advanced Fertility Care, Backed by Experience",
    heroSubtitle: "Meet our specialist-led clinical care team dedicated to your parenthood journey.",
    heroImage1: "/hero-care-team.jpg",
    heroImage2: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1400&q=80",
    heroImage3: "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=1400&q=80",
    advancedHeading: "The Advanced Way of Care",
    advancedBody: "Sreya Hospitals & IVF Centre leverages state-of-the-art laboratory embryology and modern clinical scans. Under Dr. Vasanta Kiran Mekala's direction, we provide patient-focused, evidence-based reproductive science to maximize successful outcomes.",
    teamHeading: "The Team Behind Every Success",
    teamBody: "Our medical, nursing, embryology, and counselling staff work cohesively under one roof in Narasaraopet. We align our diagnostic precision and personal care to walk with you at every milestone.",
    teamImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1000&q=80"
  }
}

export const trustPoints = [
  {
    id: 'specialist-led-care',
    iconKey: 'HeartHandshake',
    heading: 'Specialist-Led Care',
    body: 'Consultations are led by fertility and women\'s health specialists who explain next steps in clear language.',
    order: 1,
    active: true,
  },
  {
    id: 'modern-fertility-lab',
    iconKey: 'Microscope',
    heading: 'Modern Fertility Lab',
    body: 'Lab and treatment content is editable so the hospital can publish only confirmed capabilities.',
    order: 2,
    active: true,
  },
  {
    id: 'ethical-counselling',
    iconKey: 'ShieldCheck',
    heading: 'Transparent & Ethical Counselling',
    body: 'Pages avoid invented outcomes and guide visitors toward personalised consultation.',
    order: 3,
    active: true,
  },
  {
    id: 'one-roof-care',
    iconKey: 'Sparkles',
    heading: 'Women\'s Care Under One Roof',
    body: 'Fertility treatments, fertility testing, and treatment-related surgical pathways are coordinated together.',
    order: 4,
    active: true,
  },
  {
    id: 'free-camps',
    iconKey: 'CalendarHeart',
    heading: 'Personal Attention & Care',
    body: 'We provide focused, patient-centric fertility support with transparent guidelines at every milestone.',
    order: 5,
    active: true,
  },
]

export const differentiators = [
  {
    id: 'local-single-location-focus',
    iconKey: 'MapPin',
    heading: 'Single-Location Focus',
    body: 'The site is tailored to Sreya Hospitals in Narasaraopet instead of a multi-city chain model.',
    order: 1,
    active: true,
  },
  {
    id: 'verification-aware-content',
    iconKey: 'ShieldCheck',
    heading: 'Verification-Aware Content',
    body: 'Claims that need hospital confirmation are marked until the admin team updates them.',
    order: 2,
    active: true,
  },
  {
    id: 'admin-first-site',
    iconKey: 'Sparkles',
    heading: 'Admin-First Website',
    body: 'Public pages pull from Firestore collections and settings rather than code-only copy.',
    order: 3,
    active: true,
  },
  {
    id: 'care-continuity',
    iconKey: 'HeartPulse',
    heading: 'Continuity of Care',
    body: 'Service pages connect education, appointment requests, FAQs, and related services in one flow.',
    order: 4,
    active: true,
  },
]

export const payments = {
  upiId: '',
  displayName: 'Sreya Hospitals',
  note: 'UPI details are hidden until confirmed by the hospital admin.',
  showOnContact: false,
  showOnAppointment: false,
}

export const heroSlides = [
  {
    id: 'journey-parenthood',
    imageUrl: placeholderImages.hero,
    altText: 'Fertility consultation room placeholder image',
    badgeText: 'First IVF Centre in Palnadu',
    title: 'Your journey to parenthood, guided with care',
    subtitle:
      'Advanced fertility and women\'s health care led by Dr. M. Vasanta Kiran in Narasaraopet.',
    ctaText: 'Book Appointment',
    ctaLink: '/appointment',
    secondaryCtaText: 'Free Counselling Camp',
    secondaryCtaLink: '/free-camp',
    floatingLabel: '2,000+ journeys',
    floatingCaption: 'Verify before publishing',
    order: 1,
    active: true,
  },
  {
    id: 'fertility-testing',
    imageUrl: placeholderImages.consultation,
    altText: 'Fertility testing consultation placeholder image',
    badgeText: 'Fertility Testing & Diagnostics',
    title: 'Clear answers before treatment begins',
    subtitle:
      'From hormone profiles and scans to semen analysis and partner screening, the team keeps couples informed before treatment decisions.',
    ctaText: 'Explore Services',
    ctaLink: '/services',
    secondaryCtaText: 'Call Now',
    secondaryCtaLink: 'tel:',
    floatingLabel: 'Family-centred care',
    floatingCaption: 'Editable in admin',
    order: 2,
    active: true,
  },
]

export const iconMap = {
  Award,
  Baby,
  CalendarHeart,
  Clock,
  HeartHandshake,
  HeartPulse,
  MapPin,
  Microscope,
  PlayCircle,
  Ribbon,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  TrendingUp,
  UsersRound,
}

import {
  serviceCategories as mockCategories,
  serviceDepartments as mockDepartments,
  subServices as mockSubServices,
} from '../mockData/services'

export const serviceCategories = mockCategories
export const subServices = mockSubServices
export const departments = mockDepartments

export const doctors = [
  {
    id: 'dr-m-vasanta-kiran',
    name: 'Dr. M. Vasanta Kiran',
    photoUrl: placeholderImages.doctor,
    altText: 'Doctor profile placeholder image',
    qualifications: 'Qualifications pending hospital confirmation',
    specialty: 'Infertility Specialist, Gynecologist, and Obstetrician',
    practicingSinceYear: 2009,
    experienceYears: 'experienceYears',
    proceduresCount: '2000+ parenthood journeys',
    awards: ['First IVF/test-tube-baby centre in Palnadu - verify before publishing'],
    memberships: ['Membership details pending confirmation'],
    consultationTiming: 'Timings pending confirmation',
    freeCampInfo: 'Free fertility counselling camp on the last Sunday of every month.',
    bio:
      'Dr. M. Vasanta Kiran leads fertility and women\'s health care at Sreya Hospitals & IVF Centre. Public directory details must be verified by the hospital before final publishing.',
    faqs: [
      { q: 'Can I bring previous fertility reports?', a: 'Yes. Bring all prior scans, prescriptions, and lab reports for review.' },
      { q: 'Are exact success rates published online?', a: 'No. Success depends on individual factors and is discussed during consultation.' },
    ],
    journeySteps: [
      {
        title: 'First Consultation',
        description: 'Meet Dr. Vasanta Kiran, share your history, and discuss your goals in a calm consultation.',
        imageUrl: placeholderImages.consultation,
      },
      {
        title: 'Personalized Evaluation',
        description: 'Testing and diagnostics are selected around your reports, age, cycle pattern, and partner factors.',
        imageUrl: placeholderImages.lab,
      },
      {
        title: 'Treatment Planning',
        description: 'The care team explains timelines, medicines, procedures, and costs before a plan begins.',
        imageUrl: placeholderImages.care,
      },
      {
        title: 'Ongoing Care & Support',
        description: 'Monitoring, scan visits, and treatment decisions stay guided by the specialist throughout the journey.',
        imageUrl: placeholderImages.doctor,
      },
      {
        title: 'Celebrating Success',
        description: 'The team supports your outcome with clarity, follow-up guidance, and continued care.',
        imageUrl: placeholderImages.family,
      },
    ],
    needsVerification: true,
  },
]

export const gallery = [
  {
    id: 'consultation-room',
    imageUrl: placeholderImages.consultation,
    title: 'Dr. Vasanta Kiran Consulting Room',
    shortDescription: 'Compassionate initial evaluations and report reviews with our lead specialist.',
    category: 'hospital',
    album: 'reception',
    date: '2026-03-10',
    location: 'Sreya Hospitals, Narasaraopet',
    photographer: 'Hospital Staff',
    tags: 'Consulting, Specialist, Clinic',
    featured: true,
    homepage: true,
    status: 'published',
    altText: 'Dr Vasanta Kiran Consulting Room Sreya Hospitals',
    order: 1,
    active: true
  },
  {
    id: 'fertility-lab',
    imageUrl: placeholderImages.lab,
    title: 'Advanced IVF Laboratory',
    shortDescription: 'State-of-the-art clean room and embryology incubation chambers conforming to international ICMR guidelines.',
    category: 'lab',
    album: 'lab',
    date: '2026-04-12',
    location: 'Main Lab, Sreya Hospitals',
    photographer: 'Technical Team',
    tags: 'Embryology, Incubation, High-Tech',
    featured: true,
    homepage: true,
    status: 'published',
    altText: 'Advanced IVF Laboratory Sreya Hospitals',
    order: 2,
    active: true
  },
  {
    id: 'counselling-session',
    imageUrl: placeholderImages.family,
    title: 'Patient Awareness & Counselling Session',
    shortDescription: 'Educating and empowering couples on assisted reproductive options and psychological readiness.',
    category: 'counselling',
    album: 'patient-awareness',
    date: '2026-05-18',
    location: 'Seminar Hall, Sreya Hospitals',
    photographer: 'Counselling Team',
    tags: 'Patient Care, Awareness, Counselling',
    featured: true,
    homepage: true,
    status: 'published',
    altText: 'Patient Awareness & Counselling Session Sreya Hospitals',
    order: 3,
    active: true
  },
  {
    id: 'operation-theatre',
    imageUrl: placeholderImages.care,
    title: 'Modern Endoscopic Operation Theatre',
    shortDescription: 'Equipped with the latest laparo-hysteroscopy equipment for minor corrective surgeries and egg retrieval procedures.',
    category: 'facilities',
    album: 'operation-theatre',
    date: '2026-06-05',
    location: 'OT Block A, Sreya Hospitals',
    photographer: 'OT In-Charge',
    tags: 'Laparoscopy, Egg Retrieval, Operation Theatre',
    featured: false,
    homepage: true,
    status: 'published',
    altText: 'Modern Endoscopic Operation Theatre Sreya Hospitals',
    order: 4,
    active: true
  },
  {
    id: 'doctor-team',
    imageUrl: placeholderImages.doctor,
    title: 'Dr. Vasanta Kiran and Medical Staff',
    shortDescription: 'Our experienced medical personnel committed to assisting you on your journey to parenthood.',
    category: 'doctors',
    album: 'doctors',
    date: '2026-06-15',
    location: 'Doctor Suite, Sreya Hospitals',
    photographer: 'Studio Alpha',
    tags: 'Staff, Doctors, Team',
    featured: true,
    homepage: true,
    status: 'published',
    altText: 'Dr. Vasanta Kiran and Medical Staff Sreya Hospitals',
    order: 5,
    active: true
  }
]

export const blogPosts = [
  {
    id: 'ivf-consultation-narasaraopet',
    title: 'What to Expect at Your First IVF Consultation',
    slug: 'first-ivf-consultation-narasaraopet',
    excerpt:
      'A calm, practical guide for couples preparing for a fertility consultation in Narasaraopet.',
    coverImageUrl: placeholderImages.consultation,
    category: 'Fertility',
    readTime: '4 min read',
    date: '2026-07-10',
    tags: ['IVF centre Narasaraopet', 'infertility treatment Andhra Pradesh'],
    author: 'Sreya Hospitals Care Team',
    authorTitle: 'Patient Education',
    content: [
      'Your first fertility consultation is a conversation, not a commitment to treatment. The doctor will review your medical history, prior reports, and goals.',
      'Couples are encouraged to bring previous scans, lab reports, prescriptions, and any fertility treatment documents.',
      'The care team should explain possible investigations, timelines, and next steps in clear language before a treatment plan is selected.',
    ],
    published: true,
  },
  {
    id: 'fertility-testing-before-treatment',
    title: 'Why Fertility Testing Comes Before Treatment',
    slug: 'fertility-testing-before-treatment-narasaraopet',
    excerpt:
      'Understand how scans, lab reports, and partner screening guide a clearer fertility plan.',
    coverImageUrl: placeholderImages.consultation,
    category: 'Fertility Testing',
    readTime: '5 min read',
    date: '2026-07-10',
    tags: ['fertility testing Narasaraopet'],
    author: 'Sreya Hospitals Care Team',
    authorTitle: 'Patient Education',
    content: [
      'Fertility testing helps identify ovulation, tubal, uterine, semen, hormonal, infectious, and genetic factors before a treatment plan is selected.',
      'Couples should bring prior scans, prescriptions, semen reports, hormone panels, and any previous IVF or IUI documents to the consultation.',
    ],
    published: true,
  },
]

export const testimonials = [
  {
    id: 'anonymous-parenthood',
    patientName: 'Anonymous',
    story:
      'The team explained each step with patience. This testimonial is sample content and should be replaced only after consent is confirmed.',
    rating: 5,
    youtubeUrl: '',
    date: '2026-07-10',
    consentConfirmed: false,
    order: 1,
  },
  {
    id: 'anonymous-testing',
    patientName: 'Anonymous',
    story:
      'The testing guidance helped us understand which reports mattered before treatment. Replace after written consent.',
    rating: 5,
    youtubeUrl: '',
    date: '2026-07-10',
    consentConfirmed: false,
    order: 2,
  },
]

export const faqs = []

export const seedCollections = {
  heroSlides,
  serviceCategories,
  subServices,
  trustPoints,
  differentiators,
  doctors,
  gallery,
  blogPosts,
  testimonials,
  departments,
  facilities: fallbackFacilities,
}
