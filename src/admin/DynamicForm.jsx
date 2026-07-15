import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, ChevronUp, GripVertical, ImagePlus, Loader2, Plus, Trash2, X } from 'lucide-react'
import { Button } from '../components/shared/Button'
import { Field, Input, Select, Textarea } from '../components/shared/Input'
import { auth } from '../lib/firebase'
import { ImageUploadField } from '../components/admin/ImageUploadField'

import { compressImage } from '../lib/imgCompress'

function clone(value) {
  if (Array.isArray(value)) return value.map((item) => clone(item))
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, clone(item)]))
  return value
}

function getByPath(source, path) {
  return String(path)
    .split('.')
    .reduce((current, key) => (current == null ? undefined : current[key]), source)
}

function setByPath(source, path, value) {
  const next = clone(source || {})
  const parts = String(path).split('.')
  let cursor = next
  parts.slice(0, -1).forEach((part) => {
    if (!cursor[part] || typeof cursor[part] !== 'object') cursor[part] = {}
    cursor = cursor[part]
  })
  cursor[parts.at(-1)] = value
  return next
}

function removeByPath(source, path) {
  const next = clone(source || {})
  const parts = String(path).split('.')
  let cursor = next
  parts.slice(0, -1).forEach((part) => {
    if (!cursor?.[part]) return
    cursor = cursor[part]
  })
  if (cursor) delete cursor[parts.at(-1)]
  return next
}

function emptyForField(field) {
  if (field.type === 'repeatableGroup' || field.type === 'richBulletList') return []
  if (field.type === 'boolean') return false
  if (field.type === 'number') return ''
  return ''
}

function youtubeId(url = '') {
  const value = String(url || '').trim()
  if (!value) return ''

  try {
    const parsed = new URL(value)
    const host = parsed.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      return parsed.pathname.split('/').filter(Boolean)[0] || ''
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      if (parsed.pathname === '/watch') return parsed.searchParams.get('v') || ''
      const [kind, id] = parsed.pathname.split('/').filter(Boolean)
      if (['embed', 'shorts', 'live'].includes(kind)) return id || ''
    }
  } catch {
    const match = value.match(/(?:youtu\.be\/|youtube\.com\/(?:.*[?&]v=|embed\/|shorts\/|live\/))([^?&/\s]+)/)
    return match?.[1] || ''
  }

  return ''
}

function isEmpty(value) {
  return value == null || value === '' || (Array.isArray(value) && value.length === 0)
}

function validateField(field, value) {
  if (field.required && isEmpty(value)) return `${field.label} is required.`
  if (field.maxLength && typeof value === 'string' && value.length > field.maxLength) {
    return `${field.label} must be ${field.maxLength} characters or fewer.`
  }
  if (field.type === 'youtubeUrl' && value && !youtubeId(value)) return 'Paste a valid YouTube URL.'
  return ''
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`inline-flex min-h-11 w-16 items-center rounded-full p-1 transition ${
        checked ? 'bg-brand-teal' : 'bg-slate-200'
      }`}
      aria-pressed={checked}
    >
      <span className={`size-8 rounded-full bg-white shadow-sm transition ${checked ? 'translate-x-6' : ''}`} />
    </button>
  )
}

function ImageField({ field, value, onChange }) {
  const [state, setState] = useState('idle')
  const [caption, setCaption] = useState('')
  const [progress, setProgress] = useState(0)
  const inputRef = useRef(null)

  async function uploadFile(file) {
    if (!file) return
    try {
      setState('compressing')
      setProgress(20)
      const compressed = await compressImage(file)
      setCaption(`${compressed.originalSizeKB}KB to ${compressed.compressedSizeKB}KB`)
      setState('uploading')
      setProgress(62)
      let uploadUrl = ''
      try {
        const token = await auth.currentUser?.getIdToken()
        if (!token) throw new Error('Please login as admin before uploading.')
        const form = new FormData()
        form.append('image', compressed.blob, compressed.fileName)
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        })
        if (response.ok) {
          const data = await response.json()
          uploadUrl = data.url
        } else {
          throw new Error('Local API failed')
        }
      } catch (backendError) {
        console.warn('Backend API upload failed, attempting direct client-side upload to ImgBB:', backendError)
        const apiKey = import.meta.env.VITE_IMGBB_API_KEY || '29ac7361c1d45b204ccd1955079102d7'
        const clientForm = new FormData()
        clientForm.append('image', compressed.blob)
        const clientRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: 'POST',
          body: clientForm,
        })
        const clientData = await clientRes.json()
        if (clientRes.ok && clientData.success) {
          uploadUrl = clientData.data.url
        } else {
          throw new Error(clientData.error?.message || 'Both API and direct upload failed.')
        }
      }
      onChange(uploadUrl)
      setProgress(100)
      setState('done')
      window.setTimeout(() => setState('idle'), 1600)
    } catch (error) {
      setState('error')
      setCaption(error.message || 'Upload failed')
    }
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-4">
        <div className="grid h-28 w-36 place-items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          {value ? (
            <img src={value} alt={`${field.label} preview`} className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="size-9 text-slate-400" />
          )}
        </div>
        <div className="grid gap-2">
          <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
            <ImagePlus className="size-4" /> {value ? `Change ${field.label}` : `Add ${field.label}`}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => uploadFile(event.target.files?.[0])}
          />
          {caption ? <span className="text-xs font-bold text-slate-500">{caption}</span> : null}
        </div>
      </div>
      {state !== 'idle' ? (
        <div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <span
              className={`block h-full transition-all ${state === 'error' ? 'bg-rose-500' : 'bg-brand-teal'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-xs font-bold text-slate-500">
            {state === 'compressing' ? 'Compressing...' : state === 'uploading' ? 'Uploading...' : state === 'done' ? 'Done' : 'Upload failed'}
          </p>
        </div>
      ) : null}
    </div>
  )
}

function RichBulletList({ value = [], onChange, addLabel = 'Add bullet' }) {
  const items = Array.isArray(value) ? value : []

  function update(index, nextValue) {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? nextValue : item)))
  }

  function move(index, direction) {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const next = [...items]
    const [removed] = next.splice(index, 1)
    next.splice(target, 0, removed)
    onChange(next)
  }

  return (
    <div className="grid gap-3">
      {items.map((item, index) => (
        <div key={`${index}-${item}`} className="grid gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3 sm:grid-cols-[auto_1fr_auto] sm:items-center">
          <GripVertical className="hidden size-4 text-slate-400 sm:block" />
          <Input value={item || ''} onChange={(event) => update(index, event.target.value)} />
          <div className="flex gap-1">
            <button type="button" onClick={() => move(index, -1)} className="grid size-10 place-items-center rounded-lg bg-white text-slate-500" aria-label="Move up">
              <ChevronUp className="size-4" />
            </button>
            <button type="button" onClick={() => move(index, 1)} className="grid size-10 place-items-center rounded-lg bg-white text-slate-500" aria-label="Move down">
              <ChevronDown className="size-4" />
            </button>
            <button type="button" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} className="grid size-10 place-items-center rounded-lg bg-white text-rose-600" aria-label="Remove bullet">
              <X className="size-4" />
            </button>
          </div>
        </div>
      ))}
      <Button type="button" variant="secondary" className="w-fit" onClick={() => onChange([...items, ''])}>
        <Plus className="size-4" /> {addLabel}
      </Button>
    </div>
  )
}

function RepeatableGroup({ field, value = [], onChange }) {
  const items = Array.isArray(value) ? value : []
  const childFields = field.fields || []
  const emptyItem = Object.fromEntries(childFields.map((child) => [child.name, emptyForField(child)]))

  function updateItem(index, childName, nextValue) {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, [childName]: nextValue } : item)))
  }

  function move(index, direction) {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const next = [...items]
    const [removed] = next.splice(index, 1)
    next.splice(target, 0, removed)
    onChange(next)
  }

  return (
    <div className="grid gap-4">
      {items.map((item, index) => (
        <div key={index} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
          <div className="mb-4 flex items-center justify-between gap-2">
            <p className="text-sm font-black text-brand-navy">{field.itemLabel || field.label} {index + 1}</p>
            <div className="flex gap-1">
              <button type="button" onClick={() => move(index, -1)} className="grid size-9 place-items-center rounded-lg bg-white text-slate-500" aria-label="Move up">
                <ChevronUp className="size-4" />
              </button>
              <button type="button" onClick={() => move(index, 1)} className="grid size-9 place-items-center rounded-lg bg-white text-slate-500" aria-label="Move down">
                <ChevronDown className="size-4" />
              </button>
              <button type="button" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} className="grid size-9 place-items-center rounded-lg bg-white text-rose-600" aria-label="Remove item">
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
          <div className="grid gap-3">
            {childFields.map((child) => (
              <Field key={child.name} label={child.label || child.name}>
                {child.type === 'textarea' ? (
                  <Textarea value={item?.[child.name] || ''} onChange={(event) => updateItem(index, child.name, event.target.value)} />
                ) : child.type === 'select' ? (
                  <Select value={item?.[child.name] || ''} onChange={(event) => updateItem(index, child.name, event.target.value)}>
                    {(child.options || []).map((option) => (
                      <option key={option.value ?? option} value={option.value ?? option}>
                        {option.label ?? option}
                      </option>
                    ))}
                  </Select>
                ) : child.type === 'image' ? (
                  <ImageUploadField value={item?.[child.name] || ''} onChange={(next) => updateItem(index, child.name, next)} label={child.label || child.name} />
                ) : (
                  <Input
                    type={child.type === 'number' ? 'number' : child.type === 'date' ? 'date' : 'text'}
                    value={item?.[child.name] || ''}
                    onChange={(event) => updateItem(index, child.name, child.type === 'number' ? Number(event.target.value) : event.target.value)}
                  />
                )}
              </Field>
            ))}
          </div>
        </div>
      ))}
      <Button type="button" variant="secondary" className="w-fit" onClick={() => onChange([...items, emptyItem])}>
        <Plus className="size-4" /> {field.addLabel || `Add ${field.itemLabel || field.label}`}
      </Button>
    </div>
  )
}

function FieldControl({ field, value, onChange }) {
  if (field.type === 'readonly') {
    return (
      <div className="min-h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-700">
        {value || field.fallback || 'Not set'}
      </div>
    )
  }
  if (field.type === 'textarea') return <Textarea rows={field.rows || 4} value={value || ''} onChange={(event) => onChange(event.target.value)} />
  if (field.type === 'number') return <Input type="number" value={value ?? ''} onChange={(event) => onChange(event.target.value === '' ? '' : Number(event.target.value))} />
  if (field.type === 'date') return <Input type="date" value={value || ''} onChange={(event) => onChange(event.target.value)} />
  if (field.type === 'boolean') return <Toggle checked={Boolean(value)} onChange={onChange} />
  if (field.type === 'select') {
    return (
      <Select value={value ?? ''} onChange={(event) => onChange(event.target.value)}>
        {(field.options || []).map((option) => (
          <option key={option.value ?? option} value={option.value ?? option}>
            {option.label ?? option}
          </option>
        ))}
      </Select>
    )
  }
  if (field.type === 'image') return <ImageUploadField value={value || ''} onChange={onChange} label={field.label} />
  if (field.type === 'youtubeUrl') {
    const id = youtubeId(value)
    return (
      <div className="grid gap-3">
        <Input value={value || ''} onChange={(event) => onChange(event.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
        {id ? <img src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`} alt="YouTube video preview" className="h-32 w-56 rounded-lg object-cover" /> : null}
      </div>
    )
  }
  if (field.type === 'richBulletList') return <RichBulletList value={value} onChange={onChange} addLabel={field.addLabel} />
  if (field.type === 'repeatableGroup') return <RepeatableGroup field={field} value={value} onChange={onChange} />
  if (field.type === 'colorToken') {
    return (
      <div className="flex gap-2">
        <input type="color" value={value || '#000000'} onChange={(event) => onChange(event.target.value)} className="h-11 w-14 rounded-lg border border-slate-200 bg-white p-1" />
        <Input value={value || ''} onChange={(event) => onChange(event.target.value)} />
      </div>
    )
  }
  return <Input value={value || ''} onChange={(event) => onChange(event.target.value)} maxLength={field.maxLength} />
}

export function DynamicForm({
  sections = [],
  value,
  resetKey,
  onChange,
  onSave,
  onDelete,
  saveLabel = 'Save',
  deleteLabel = 'Delete',
  saving = false,
  status,
  hideSave = false,
}) {
  const initialRef = useRef(clone(value || {}))
  const [touched, setTouched] = useState({})
  const dirty = JSON.stringify(value || {}) !== JSON.stringify(initialRef.current || {})
  const allFields = sections.flatMap((section) => section.fields || [])
  const errors = Object.fromEntries(
    allFields.map((field) => [field.name, validateField(field, getByPath(value, field.name))]).filter(([, error]) => error),
  )
  const hasErrors = Object.keys(errors).length > 0

  useEffect(() => {
    initialRef.current = clone(value || {})
    setTouched({})
  }, [resetKey])

  function setField(field, nextValue) {
    onChange(setByPath(value || {}, field.name, nextValue))
  }

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault()
        const touchedAll = Object.fromEntries(allFields.map((field) => [field.name, true]))
        setTouched(touchedAll)
        if (!hasErrors) onSave?.()
      }}
    >
      {sections.map((section) => (
        <section key={section.title} className="rounded-lg bg-white p-5 shadow-soft">
          <div>
            <h2 className="text-xl font-black text-brand-navy">{section.title}</h2>
            {section.description ? <p className="mt-1 text-sm leading-6 text-slate-600">{section.description}</p> : null}
          </div>
          <div className={`mt-5 grid gap-4 ${section.columns === 2 ? 'md:grid-cols-2' : section.columns === 3 ? 'md:grid-cols-3' : ''}`}>
            {(section.fields || []).map((field) => {
              const fieldValue = getByPath(value || {}, field.name)
              const error = touched[field.name] ? errors[field.name] : ''
              return (
                <Field
                  key={field.name}
                  label={
                    <span>
                      {field.label}
                      {field.required ? <span className="ml-1 text-rose-600">*</span> : null}
                    </span>
                  }
                  hint={field.maxLength && typeof fieldValue === 'string' ? `${fieldValue.length}/${field.maxLength}` : field.hint}
                  error={error}
                >
                  <FieldControl
                    field={field}
                    value={fieldValue ?? emptyForField(field)}
                    onChange={(nextValue) => setField(field, nextValue)}
                  />
                </Field>
              )
            })}
          </div>
        </section>
      ))}

      {!hideSave && (
        <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 bg-white p-3 shadow-lift">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
            <span className={`size-2 rounded-full ${dirty ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            {dirty ? 'Unsaved changes' : status || 'Saved'}
          </div>
          <div className="flex flex-wrap gap-2">
            {onDelete ? (
              <Button type="button" variant="danger" onClick={onDelete}>
                <Trash2 className="size-4" /> {deleteLabel}
              </Button>
            ) : null}
            <Button type="submit" disabled={saving || hasErrors}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
              {saving ? 'Saving...' : saveLabel}
            </Button>
          </div>
        </div>
      )}
    </form>
  )
}

export function pickSchemaDefaults(sections = []) {
  return Object.fromEntries(sections.flatMap((section) => (section.fields || []).map((field) => [field.name, emptyForField(field)])))
}

export function withoutEmptyNested(value) {
  let next = clone(value || {})
  Object.keys(next).forEach((key) => {
    if (next[key] === undefined) next = removeByPath(next, key)
  })
  return next
}
