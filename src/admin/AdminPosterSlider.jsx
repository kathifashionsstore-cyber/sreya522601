import { AdminCollectionEditor } from './AdminCollectionEditor'
import { bannerSchema } from './formSchemas'

export default function AdminPosterSlider() {
  return (
    <AdminCollectionEditor
      title="Poster Slider"
      path="banners"
      fallback={[]}
      schema={bannerSchema}
      description="Upload images for the homepage promotional/poster slider below the service categories. These auto-slide every 2 seconds."
    />
  )
}
