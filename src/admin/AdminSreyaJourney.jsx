import { useState, useEffect } from 'react'
import { DynamicForm } from './DynamicForm'
import { saveDocument, useFirestoreDoc } from '../hooks/useFirestoreCollection'
import { journeyTimelineSchema } from './formSchemas'
import { useToast } from '../components/shared/Toast'

export default function AdminSreyaJourney() {
  const { data: settings, loading } = useFirestoreDoc('settings/public')
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const { push } = useToast()

  useEffect(() => {
    if (settings) {
      setForm(settings)
    }
  }, [settings])

  async function save() {
    setSaving(true)
    try {
      await saveDocument('settings', form, 'public')
      push('Sreya\'s Journey timeline settings saved.', 'success')
    } catch (error) {
      push(error.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-4 text-center">Loading settings...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-brand-navy">Sreya's Journey Timeline</h1>
        <p className="mt-2 text-sm text-slate-600">Configure the animated history timeline, stats, and doctor profile shown on the Doctors page.</p>
      </div>
      <div className="rounded-lg bg-white p-6 shadow-soft">
        <DynamicForm
          resetKey="sreya-journey"
          sections={journeyTimelineSchema()}
          value={form}
          onChange={setForm}
          onSave={save}
          saveLabel="Save Journey Settings"
          saving={saving}
        />
      </div>
    </div>
  )
}
