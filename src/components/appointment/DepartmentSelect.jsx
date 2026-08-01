import { Select } from '../shared/Input'

const appointmentDepartments = [
  'Health Check-Up',
  'IVF',
  'Pregnancy Care',
  'Fertility Testing',
  'Gynaecology Related',
]

export function DepartmentSelect({ currentValue = '', ...props }) {
  const hasCurrent = currentValue && appointmentDepartments.includes(currentValue)

  return (
    <Select {...props}>
      <option value="">Choose a department</option>
      {currentValue && !hasCurrent ? <option value={currentValue}>{currentValue}</option> : null}
      {appointmentDepartments.map((department) => (
        <option key={department} value={department}>
          {department}
        </option>
      ))}
    </Select>
  )
}
