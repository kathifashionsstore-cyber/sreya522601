import { Select } from '../shared/Input'
import { appointmentDepartments, normalizeAppointmentDepartment } from './appointmentDepartments'

export function DepartmentSelect({ value = '', ...props }) {
  const selectedValue = normalizeAppointmentDepartment(value)

  return (
    <Select {...props} value={selectedValue}>
      <option value="">Choose a department</option>
      {appointmentDepartments.map((department) => (
        <option key={department} value={department}>
          {department}
        </option>
      ))}
    </Select>
  )
}
