import admin from 'firebase-admin'

const commit = process.argv.includes('--commit')
const collectionName = 'subServices'

function initialize() {
  if (admin.apps.length) return
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)),
    })
    return
  }
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  })
}

function normalizeDiagnosisSteps(steps = []) {
  return steps.map((step) => ({
    title: step.title || 'Step',
    description: step.description || (step.bullets || []).join(' '),
  }))
}

function normalizeTreatmentOptions(doc) {
  if (Array.isArray(doc.treatmentOptions) && doc.treatmentOptions.length) return doc.treatmentOptions
  return (doc.benefits || []).map((benefit) => ({
    name: benefit,
    description: doc.whatIsIt || 'Discuss this option with the Sreya Hospitals care team.',
    icon: 'CheckCircle2',
  }))
}

function migrateDoc(doc) {
  const next = {
    featured: Boolean(doc.featured),
    videoUrl: doc.videoUrl || doc.youtubeUrl || '',
    whatIsIt:
      doc.whatIsIt ||
      (doc.benefits || []).join(' ') ||
      `${doc.title || 'This service'} is explained by the Sreya Hospitals team after consultation.`,
    whatIsItImage: doc.whatIsItImage || doc.images?.[0] || '',
    classification: doc.classification || [],
    causes: doc.causes?.length ? doc.causes : doc.benefits || [],
    riskFactors: doc.riskFactors || [],
    symptoms: doc.symptoms?.length ? doc.symptoms : doc.warningSigns || [],
    diagnosisSteps: doc.diagnosisSteps?.length ? doc.diagnosisSteps : normalizeDiagnosisSteps(doc.stepsProcess || []),
    treatmentOptions: normalizeTreatmentOptions(doc),
    whyChooseOverride: doc.whyChooseOverride || [],
    preventionTips: doc.preventionTips?.length ? doc.preventionTips : doc.homeCareAdvice || [],
    enabledSections: {
      video: true,
      whatIsIt: true,
      classification: true,
      causes: true,
      riskFactors: true,
      symptoms: true,
      diagnosis: true,
      treatment: true,
      whyChoose: true,
      prevention: true,
      ...(doc.enabledSections || {}),
    },
    benefits: admin.firestore.FieldValue.delete(),
    stepsProcess: admin.firestore.FieldValue.delete(),
    homeCareAdvice: admin.firestore.FieldValue.delete(),
    warningSigns: admin.firestore.FieldValue.delete(),
    youtubeUrl: admin.firestore.FieldValue.delete(),
  }
  return next
}

initialize()
const db = admin.firestore()
const snapshot = await db.collection(collectionName).get()

console.log(`${commit ? 'Committing' : 'Dry run for'} ${snapshot.size} sub-service documents`)

for (const item of snapshot.docs) {
  const payload = migrateDoc(item.data())
  console.log(`${commit ? 'Updating' : 'Would update'} ${item.id}`)
  if (commit) {
    await item.ref.set(payload, { merge: true })
  }
}

console.log(commit ? 'Migration complete.' : 'Dry run complete. Re-run with --commit to write changes.')
