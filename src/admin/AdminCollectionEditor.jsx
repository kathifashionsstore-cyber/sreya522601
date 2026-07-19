import { useEffect, useMemo, useState } from 'react'
import { Download, Plus, RotateCcw } from 'lucide-react'
import { ConfirmDialog } from '../components/shared/ConfirmDialog'
import { Button } from '../components/shared/Button'
import { EmptyState } from '../components/shared/EmptyState'
import { useToast } from '../components/shared/Toast'
import { useAuth } from '../context/AuthContext'
import { saveDocument, updateDocument, useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { downloadTextFile, toCsv } from '../lib/seo'
import { DynamicForm } from './DynamicForm'

function stripRuntimeFields(item) {
  const rest = { ...(item || {}) }
  delete rest.createdAt
  delete rest.updatedAt
  delete rest.updatedBy
  delete rest.deletedAt
  return rest
}

function itemLabel(item) {
  return item?.title || item?.name || item?.question || item?.patientName || item?.heading || item?.id || 'Untitled'
}

function formatEdited(item) {
  if (!item?.updatedBy && !item?.updatedAt) return ''
  const at = item.updatedAt?.toDate ? item.updatedAt.toDate() : item.updatedAt ? new Date(item.updatedAt) : null
  const time = at && !Number.isNaN(at.getTime()) ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(at) : ''
  return `Last edited${time ? ` ${time}` : ''}${item.updatedBy ? ` by ${item.updatedBy}` : ''}`
}

export function AdminCollectionEditor({
  title,
  path,
  fallback = [],
  orderField = 'order',
  description,
  extraActions,
  schema,
  newTemplate,
  transformData,
  allowNew = true,
  allowDelete = true,
}) {
  const { data: rawData } = useFirestoreCollection(path, fallback, orderField, true)
  const data = useMemo(() => {
    const raw = transformData ? transformData(rawData) : rawData
    return [...raw].sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [rawData, transformData])
  const [tab, setTab] = useState('active')
  const visibleData = data.filter((item) => (tab === 'deleted' ? item.deletedAt : !item.deletedAt))
  const [selectedId, setSelectedId] = useState(visibleData[0]?.id || '')
  const selected = useMemo(() => visibleData.find((item) => item.id === selectedId) || visibleData[0] || null, [visibleData, selectedId])
  const [form, setForm] = useState(selected ? stripRuntimeFields(selected) : stripRuntimeFields(newTemplate || fallback[0] || {}))
  const [deleteId, setDeleteId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveVersion, setSaveVersion] = useState(0)
  const [status, setStatus] = useState('')
  const { push } = useToast()
  const { user } = useAuth()
  const sections = typeof schema === 'function' ? schema() : schema

  const selectedStr = JSON.stringify(selected || null)

  useEffect(() => {
    const next = selected ? stripRuntimeFields(selected) : stripRuntimeFields(newTemplate || fallback[0] || {})
    setForm(next)
    setSaveVersion((version) => version + 1)
  }, [selectedStr, tab])

  useEffect(() => {
    if (visibleData.length && !visibleData.some((item) => item.id === selectedId)) {
      setSelectedId(visibleData[0].id)
    }
  }, [visibleData, selectedId])

  function newItem() {
    setSelectedId('')
    setForm({ ...stripRuntimeFields(newTemplate || fallback[0] || {}), order: data.length + 1 })
    setSaveVersion((version) => version + 1)
  }

  async function save() {
    setSaving(true)
    try {
      const payload = {
        ...form,
        updatedBy: user?.email || user?.uid || 'admin',
      }
      const id = selectedId || payload.id || undefined
      delete payload.id
      const savedId = await saveDocument(path, payload, id)
      setSelectedId(savedId)
      setStatus('Saved')
      setSaveVersion((version) => version + 1)
      window.setTimeout(() => setStatus(''), 2000)
      push(`${title} saved.`, 'success')
    } catch (error) {
      push(error.message || 'Could not save.', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    try {
      await updateDocument(path, deleteId, {
        deletedAt: new Date().toISOString(),
        updatedBy: user?.email || user?.uid || 'admin',
      })
      push('Moved to Recently Deleted.', 'success')
      setDeleteId(null)
      setTab('active')
    } catch (error) {
      push(error.message || 'Could not delete.', 'error')
    }
  }

  async function restore(item) {
    try {
      await updateDocument(path, item.id, {
        deletedAt: null,
        updatedBy: user?.email || user?.uid || 'admin',
      })
      push('Restored.', 'success')
      setTab('active')
      setSelectedId(item.id)
    } catch (error) {
      push(error.message || 'Could not restore.', 'error')
    }
  }

  return (
    <section className="grid gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-brand-navy">{title}</h1>
          {description ? <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {extraActions}
          <Button type="button" variant="secondary" onClick={() => downloadTextFile(`${path}.csv`, toCsv(visibleData), 'text/csv')}>
            <Download className="size-4" /> CSV
          </Button>
          {allowNew ? (
            <Button type="button" onClick={newItem}>
              <Plus className="size-4" /> New
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <aside className="h-fit rounded-lg bg-white p-4 shadow-soft">
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1 text-sm font-black">
            <button type="button" onClick={() => setTab('active')} className={`rounded-md px-3 py-2 ${tab === 'active' ? 'bg-white text-brand-teal shadow-sm' : 'text-slate-600'}`}>
              Active
            </button>
            <button type="button" onClick={() => setTab('deleted')} className={`rounded-md px-3 py-2 ${tab === 'deleted' ? 'bg-white text-brand-teal shadow-sm' : 'text-slate-600'}`}>
              Deleted
            </button>
          </div>
          <h2 className="mt-4 font-black text-brand-navy">Records</h2>
          <div className="mt-4 grid max-h-[70vh] gap-2 overflow-auto pr-1">
            {visibleData.length ? visibleData.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`rounded-lg px-3 py-2 text-left text-sm font-bold ${selected?.id === item.id ? 'bg-brand-blush text-brand-rose' : 'bg-slate-50 text-brand-navy'}`}
              >
                <span>{itemLabel(item)}</span>
                {formatEdited(item) ? <span className="mt-1 block text-[0.68rem] font-semibold text-slate-500">{formatEdited(item)}</span> : null}
              </button>
            )) : <EmptyState title={tab === 'deleted' ? 'No recently deleted records' : 'No records'} />}
          </div>
        </aside>
        <div>
          {tab === 'deleted' && selected ? (
            <div className="mb-4 rounded-lg bg-amber-50 p-4 text-sm font-bold text-amber-900">
              This record is hidden from the public site. Restore it to edit or display it again.
              <Button type="button" className="ml-3" variant="secondary" onClick={() => restore(selected)}>
                <RotateCcw className="size-4" /> Restore
              </Button>
            </div>
          ) : null}
          {sections ? (
            <DynamicForm
              resetKey={`${selected?.id || 'new'}-${saveVersion}-${tab}`}
              sections={sections}
              value={form}
              onChange={setForm}
              onSave={save}
              onDelete={allowDelete && selectedId && tab === 'active' ? () => setDeleteId(selectedId) : null}
              deleteLabel={`Delete ${title}`}
              saveLabel={`Save ${title}`}
              saving={saving}
              status={status}
            />
          ) : (
            <div className="rounded-lg bg-white p-6 text-sm text-slate-600 shadow-soft">
              This admin section needs a form schema before it can be edited.
            </div>
          )}
        </div>
      </div>
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Move to Recently Deleted"
        message="This hides the record and keeps it recoverable from the Recently Deleted tab."
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </section>
  )
}
