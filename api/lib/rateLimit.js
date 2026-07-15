const buckets = new Map()

export function rateLimit({ key, limit = 20, windowMs = 10 * 60 * 1000 }) {
  const now = Date.now()
  const existing = buckets.get(key) || { count: 0, resetAt: now + windowMs }
  if (existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1 }
  }
  existing.count += 1
  buckets.set(key, existing)
  return {
    ok: existing.count <= limit,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
  }
}

export function getIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.headers['x-real-ip']
    || req.socket?.remoteAddress
    || 'unknown'
  )
}
