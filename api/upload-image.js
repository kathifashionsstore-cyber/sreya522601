import fs from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import formidable from 'formidable'
import fetch from 'node-fetch'
import { adminAuth } from './lib/firebaseAdmin.js'
import { getIp, rateLimit } from './lib/rateLimit.js'
import { captureException, initSentry } from './lib/sentry.js'

export const config = { api: { bodyParser: false } }

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

function firstFile(file) {
  return Array.isArray(file) ? file[0] : file
}

export default async function handler(req, res) {
  initSentry()
  const requestId = randomUUID()
  const startedAt = Date.now()
  if (req.method === 'GET') return res.status(200).json({ ok: true, service: 'upload-image' })
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const limited = rateLimit({ key: `upload:${getIp(req)}`, limit: 20 })
  if (!limited.ok) return res.status(429).json({ error: 'Too many uploads. Try again later.' })

  const idToken = req.headers.authorization?.replace('Bearer ', '')
  try {
    await adminAuth.verifyIdToken(idToken)
  } catch {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!process.env.IMGBB_API_KEY) {
    return res.status(500).json({ error: 'IMGBB_API_KEY is not configured' })
  }

  const form = formidable({ maxFileSize: 300 * 1024, multiples: false })
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(JSON.stringify({ requestId, event: 'upload_bad_request', error: err.message }))
      return res.status(400).json({ error: 'Bad upload' })
    }
    const file = firstFile(files.image)
    if (!file) return res.status(400).json({ error: 'Missing image file' })
    if (!allowedTypes.includes(file.mimetype)) return res.status(400).json({ error: 'Invalid file type' })
    if (file.size > 300 * 1024) return res.status(400).json({ error: 'Image must be 300KB or smaller' })

    try {
      const buffer = await fs.readFile(file.filepath)
      const body = new URLSearchParams()
      body.set('image', buffer.toString('base64'))
      body.set('name', fields.name || file.originalFilename || 'sreya-image')

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
        method: 'POST',
        body,
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        console.error(JSON.stringify({ requestId, event: 'imgbb_failed', status: response.status, error: data.error?.message }))
        return res.status(502).json({ error: data.error?.message || 'ImgBB upload failed' })
      }
      console.log(JSON.stringify({ requestId, event: 'image_uploaded', durationMs: Date.now() - startedAt, size: file.size }))
      return res.status(200).json({
        url: data.data.url,
        delete_url: data.data.delete_url,
        thumbUrl: data.data.thumb?.url || data.data.display_url,
      })
    } catch (uploadError) {
      captureException(uploadError, { requestId, event: 'upload_failed' })
      console.error(JSON.stringify({ requestId, event: 'upload_failed', error: uploadError.message, durationMs: Date.now() - startedAt }))
      return res.status(500).json({ error: uploadError.message || 'Upload failed' })
    }
  })
}
