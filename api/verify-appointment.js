import { adminDb } from './lib/firebaseAdmin.js'
import { getIp, rateLimit } from './lib/rateLimit.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const limited = rateLimit({ key: `verify:${getIp(req)}`, limit: 60 })
  if (!limited.ok) return res.status(429).json({ error: 'Too many requests' })

  const receiptId = req.query.receiptId
  if (!receiptId) return res.status(400).json({ error: 'Missing receiptId' })

  const snapshot = await adminDb
    .collection('appointments')
    .where('receiptId', '==', receiptId)
    .limit(1)
    .get()

  if (snapshot.empty) return res.status(404).json({ verified: false })
  const doc = snapshot.docs[0]
  const data = doc.data()
  return res.status(200).json({
    verified: true,
    receiptId: data.receiptId,
    status: data.status,
    department: data.department,
    preferredDate: data.preferredDate,
    preferredTime: data.preferredTime,
  })
}
