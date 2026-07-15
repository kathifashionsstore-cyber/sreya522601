import { useEffect, useMemo, useState } from 'react'
import { Check, ExternalLink, Loader2, RotateCcw, Plus, Trash2 } from 'lucide-react'
import { Button } from '../components/shared/Button'
import { ConfirmDialog } from '../components/shared/ConfirmDialog'
import { useToast } from '../components/shared/Toast'
import { useAuth } from '../context/AuthContext'
import { getLockedServiceCategories, getLockedSubServices, getServiceUrl, subServices } from '../mockData/services'
import { saveDocument, updateDocument, useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { DynamicForm } from './DynamicForm'
import { subServiceBaseSchema, subServiceSectionSchemas } from './formSchemas'

function stripRuntimeFields(item) {
  const clean = { ...(item || {}) }
  delete clean.createdAt
  delete clean.updatedAt
  delete clean.updatedBy
  delete clean.deletedAt
  return clean
}

function formatEdited(item) {
  if (!item?.updatedBy && !item?.updatedAt) return ''
  const at = item.updatedAt?.toDate ? item.updatedAt.toDate() : item.updatedAt ? new Date(item.updatedAt) : null
  const time = at && !Number.isNaN(at.getTime()) ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(at) : ''
  return `Last edited${time ? ` ${time}` : ''}${item.updatedBy ? ` by ${item.updatedBy}` : ''}`
}

const newTemplate = {
  title: '',
  slug: '',
  categoryId: 'fertility-treatments',
  heroImage: '',
  heroHeading: '',
  heroSubtitle: '',
  shortDescription: '',
  order: 1,
  featured: false,
  active: true,
  whatIsIt: '',
  whatIsItImage: '',
  doctorNoteQuote: '',
  classification: '',
  causes: [],
  riskFactors: [],
  symptoms: [],
  diagnosisSteps: [],
  treatmentOptions: [],
}

export function AdminSubServicesV2() {
  const { data: categoryData } = useFirestoreCollection('serviceCategories', [])
  const categories = getLockedServiceCategories(categoryData, { includeInactive: true })
  
  const [subTab, setSubTab] = useState('active')
  const { data, loading } = useFirestoreCollection('subServices', [], 'order', true)
  const allData = getLockedSubServices(data, { includeInactive: true })
  const activeData = allData.filter((item) => subTab === 'deleted' ? item.deletedAt : !item.deletedAt)
  
  const [categoryFilter, setCategoryFilter] = useState('all')
  const filteredData =
    categoryFilter === 'all'
      ? activeData
      : activeData.filter((item) => (item.categoryId || item.category) === categoryFilter)
      
  const [selectedId, setSelectedId] = useState('')
  
  const selected = useMemo(() => {
    if (selectedId === 'new') {
      return { id: 'new', ...newTemplate, order: allData.length + 1 }
    }
    return activeData.find((item) => item.id === selectedId) || null
  }, [activeData, selectedId, allData.length])

  const [form, setForm] = useState({})
  const [saving, setSaving] = useState('')
  const [saveVersion, setSaveVersion] = useState(0)
  const [deleteId, setDeleteId] = useState(null)
  
  const { push } = useToast()
  const { user } = useAuth()
  
  const categoryOptions = categories.map((category) => ({ label: category.title, value: category.id }))
  const category = categories.find((item) => item.id === selected?.categoryId)
  const previewHref = selected && selected.id !== 'new' && category ? getServiceUrl(selected, [category]) : '/services'
  const sectionSchemas = subServiceSectionSchemas()

  // Track the last selected ID synchronously to avoid race conditions during switches
  const [switching, setSwitching] = useState(false)

  const handleSelectService = (item) => {
    setSwitching(true)
    setSelectedId(item.id)
    setForm(stripRuntimeFields(item))
    setSaveVersion((version) => version + 1)
    // Small timeout to allow render cycle to clear
    window.setTimeout(() => setSwitching(false), 50)
  }

  const handleCreateNew = () => {
    setSwitching(true)
    setSelectedId('new')
    setForm({ ...newTemplate, order: allData.length + 1 })
    setSaveVersion((version) => version + 1)
    window.setTimeout(() => setSwitching(false), 50)
  }

  // Auto-select the first service on initial load of Firestore data
  useEffect(() => {
    if (!loading && activeData.length > 0 && !selectedId) {
      setSelectedId(activeData[0].id)
    }
  }, [loading, activeData, selectedId])

  useEffect(() => {
    if (!selected) return
    setForm(stripRuntimeFields(selected))
    setSaveVersion((version) => version + 1)
  }, [selected?.id])

  useEffect(() => {
    if (activeData.length && !activeData.some((item) => item.id === selectedId) && selectedId !== 'new') {
      setSelectedId(activeData[0].id)
      setForm(stripRuntimeFields(activeData[0]))
    }
  }, [activeData, selectedId])

  const dirty = useMemo(() => {
    if (!selected || switching) return false
    return JSON.stringify(stripRuntimeFields(form)) !== JSON.stringify(stripRuntimeFields(selected))
  }, [form, selected, switching])

  const hasErrors = useMemo(() => {
    return !form?.title?.trim() || !form?.slug?.trim()
  }, [form])

  async function saveSection(sectionId) {
    if (switching) return
    const isNew = selectedId === 'new'
    if (isNew && (!form?.slug?.trim() || !form?.title?.trim())) {
      push('Title and Slug are required.', 'error')
      return
    }
    
    setSaving(sectionId)
    try {
      const payload = {
        ...form,
        updatedBy: user?.email || user?.uid || 'admin',
      }

      if (Array.isArray(payload.heroImages)) {
        const cleaned = [...new Set(payload.heroImages.filter(img => typeof img === 'string' && img.trim() !== ''))].slice(0, 10)
        payload.heroImages = cleaned
      }
      
      const docId = isNew ? form.slug.trim().toLowerCase() : selected.id
      delete payload.id
      
      await saveDocument('subServices', payload, docId)
      
      if (isNew) {
        setSelectedId(docId)
        setSubTab('active')
      }
      
      setSaveVersion((version) => version + 1)
      push('Sub-service changes saved successfully.', 'success')
    } catch (error) {
      push(error.message || 'Could not save changes.', 'error')
    } finally {
      setSaving('')
    }
  }

  async function confirmDelete() {
    if (!deleteId) return
    try {
      await updateDocument('subServices', deleteId, {
        deletedAt: new Date().toISOString(),
        updatedBy: user?.email || user?.uid || 'admin',
      })
      push('Moved to Recently Deleted.', 'success')
      setDeleteId(null)
      setSubTab('active')
      
      // Select another active item
      const nextActive = allData.filter((item) => item.id !== deleteId && !item.deletedAt)
      if (nextActive.length) {
        handleSelectService(nextActive[0])
      } else {
        setSelectedId('')
      }
    } catch (error) {
      push(error.message || 'Could not delete service.', 'error')
    }
  }

  async function restore(item) {
    try {
      await updateDocument('subServices', item.id, {
        deletedAt: null,
        updatedBy: user?.email || user?.uid || 'admin',
      })
      push('Sub-service restored successfully.', 'success')
      setSubTab('active')
      setSelectedId(item.id)
    } catch (error) {
      push(error.message || 'Could not restore.', 'error')
    }
  }

  async function restoreDefaultTitles() {
    if (!confirm('Are you sure you want to restore the default titles for all 24 sub-services? This will overwrite the current titles in Firestore with their original names.')) return
    setSaving('restore-titles')
    try {
      for (const item of subServices) {
        await saveDocument('subServices', { title: item.title }, item.id)
      }
      push('All titles restored to defaults successfully.', 'success')
      setSaveVersion((version) => version + 1)
    } catch (error) {
      push(error.message || 'Could not restore titles.', 'error')
    } finally {
      setSaving('')
    }
  }

  return (
    <section className="grid gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-brand-navy">Individual Service Records</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Edit, create, and delete sub-services. Choose a parent category, then edit each service page, image, summary, video, lists, and toggles directly.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={handleCreateNew}>
            <Plus className="size-4" /> New Service
          </Button>
          <Button type="button" variant="secondary" onClick={restoreDefaultTitles} disabled={saving === 'restore-titles'}>
            <RotateCcw className="size-4 animate-none" /> Restore Default Titles
          </Button>
          {selected && selected.id !== 'new' && (
            <Button as="a" href={previewHref} target="_blank" rel="noreferrer" variant="secondary">
              <ExternalLink className="size-4" /> Preview Page
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_480px]">
        <aside className="h-fit rounded-lg bg-white p-4 shadow-soft">
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1 text-sm font-black mb-4">
            <button 
              type="button" 
              onClick={() => {
                setSubTab('active')
                setCategoryFilter('all')
              }} 
              className={`rounded-md px-3 py-2 ${subTab === 'active' ? 'bg-white text-brand-teal shadow-sm' : 'text-slate-600'}`}
            >
              Active
            </button>
            <button 
              type="button" 
              onClick={() => {
                setSubTab('deleted')
                setCategoryFilter('all')
              }} 
              className={`rounded-md px-3 py-2 ${subTab === 'deleted' ? 'bg-white text-brand-teal shadow-sm' : 'text-slate-600'}`}
            >
              Deleted
            </button>
          </div>
          <h2 className="font-black text-brand-navy">Sub-services</h2>
          <div className="mt-4 grid gap-2">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`rounded-lg px-3 py-2 text-left text-xs font-black ${
                categoryFilter === 'all' ? 'bg-brand-navy text-white' : 'bg-slate-50 text-brand-navy'
              }`}
            >
              All services ({activeData.length})
            </button>
            {categories.map((item) => {
              const count = activeData.filter((service) => (service.categoryId || service.category) === item.id).length
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setCategoryFilter(item.id)
                    const first = activeData.find((service) => (service.categoryId || service.category) === item.id)
                    if (first) {
                      handleSelectService(first)
                    }
                  }}
                  className={`rounded-lg px-3 py-2 text-left text-xs font-black ${
                    categoryFilter === item.id ? 'bg-brand-navy text-white' : 'bg-slate-50 text-brand-navy'
                  }`}
                >
                  {item.title} ({count})
                </button>
              )
            })}
          </div>
          <div className="mt-4 grid max-h-[70vh] gap-2 overflow-auto pr-1">
            {selectedId === 'new' && (
              <button
                type="button"
                className="rounded-lg px-3 py-2 text-left text-sm font-bold bg-brand-blush text-brand-rose border border-dashed border-brand-rose"
              >
                * Creating New Service
              </button>
            )}
            {filteredData.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectService(item)}
                className={`rounded-lg px-3 py-2 text-left text-sm font-bold ${
                  selected?.id === item.id ? 'bg-brand-blush text-brand-rose' : 'bg-slate-50 text-brand-navy'
                }`}
              >
                {item.title}
                {formatEdited(item) ? <span className="mt-1 block text-[0.68rem] font-semibold text-slate-500">{formatEdited(item)}</span> : null}
              </button>
            ))}
          </div>
        </aside>

        <div className="grid gap-4 min-w-0">
          {subTab === 'deleted' && selected && selected.id !== 'new' ? (
            <div className="mb-4 rounded-lg bg-amber-50 p-4 text-sm font-bold text-amber-900 flex items-center justify-between shadow-soft border border-amber-100 animate-fadeIn">
              <span>This service is hidden from the public site. Restore it to display it again.</span>
              <Button type="button" variant="secondary" onClick={() => restore(selected)}>
                <RotateCcw className="size-4" /> Restore Service
              </Button>
            </div>
          ) : null}
          {selected ? (
            <>
              <DynamicForm
                resetKey={`${selected.id}-base-${saveVersion}`}
                sections={subServiceBaseSchema(categoryOptions)}
                value={form}
                onChange={setForm}
                hideSave={true}
              />
              {sectionSchemas.map((section) => (
                <details key={section.id} open className="rounded-lg bg-white shadow-soft">
                  <summary className="cursor-pointer px-5 py-4 text-xl font-black text-brand-navy">
                    {section.title}
                  </summary>
                  <div className="border-t border-slate-100 p-5">
                    <DynamicForm
                      resetKey={`${selected.id}-${section.id}-${saveVersion}`}
                      sections={section.sections}
                      value={form}
                      onChange={setForm}
                      hideSave={true}
                    />
                  </div>
                </details>
              ))}

              {/* Global Sticky Save Bar */}
              <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 bg-white p-3 shadow-lift animate-fadeIn">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                  <span className={`size-2 rounded-full ${dirty ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  {dirty ? 'Unsaved changes across sections' : 'All sections saved'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedId !== 'new' && subTab === 'active' && (
                    <Button 
                      type="button" 
                      variant="danger" 
                      onClick={() => setDeleteId(selected.id)}
                      disabled={Boolean(saving)}
                    >
                      <Trash2 className="size-4" /> Delete Service
                    </Button>
                  )}
                  <Button 
                    type="button" 
                    onClick={() => saveSection('all')} 
                    disabled={saving || hasErrors || !dirty || switching}
                  >
                    {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                    {saving ? 'Saving changes...' : 'Save All Changes'}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-lg bg-white p-6 text-sm text-slate-600 shadow-soft">No sub-service selected.</div>
          )}
        </div>

        {/* Live Preview Iframe Panel */}
        {selected && selected.id !== 'new' && (
          <div className="hidden xl:block">
            <div className="sticky top-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-brand-navy">Live Page Preview</h2>
                <span className="rounded bg-brand-teal/10 px-2 py-0.5 text-[10px] font-black text-brand-teal uppercase tracking-wider animate-pulse">
                  Auto-refreshes on Save
                </span>
              </div>
              <div className="relative rounded-xl border border-slate-200 bg-slate-100 p-2 shadow-soft">
                <iframe
                  key={`${selected.id}-${saveVersion}`}
                  src={previewHref}
                  className="w-full h-[72vh] rounded-lg border border-slate-200 bg-white"
                  title="Live Preview"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Move Service to Recently Deleted"
        message="This hides the service page from the public site and keeps it recoverable from the Recently Deleted tab."
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </section>
  )
}
