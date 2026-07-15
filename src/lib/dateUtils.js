export function yearsSince(startYear, currentYear = new Date().getFullYear()) {
  const start = Number(startYear)
  const current = Number(currentYear)
  if (!Number.isFinite(start) || !Number.isFinite(current) || start <= 0) return 0
  return Math.max(0, current - start)
}
