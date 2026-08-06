export const appointmentDepartments = [
  'Infertility/IVF',
  'Pregnancy Care',
  'Gynecological/Non Pregnancy Related',
  'Health Checkup',
  'Wellness & Nutrition',
]

export function normalizeAppointmentDepartment(value = '') {
  return appointmentDepartments.includes(value) ? value : ''
}
