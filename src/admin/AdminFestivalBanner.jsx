import { useState, useEffect } from 'react'
import { DynamicForm } from './DynamicForm'
import { saveDocument, useFirestoreDoc } from '../hooks/useFirestoreCollection'
import { festivalBannerSchema } from './formSchemas'
import { useToast } from '../components/shared/Toast'

export default function AdminFestivalBanner() {
  const { data, loading } = useFirestoreDoc('festivalBanners/active', { enabled: false, imageUrl: '', text: '', phone: '' })
  const [form, setForm] = useState({ enabled: false, imageUrl: '', text: '', phone: '' })
  const [saving, setSaving] = useState(false)
  const { push } = useToast()

  useEffect(() => {
    if (data) {
      setForm(data)
    }
  }, [data])

  async function save() {
    setSaving(true)
    try {
      await saveDocument('festivalBanners', form, 'active')
      push('Festival banner settings saved.', 'success')
    } catch (error) {
      push(error.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-4 text-center">Loading settings...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-brand-navy">Festival Banner / Intro Popup</h1>
          <p className="mt-2 text-sm text-slate-600">Controls the welcome popup shown to visitors when they first open the website in a session.</p>
        </div>
      </div>
      <div className="rounded-lg bg-white p-6 shadow-soft">
        <DynamicForm
          resetKey="festival-banner"
          sections={festivalBannerSchema()}
          value={form}
          onChange={setForm}
          onSave={save}
          saveLabel="Save Festival Banner Settings"
          saving={saving}
        />
      </div>
    </div>
  )
}
