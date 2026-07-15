import { doc, writeBatch } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { payments, publicSettings, seedCollections } from '../data/seed'
import { defaultTheme } from '../lib/theme'

export async function syncSeedData() {
  const batch = writeBatch(db)
  batch.set(doc(db, 'settings', 'public'), publicSettings, { merge: true })
  batch.set(doc(db, 'settings', 'payments'), payments, { merge: true })
  batch.set(doc(db, 'settings', 'theme'), defaultTheme, { merge: true })
  Object.entries(seedCollections).forEach(([collectionName, items]) => {
    items.forEach((item) => {
      batch.set(doc(db, collectionName, item.id), item, { merge: true })
    })
  })
  await batch.commit()
}
