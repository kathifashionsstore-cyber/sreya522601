import { adminAuth, adminDb } from './lib/firebaseAdmin.js'
import { getIp, rateLimit } from './lib/rateLimit.js'

async function requireAdmin(req) {
  const idToken = req.headers.authorization?.replace('Bearer ', '')
  const decoded = await adminAuth.verifyIdToken(idToken)
  if (!decoded.admin) throw new Error('Admin role required')
  return decoded
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const limited = rateLimit({ key: `manage-admin:${getIp(req)}`, limit: 20 })
  if (!limited.ok) return res.status(429).json({ error: 'Too many requests' })

  let actor
  try {
    actor = await requireAdmin(req)
  } catch {
    return res.status(403).json({ error: 'Forbidden' })
  }

  const { email, role, action = 'set' } = req.body || {}
  if (!email || !['admin', 'editor', 'none'].includes(role)) {
    return res.status(400).json({ error: 'Email and valid role are required' })
  }

  const user = await adminAuth.getUserByEmail(email)
  const claims = action === 'revoke' || role === 'none'
    ? { admin: false, editor: false }
    : { admin: role === 'admin', editor: role === 'editor' }
  await adminAuth.setCustomUserClaims(user.uid, claims)
  await adminDb.collection('securityLog').add({
    event: 'admin_role_changed',
    actorUid: actor.uid,
    actorEmail: actor.email || '',
    targetUid: user.uid,
    targetEmail: email,
    role,
    action,
    timestamp: new Date(),
  })
  return res.status(200).json({ ok: true, uid: user.uid, role })
}
