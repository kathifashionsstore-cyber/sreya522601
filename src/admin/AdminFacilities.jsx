import { AdminCollectionEditor } from './AdminCollectionEditor'
import { fallbackFacilities } from '../mockData/facilities'
import { facilitySchema } from './formSchemas'

export default function AdminFacilities() {
  return (
    <AdminCollectionEditor
      title="Facilities"
      path="facilities"
      fallback={fallbackFacilities}
      schema={facilitySchema}
      description="Configure hospital facility sections: patient recovery wards (AC, non-AC, Suite), advanced laboratories (IVF, OT, ICU, diagnostic lab), welfare outreach programs, and board rooms."
    />
  )
}
