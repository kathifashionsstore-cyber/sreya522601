import { getLockedServiceDepartments, serviceDepartments } from '../../mockData/services'
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection'
import { Select } from '../shared/Input'

export function DepartmentSelect({ currentValue = '', ...props }) {
  const { data } = useFirestoreCollection('departments', serviceDepartments)
  const items = getLockedServiceDepartments(data)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
  const hasCurrent = currentValue && items.some((department) => department.name === currentValue)
  return (
    <Select {...props}>
      <option value="">Choose a department</option>
      {currentValue && !hasCurrent ? <option value={currentValue}>{currentValue}</option> : null}
      {items.map((department) => (
        <option key={department.id} value={department.name}>
          {department.name}
        </option>
      ))}
    </Select>
  )
}
