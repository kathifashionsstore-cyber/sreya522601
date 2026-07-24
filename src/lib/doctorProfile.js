export const confirmedDoctorQualifications = 'M.S (OBG), MRCOG (UK)'

export function displayDoctorQualifications(value, fallback = confirmedDoctorQualifications) {
  const clean = String(value || '').trim()
  if (!clean || clean.toLowerCase().startsWith('qualifications pending')) return fallback
  return clean
}

export function doctorQualificationList(value) {
  return displayDoctorQualifications(value)
    .split(/[\n,]/)
    .map((qualification) => qualification.trim())
    .filter(Boolean)
}
