import { useEffect, useState } from 'react'
import { DynamicForm } from './DynamicForm'
import { AdminCollectionEditor } from './AdminCollectionEditor'
import { Button } from '../components/shared/Button'
import { Field, Input, Select } from '../components/shared/Input'
import { departments } from '../data/seed'
import { getLockedServiceDepartments } from '../mockData/services'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { useAuth } from '../context/AuthContext'
import { saveDocument, useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { useToast } from '../components/shared/Toast'
import { departmentsSchema, settingsSchema } from './formSchemas'

export default function AdminSettings() {
  const { settings } = useSiteSettings()
  const [form, setForm] = useState(settings)
  const [saving, setSaving] = useState(false)
  const [roleEmail, setRoleEmail] = useState('')
  const [roleValue, setRoleValue] = useState('editor')
  const [saveVersion, setSaveVersion] = useState(0)
  const securityLog = useFirestoreCollection('securityLog', [], 'timestamp').data
  const { push } = useToast()
  const { user, role } = useAuth()

  useEffect(() => {
    setForm(settings)
    setSaveVersion((version) => version + 1)
  }, [settings])

  async function save() {
    setSaving(true)
    try {
      const payload = { ...form }
      delete payload.id
      await saveDocument('settings', payload, 'public')
      setSaveVersion((version) => version + 1)
      push('Settings saved.', 'success')
    } catch (error) {
      push(error.message || 'Could not save settings.', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function saveRole(event) {
    event.preventDefault()
    try {
      const token = await user?.getIdToken()
      const response = await fetch('/api/manage-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: roleEmail, role: roleValue }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Role update failed')
      push('Role updated.', 'success')
      setRoleEmail('')
    } catch (error) {
      push(error.message || 'Role update failed.', 'error')
    }
  }

  return (
    <section className="grid gap-8">
      <div>
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black text-brand-navy">Settings</h1>
            <p className="mt-2 text-sm text-slate-600">Hospital info, navigation, SEO, homepage copy, utility bar, and maintenance mode.</p>
          </div>
        </div>

        {/* Friendly Compression Guideline Banner */}
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-soft">
          <div className="flex gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <h3 className="text-sm font-black text-amber-900 uppercase tracking-wider">
                Image Optimization Guidelines
              </h3>
              <p className="mt-1 text-xs text-amber-800 leading-relaxed font-semibold">
                To keep the website loading lightning-fast for patients, please optimize all images before uploading (e.g. settings banners, logos, social share images):
              </p>
              <ul className="mt-2 list-disc list-inside text-xs text-amber-800 space-y-1 font-semibold">
                <li>Strongly recommend compressing images before uploading (aim for under <strong>300KB</strong> per image).</li>
                <li>Recommend maximum dimensions of <strong>1600px width/height</strong>.</li>
                <li>Use modern <strong>WebP</strong> format where possible.</li>
              </ul>
              <p className="mt-2 text-xs font-bold text-amber-900">
                Free compression tools: <a href="https://tinypng.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-950">TinyPNG</a> or <a href="https://squoosh.app/" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-950">Squoosh</a>.
              </p>
            </div>
          </div>
        </div>

        <DynamicForm
          resetKey={`settings-${saveVersion}`}
          sections={settingsSchema()}
          value={form}
          onChange={setForm}
          onSave={save}
          saveLabel="Save Settings"
          saving={saving}
        />
      </div>
      <AdminCollectionEditor
        title="Departments"
        path="departments"
        fallback={departments}
        schema={departmentsSchema}
        description="Appointment dropdown options generated from the locked fertility services."
        transformData={(items) => getLockedServiceDepartments(items, { includeInactive: true })}
        allowNew={false}
        allowDelete={false}
      />
      {role === 'admin' ? (
        <form onSubmit={saveRole} className="rounded-lg bg-white p-6 shadow-soft">
          <h2 className="text-xl font-black text-brand-navy">Admin Account Roles</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Assign Firebase custom claims to an existing Firebase Auth user by email.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-[1fr_220px_auto] md:items-end">
            <Field label="User Email">
              <Input type="email" value={roleEmail} onChange={(event) => setRoleEmail(event.target.value)} required />
            </Field>
            <Field label="Role">
              <Select value={roleValue} onChange={(event) => setRoleValue(event.target.value)}>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
                <option value="none">Revoke Access</option>
              </Select>
            </Field>
            <Button type="submit">Save Role</Button>
          </div>
        </form>
      ) : null}
      <div className="rounded-lg bg-white p-6 shadow-soft">
        <h2 className="text-xl font-black text-brand-navy">Security Log</h2>
        <div className="mt-4 grid gap-2">
          {securityLog.slice(0, 20).map((item) => (
            <div key={item.id} className="rounded-lg bg-slate-50 p-3 text-sm">
              <p className="font-bold text-brand-navy">{item.event}</p>
              <p className="text-xs text-slate-500">{item.email || item.uid} - {item.role || 'role pending'} - {item.userAgent}</p>
            </div>
          ))}
          {!securityLog.length ? <p className="text-sm text-slate-500">No security events yet.</p> : null}
        </div>
      </div>
    </section>
  )
}
