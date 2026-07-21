import { useState, useEffect } from 'react'
import { Check, Image as ImageIcon, RotateCcw, Upload } from 'lucide-react'
import { Button } from '../components/shared/Button'
import { ImageUploadField } from '../components/admin/ImageUploadField'
import { useToast } from '../components/shared/Toast'
import { saveDocument, useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { getLockedServiceCategories, serviceCategories as fallbackCategories } from '../mockData/services'

export default function AdminCategoryImages() {
  const { data: dbCategories, loading } = useFirestoreCollection('serviceCategories', [])
  const categories = getLockedServiceCategories(dbCategories, { includeInactive: true })
  const [initialized, setInitialized] = useState(false)
  const [formState, setFormState] = useState([])
  const [savingId, setSavingId] = useState('')
  const { push } = useToast()

  useEffect(() => {
    if (!loading && categories.length > 0 && !initialized) {
      setFormState(categories)
      setInitialized(true)
    }
  }, [loading, categories, initialized])

  const handleFieldChange = (catId, field, value) => {
    setFormState((prev) =>
      prev.map((cat) => (cat.id === catId ? { ...cat, [field]: value } : cat))
    )
  }

  const handleSave = async (cat) => {
    setSavingId(cat.id)
    try {
      await saveDocument('serviceCategories', cat, cat.id)
      push(`Category settings for "${cat.title}" saved successfully.`, 'success')
    } catch (error) {
      push(error.message || 'Failed to save category image settings.', 'error')
    } finally {
      setSavingId('')
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-bold">Loading Service Category Images...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-navy">Service Category Cover Images</h1>
          <p className="mt-1 text-sm text-slate-600">
            Upload, update, or remove cover images and descriptions for each service category card on the public website.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {formState.map((cat) => {
          const isSaving = savingId === cat.id
          return (
            <div key={cat.id} className="rounded-2xl bg-white p-6 shadow-soft border border-slate-100 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="text-lg font-black text-brand-navy leading-snug">{cat.title}</h2>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-blush text-brand-rose">
                    Order #{cat.order || 1}
                  </span>
                </div>

                {/* Cover Image Upload / Field */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                    Cover / Thumbnail Image
                  </label>
                  <ImageUploadField
                    value={cat.imageUrl || ''}
                    onChange={(url) => handleFieldChange(cat.id, 'imageUrl', url)}
                    fieldKey={`cat-img-${cat.id}`}
                  />
                </div>

                {/* Title & Tagline Editors */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category Title</label>
                    <input
                      type="text"
                      value={cat.title || ''}
                      onChange={(e) => handleFieldChange(cat.id, 'title', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-brand-teal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Short Tagline</label>
                    <input
                      type="text"
                      value={cat.tagline || ''}
                      onChange={(e) => handleFieldChange(cat.id, 'tagline', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-medium text-slate-800 outline-none focus:border-brand-teal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
                    <textarea
                      rows={3}
                      value={cat.description || ''}
                      onChange={(e) => handleFieldChange(cat.id, 'description', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-brand-teal"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <Button
                type="button"
                className="w-full min-h-10 text-xs font-black"
                onClick={() => handleSave(cat)}
                disabled={isSaving}
              >
                {isSaving ? 'Saving Cover...' : `Save ${cat.title} Cover`}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
