import { AdminCollectionEditor } from './AdminCollectionEditor'
import { AdminSubServicesV2 } from './AdminSubServicesV2'
import { trustBlockSchema } from './formSchemas'

export default function AdminServices() {
  return (
    <div className="grid gap-8">
      <AdminSubServicesV2 />
      <AdminCollectionEditor
        title="Trust Points"
        path="trustPoints"
        fallback={[]}
        schema={trustBlockSchema}
        description="Home section: How To Choose / trust-building icon blocks."
      />
      <AdminCollectionEditor
        title="Differentiators"
        path="differentiators"
        fallback={[]}
        schema={trustBlockSchema}
        description="Home section and service-page fallback: What Makes Sreya Different."
      />
    </div>
  )
}
