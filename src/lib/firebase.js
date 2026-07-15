import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyD6deakPCYZb1uQTeZSockr3R6qAsXs4Ps',
  authDomain: 'sreya-hospital.firebaseapp.com',
  projectId: 'sreya-hospital',
  storageBucket: 'sreya-hospital.firebasestorage.app',
  messagingSenderId: '323450082455',
  appId: '1:323450082455:web:1e190a87ea875d3d4585d2',
  measurementId: 'G-GE3S3C1HL4',
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)


const recaptchaSiteKey =
  import.meta.env.VITE_RECAPTCHA_V3_SITE_KEY || 'PASTE_RECAPTCHA_V3_SITE_KEY_HERE'

export const appCheck =
  typeof window !== 'undefined' && recaptchaSiteKey !== 'PASTE_RECAPTCHA_V3_SITE_KEY_HERE'
    ? initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true,
      })
    : null

export let analytics = null
if (typeof window !== 'undefined' && import.meta.env.PROD) {
  isSupported()
    .then((supported) => {
      analytics = supported ? getAnalytics(app) : null
    })
    .catch(() => {
      analytics = null
    })
}
