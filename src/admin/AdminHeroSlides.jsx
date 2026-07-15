import { AdminCollectionEditor } from './AdminCollectionEditor'
import { heroSlides } from '../data/seed'
import { heroSlideSchema } from './formSchemas'

export default function AdminHeroSlides() {
  return <AdminCollectionEditor title="Hero Slides" path="heroSlides" fallback={heroSlides} schema={heroSlideSchema} description="Edit home hero slides: image, badge, title, subtitle, CTAs, ordering, and active state." />
}
