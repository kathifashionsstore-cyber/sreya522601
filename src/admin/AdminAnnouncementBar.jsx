import { useState } from 'react'
import { Save } from 'lucide-react'
import { Button } from '../components/shared/Button'
import { Field, Input, Select } from '../components/shared/Input'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { saveDocument } from '../hooks/useFirestoreCollection'
import { useToast } from '../components/shared/Toast'

export default function AdminAnnouncementBar() {
  const { settings } = useSiteSettings()
  const [bar, setBar] = useState(settings.announcementBar || {})
  const { push } = useToast()

  async function save() {
    try {
      await saveDocument('settings', { ...settings, announcementBar: bar }, 'public')
      push('Announcement updated.', 'success')
    } catch (error) {
      push(error.message, 'error')
    }
  }

  return (
    <section className="max-w-3xl rounded-lg bg-white p-6 shadow-soft">
      <h1 className="text-3xl font-black text-brand-navy">Announcement Bar</h1>
      <p className="mt-2 text-sm text-slate-600">Where this appears: thin bar above the navbar on desktop and mobile.</p>
      <div className="mt-6 grid gap-4">
        <Field label="Enabled">
          <Select value={bar.enabled ? 'yes' : 'no'} onChange={(event) => setBar({ ...bar, enabled: event.target.value === 'yes' })}>
            <option value="yes">Enabled</option>
            <option value="no">Disabled</option>
          </Select>
        </Field>
        <Field label="Text"><Input value={bar.text || ''} onChange={(event) => setBar({ ...bar, text: event.target.value })} /></Field>
        <Field label="Link"><Input value={bar.link || ''} onChange={(event) => setBar({ ...bar, link: event.target.value })} /></Field>
        <Field label="Background">
          <Select value={bar.bgColor || '#0D9488'} onChange={(event) => setBar({ ...bar, bgColor: event.target.value })}>
            <option value="#0D9488">Clinical Teal</option>
            <option value="#0F766E">Dark Teal</option>
            <option value="#16A34A">Success Green</option>
            <option value="#0F172A">Slate</option>
          </Select>
        </Field>
        <Button type="button" onClick={save}><Save className="size-4" /> Save Announcement</Button>
      </div>
    </section>
  )
}
