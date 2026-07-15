import { AdminCollectionEditor } from './AdminCollectionEditor'
import { testimonials } from '../data/seed'
import { testimonialSchema } from './formSchemas'

export default function AdminTestimonials() {
  return <AdminCollectionEditor title="Testimonials" path="testimonials" fallback={testimonials} schema={testimonialSchema} description="Add text stories or youtubeUrl video testimonials. Publish real patient stories only after setting consentConfirmed to true." />
}
