import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

function getCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    let jsonStr = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    jsonStr = jsonStr.replace(/"private_key":\s*"([^"]*)"/s, (match, p1) => {
      return `"private_key": "${p1.replace(/\r?\n/g, '\\n')}"`
    })
    return cert(JSON.parse(jsonStr))
  }
  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PROJECT_ID) {
    return cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    })
  }
  return applicationDefault()
}

const apps = getApps()
const app = apps.length === 0
  ? initializeApp({
      credential: getCredential(),
      projectId: process.env.FIREBASE_PROJECT_ID || 'sreya-hospital',
    })
  : apps[0]

export const adminAuth = getAuth(app)
export const adminDb = getFirestore(app)
