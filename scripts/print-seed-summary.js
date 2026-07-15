import {
  blogPosts,
  departments,
  doctors,
  faqs,
  gallery,
  heroSlides,
  serviceCategories,
  subServices,
  testimonials,
} from '../src/data/seed.js'

console.table({
  heroSlides: heroSlides.length,
  serviceCategories: serviceCategories.length,
  subServices: subServices.length,
  doctors: doctors.length,
  gallery: gallery.length,
  blogPosts: blogPosts.length,
  testimonials: testimonials.length,
  faqs: faqs.length,
  departments: departments.length,
})
