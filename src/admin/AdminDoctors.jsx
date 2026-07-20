import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminCollectionEditor } from './AdminCollectionEditor'
import { DynamicForm } from './DynamicForm'
import { doctors } from '../data/seed'
import { doctorSchema, doctorsPageSchema } from './formSchemas'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { saveDocument } from '../hooks/useFirestoreCollection'
import { useToast } from '../components/shared/Toast'

export default function AdminDoctors() {
  const { settings } = useSiteSettings()
  const { push } = useToast()
  const [activeTab, setActiveTab] = useState('profiles')
  const [form, setForm] = useState(settings)
  const [saving, setSaving] = useState(false)
  const [saveVersion, setSaveVersion] = useState(0)

  useEffect(() => {
    setForm(settings)
    setSaveVersion((version) => version + 1)
  }, [settings])

  async function savePageContent() {
    setSaving(true)
    try {
      const payload = { ...form }
      delete payload.id
      await saveDocument('settings', payload, 'public')
      push('Doctors page content saved successfully.', 'success')
      setSaveVersion((version) => version + 1)
    } catch (error) {
      push(error.message || 'Could not save page content.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-brand-navy">Doctors Manager</h1>
          <p className="mt-1 text-xs text-slate-500 font-bold">
            Edit doctor profiles (Dr. M. Vasanta Kiran).
          </p>
        </div>
        <Link 
          to="/admin/sreya-journey" 
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#087f8c] bg-teal-50 px-4 py-2 text-xs font-extrabold text-[#087f8c] hover:bg-[#087f8c] hover:text-white transition"
        >
          Edit Sreya's Journey Timeline →
        </Link>
      </div>

      <div className="flex justify-between items-center border-b border-slate-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('profiles')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'profiles'
                ? 'border-brand-teal text-brand-teal'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Doctor Profiles
          </button>
          <button
            onClick={() => setActiveTab('pageContent')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'pageContent'
                ? 'border-brand-teal text-brand-teal'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Page Content
          </button>
        </div>
      </div>

      {activeTab === 'profiles' ? (
        <AdminCollectionEditor
          title="Doctors"
          path="doctors"
          fallback={doctors}
          schema={doctorSchema}
          orderField={null}
          description="Doctor profile, photo, awards, memberships, timings, and FAQs."
        />
      ) : (
        <div className="bg-white rounded-lg p-6 shadow-soft">
          <h2 className="text-xl font-black text-brand-navy mb-4">Doctors Page Layout Content</h2>
          <p className="text-sm text-slate-600 mb-6">
            Configure the 3-image hero slideshow and descriptive copy blocks displayed on the public Doctors page.
          </p>
          <DynamicForm
            resetKey={`doctors-page-${saveVersion}`}
            sections={doctorsPageSchema()}
            value={form}
            onChange={setForm}
            onSave={savePageContent}
            saveLabel="Save Page Content"
            saving={saving}
          />
        </div>
      )}
    </div>
  )
}
