import { useEffect, useMemo, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

function normalizeSnapshot(snapshot, includeDeleted = false) {
  const docs = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
  return includeDeleted ? docs : docs.filter((item) => !item.deletedAt)
}

export function useFirestoreCollection(path, fallback = [], orderField = 'order', includeDeleted = false) {
  const [data, setData] = useState(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const fallbackKey = useMemo(() => JSON.stringify(fallback.map((item) => item.id || item.name)), [fallback])

  useEffect(() => {
    setData(fallback)
    let active = true
    let unsubscribe = () => {}
    try {
      console.log(`[FIRESTORE READ LISTENTING] path: "${path}"`)
      const ref = collection(db, path)
      const q = orderField ? query(ref, orderBy(orderField, 'asc')) : ref
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!active) return
          const next = normalizeSnapshot(snapshot, includeDeleted)
          console.log(`[FIRESTORE READ SUCCESS] path: "${path}", count: ${next.length}`)
          setData(next.length ? next : fallback)
          setLoading(false)
          setError(null)
        },
        (err) => {
          if (!active) return
          console.error(`[FIRESTORE READ ERROR] path: "${path}":`, err)
          setError(err)
          setData(fallback)
          setLoading(false)
        },
      )
    } catch (err) {
      console.error(`[FIRESTORE READ CRITICAL] path: "${path}":`, err)
      setError(err)
      setData(fallback)
      setLoading(false)
    }
    return () => {
      active = false
      unsubscribe()
    }
  }, [path, orderField, fallbackKey, includeDeleted])

  return { data, loading, error }
}

export function useFirestoreDoc(path, fallback = null) {
  const [data, setData] = useState(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    let unsubscribe = () => {}
    try {
      console.log(`[FIRESTORE DOC LISTENING] path: "${path}"`)
      unsubscribe = onSnapshot(
        doc(db, path),
        (snapshot) => {
          if (!active) return
          const exists = snapshot.exists()
          console.log(`[FIRESTORE DOC SUCCESS] path: "${path}", exists: ${exists}`)
          setData(exists ? { id: snapshot.id, ...snapshot.data() } : fallback)
          setLoading(false)
          setError(null)
        },
        (err) => {
          if (!active) return
          console.error(`[FIRESTORE DOC ERROR] path: "${path}":`, err)
          setError(err)
          setData(fallback)
          setLoading(false)
        },
      )
    } catch (err) {
      console.error(`[FIRESTORE DOC CRITICAL] path: "${path}":`, err)
      setError(err)
      setData(fallback)
      setLoading(false)
    }
    return () => {
      active = false
      unsubscribe()
    }
  }, [path])

  return { data, loading, error }
}

export function stripUndefined(obj) {
  if (!obj || typeof obj !== 'object') return obj

  if (Array.isArray(obj)) {
    return obj.map((item) => stripUndefined(item))
  }

  return Object.fromEntries(
    Object.entries(obj)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => {
        if (value && typeof value === 'object' && !(value instanceof Date)) {
          return [key, stripUndefined(value)]
        }
        return [key, value]
      })
  )
}

export async function saveDocument(path, payload, id) {
  const sanitized = stripUndefined(payload)
  const cleanPayload = {
    ...sanitized,
    updatedAt: serverTimestamp(),
  }
  
  const targetId = id || 'NEW_DOC'
  console.log(`[FIRESTORE WRITE START] path: "${path}/${targetId}"`, cleanPayload)
  
  if (id) {
    try {
      await setDoc(doc(db, path, id), cleanPayload, { merge: true })
      console.log(`[FIRESTORE WRITE SUCCESS] path: "${path}/${id}" (merged)`)
      return id
    } catch (err) {
      console.error(`[FIRESTORE WRITE ERROR] path: "${path}/${id}":`, err)
      throw err
    }
  }
  try {
    const created = await addDoc(collection(db, path), {
      ...cleanPayload,
      createdAt: serverTimestamp(),
    })
    console.log(`[FIRESTORE WRITE SUCCESS] path: "${path}/${created.id}" (created new)`)
    return created.id
  } catch (err) {
    console.error(`[FIRESTORE WRITE ERROR] path: "${path}/new":`, err)
    throw err
  }
}

export async function updateDocument(path, id, payload) {
  const sanitized = stripUndefined(payload)
  console.log(`[FIRESTORE UPDATE START] path: "${path}/${id}"`, sanitized)
  try {
    await updateDoc(doc(db, path, id), { ...sanitized, updatedAt: serverTimestamp() })
    console.log(`[FIRESTORE UPDATE SUCCESS] path: "${path}/${id}"`)
  } catch (err) {
    console.error(`[FIRESTORE UPDATE ERROR] path: "${path}/${id}":`, err)
    throw err
  }
}

export async function removeDocument(path, id) {
  console.log(`[FIRESTORE DELETE START] path: "${path}/${id}"`)
  try {
    await deleteDoc(doc(db, path, id))
    console.log(`[FIRESTORE DELETE SUCCESS] path: "${path}/${id}"`)
  } catch (err) {
    console.error(`[FIRESTORE DELETE ERROR] path: "${path}/${id}":`, err)
    throw err
  }
}
