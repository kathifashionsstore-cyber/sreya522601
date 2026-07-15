import { RefreshCw } from 'lucide-react'
import { Button } from '../components/shared/Button'
import { useToast } from '../components/shared/Toast'
import { getLockedServiceCategories } from '../mockData/services'
import { AdminCollectionEditor } from './AdminCollectionEditor'
import { AdminSubServicesV2 } from './AdminSubServicesV2'
import { serviceCategorySchema, trustBlockSchema } from './formSchemas'
import { syncSeedData } from './seedSync'

export default function AdminServices() {
  const { push } = useToast()
  async function sync() {
    try {
      await syncSeedData()
      push('Service seed data synced.', 'success')
    } catch (error) {
      push(error.message, 'error')
    }
  }
  return (
    <div className="grid gap-8">
      <AdminCollectionEditor
        title="Service Categories"
        path="serviceCategories"
        fallback={[]}
        schema={serviceCategorySchema}
        description="Locked service taxonomy: fertility treatments and fertility testing only."
        extraActions={<Button type="button" variant="secondary" onClick={sync}><RefreshCw className="size-4" /> Sync Seeds</Button>}
        transformData={(items) => getLockedServiceCategories(items, { includeInactive: true })}
        allowNew={false}
        allowDelete={false}
      />
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
