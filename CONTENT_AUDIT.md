# Sreya Hospitals V2 Content Audit

Status: V2 pass completed in local workspace. This project folder is not a Git repository, so this audit is committed as a file only.

| Page | Element | Currently | Should be | Firestore path | Status |
|---|---|---|---|---|---|
| Global | Top utility links, phone, appointment CTA | missing / partially hardcoded in nav | `settings/public.utilityBar` | `settings/public` | fixed |
| Global | Announcement colors/text/link | Firestore text with hardcoded fallback color | `settings/public.announcementBar` plus theme tokens | `settings/public`, `settings/theme` | fixed |
| Global | Navbar labels | hardcoded array in `Navbar.jsx` | `settings/public.navItems` with route fallback | `settings/public` | fixed |
| Global | Navbar logo/name/contact | mixed settings and hardcoded button labels | settings-driven utility fields | `settings/public` | fixed |
| Global | Footer copyright year | computed already | `new Date().getFullYear()` | code-computed structural text | fixed |
| Home | Hero carousel slides | Firestore slides rendered as old split hero | rotating full-width banner carousel | `heroSlides` | fixed |
| Home | Hero stats | hardcoded/stale numbers in hero copy | `settings/public.heroStats`, dynamic experience | `settings/public` | fixed |
| Home | Featured quick links | missing | featured sub-services | `subServices.featured` | fixed |
| Home | Expertise headings/body/button | hardcoded section copy | `settings/public.expertiseSection` | `settings/public` | fixed |
| Home | How-to-choose trust blocks | hardcoded local array | repeatable trust point docs | `trustPoints` | fixed |
| Home | Differentiator blocks | hardcoded local copy | repeatable differentiator docs | `differentiators` | fixed |
| Home | Free camp banner | static seed import | live free camp document, dynamic next date | `freeCamp/{doc}` | fixed |
| Home | Testimonials | static quote cards only | text/video carousel with YouTube support | `testimonials` | fixed |
| Home | CTA copy/buttons | hardcoded headings/body | `settings/public.ctaSection` | `settings/public` | fixed |
| About | Page hero | hardcoded props | `settings/public.pageBanners.about` | `settings/public` | fixed |
| About | Story paragraphs | hardcoded JSX paragraphs | `settings/public.aboutPage.paragraphs` | `settings/public` | fixed |
| About | Milestones/cards | hardcoded local array | `settings/public.aboutPage.milestones` | `settings/public` | fixed |
| Services | Page hero | hardcoded props | `settings/public.pageBanners.services` | `settings/public` | fixed |
| Services | Category cards | generic repeated card style | category docs with accent colors | `serviceCategories` | fixed |
| Service Category | Sub-service cards | generic repeated card style | split cards using category accent | `subServices`, `serviceCategories` | fixed |
| Sub-Service Detail | Old benefits/process/home-care/warnings template | legacy sections | V2 10-section template | `subServices/{doc}` | fixed |
| Sub-Service Detail | Related services | missing | 3 same-category related services | `subServices` | fixed |
| Doctors | Page hero | hardcoded props | `settings/public.pageBanners.doctors` | `settings/public` | fixed |
| Doctors | Years of experience | `experienceYears` string | compute from `practicingSinceYear` | `doctors/{doc}` | fixed |
| Gallery | Page hero | hardcoded props | `settings/public.pageBanners.gallery` | `settings/public` | fixed |
| Blog | Page hero | hardcoded props | `settings/public.pageBanners.blog` | `settings/public` | fixed |
| FAQ | Page hero | hardcoded props | `settings/public.pageBanners.faq` | `settings/public` | fixed |
| Contact | Page hero | hardcoded props | `settings/public.pageBanners.contact` | `settings/public` | fixed |
| Appointment | Page hero | hardcoded props | `settings/public.pageBanners.appointment` | `settings/public` | fixed |
| Free Camp | Page hero | hardcoded props | `settings/public.pageBanners.freeCamp` | `settings/public` | fixed |
| Free Camp | Next camp date | static text | `nextCampDate` date string/timestamp with client-side rollover | `freeCamp/{doc}` | fixed |
| Success Stories | Dedicated page | missing | route using testimonial section settings and collection | `testimonials`, `settings/public.testimonialSection` | fixed |
| Admin | Theme customization | missing | 39+ color tokens, presets, contrast, typography | `settings/theme` | fixed |
| Admin | Sub-services editor | generic JSON editor | 10 labeled V2 page sections with per-section save | `subServices` | fixed |
| Admin | Trust/differentiator editors | missing | collection editors | `trustPoints`, `differentiators` | fixed |

Notes:

- Component/UI microcopy such as loading states, button accessibility labels, validation messages, and admin tool instructions remains in code as structural interface text.
- The Wayzentech attribution line remains fixed per the original requirement.
- The migration script is dry-run by default: `npm run migrate:subservices:v2`; production writes require `npm run migrate:subservices:v2:commit`.
