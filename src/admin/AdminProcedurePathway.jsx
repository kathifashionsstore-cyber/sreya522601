import { AdminCollectionEditor } from './AdminCollectionEditor'
import { procedurePathwaySchema } from './formSchemas'

export default function AdminProcedurePathway() {
  return (
    <AdminCollectionEditor
      title="Procedure Pathway"
      path="procedurePathway"
      fallback={[]}
      schema={procedurePathwaySchema}
      description="Configure the global Step-by-Step Procedure Process shown across all sub-services."
    />
  )
}
