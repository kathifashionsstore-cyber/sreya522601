import fs from 'node:fs'
import { afterAll, beforeAll, describe, it } from 'vitest'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const maybeDescribe = process.env.FIRESTORE_EMULATOR_HOST ? describe : describe.skip

maybeDescribe('firestore security rules', () => {
  let testEnv

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'sreya-hospital-test',
      firestore: {
        rules: fs.readFileSync('firestore.rules', 'utf8'),
      },
    })
  })

  afterAll(async () => {
    await testEnv?.cleanup()
  })

  it('lets public users create appointments but not read them', async () => {
    const db = testEnv.unauthenticatedContext().firestore()
    const ref = doc(db, 'appointments', 'public-create')
    await assertSucceeds(setDoc(ref, {
      patientName: 'Test Patient',
      phone: '+919999999999',
      email: '',
      department: 'IVF Consultation',
      preferredDate: '2026-08-01',
      preferredTime: '10:00',
      message: '',
      status: 'pending',
      source: 'online',
      consentToContact: true,
      notificationChannel: 'none',
    }))
    await assertFails(getDoc(ref))
  })

  it('blocks public draft blog reads', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'blogPosts', 'draft'), { title: 'Draft', published: false })
    })
    await assertFails(getDoc(doc(testEnv.unauthenticatedContext().firestore(), 'blogPosts', 'draft')))
  })

  it('allows only admins to write settings and services', async () => {
    const editorDb = testEnv.authenticatedContext('editor-user', { editor: true }).firestore()
    const adminDb = testEnv.authenticatedContext('admin-user', { admin: true }).firestore()
    await assertFails(setDoc(doc(editorDb, 'settings', 'theme'), { colors: {} }))
    await assertFails(setDoc(doc(editorDb, 'serviceCategories', 'fertility'), { title: 'Nope' }))
    await assertSucceeds(setDoc(doc(adminDb, 'settings', 'theme'), { colors: {} }))
  })

  it('allows editors to work on gallery, contacts, appointments, and blog', async () => {
    const editorDb = testEnv.authenticatedContext('editor-user', { editor: true }).firestore()
    await assertSucceeds(setDoc(doc(editorDb, 'gallery', 'one'), { title: 'Room', imageUrl: '', order: 1 }))
    await assertSucceeds(setDoc(doc(editorDb, 'blogPosts', 'post'), { title: 'Post', published: true }))
  })
})
