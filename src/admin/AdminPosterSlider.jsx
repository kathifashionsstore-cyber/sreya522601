import { AdminCollectionEditor } from './AdminCollectionEditor'
import { bannerSchema } from './formSchemas'

const fallbackBanners = [
  { id: 'banner-1', title: 'Poster Banner 1', imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1600&q=80', order: 1, active: true },
  { id: 'banner-2', title: 'Poster Banner 2', imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1600&q=80', order: 2, active: true },
  { id: 'banner-3', title: 'Poster Banner 3', imageUrl: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1600&q=80', order: 3, active: true },
  { id: 'banner-4', title: 'Poster Banner 4', imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=80', order: 4, active: true },
  { id: 'banner-5', title: 'Poster Banner 5', imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80', order: 5, active: true },
]

export default function AdminPosterSlider() {
  return (
    <AdminCollectionEditor
      title="Poster Slider"
      path="banners"
      fallback={fallbackBanners}
      schema={bannerSchema}
      description="Upload and manage up to 5 images for the homepage promotional/poster slider below the service categories. These auto-slide every 3 seconds on the website."
    />
  )
}
