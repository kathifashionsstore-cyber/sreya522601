import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DynamicForm } from './DynamicForm'
import { saveDocument, useFirestoreDoc } from '../hooks/useFirestoreCollection'
import { journeyTimelineSchema } from './formSchemas'
import { useToast } from '../components/shared/Toast'

const defaultMilestones = [
  {
    year: '2007',
    date: 'January 21, 2007',
    description: 'Establishment of Sreya Nursing Home & Maternity Hospital',
    bulletsText: 'Founded as a dedicated center for maternal & child care in Narasaraopet\nEquipped with 24/7 emergency labor room & diagnostic unit\nThousands of safe deliveries delivered with care',
    image1: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
    image2: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=600&q=80',
    image3: '',
    image4: '',
    image5: ''
  },
  {
    year: '2010–2016',
    date: '2010 to 2016',
    description: 'Expanded Gynecological & Laparoscopic Surgical Care',
    bulletsText: 'Introduced 3D/4D ultrasound pelvic scanning\nEstablished advanced minimally invasive laparoscopic surgery unit\nOver 7,000 successful keyhole & hysteroscopic procedures',
    image1: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
    image2: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80',
    image3: '',
    image4: '',
    image5: ''
  },
  {
    year: '2017',
    date: 'August 2017',
    description: 'Launch of First Specialized IVF & Embryology Centre in Palnadu',
    bulletsText: 'First dedicated cleanroom embryology lab in Palnadu region\nInstalled high-precision ICSI micromanipulator & CO2 incubators\nAchieved first successful IVF test-tube baby pregnancies in Narasaraopet',
    image1: 'https://images.unsplash.com/photo-1581093458791-9d2fcea0a349?auto=format&fit=crop&w=600&q=80',
    image2: 'https://images.unsplash.com/photo-1579156286657-41d3d68aa0a9?auto=format&fit=crop&w=600&q=80',
    image3: '',
    image4: '',
    image5: ''
  },
  {
    year: '2026',
    date: 'Present — 2026',
    description: 'Sreya 2.0 — Modernized Multi-Specialty Fertility Destination',
    bulletsText: 'State-of-the-art upgraded IVF & genetic screening lab\nOver 10,000+ happy families & 1,500+ free medical awareness camps\nExpanded digital consultation & patient care continuity',
    image1: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80',
    image2: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=600&q=80',
    image3: '',
    image4: '',
    image5: ''
  }
]

const defaultStats = {
  deliveries: '6000+',
  infertility: '10000+',
  laparoscopic: '7000+',
  camps: '1500+',
  tagline: 'Delivering clinical excellence with transparent care.'
}

export default function AdminSreyaJourney() {
  const { data: settings, loading } = useFirestoreDoc('settings/public')
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const { push } = useToast()

  useEffect(() => {
    if (settings) {
      setForm({
        ...settings,
        journeyTitle: settings.journeyTitle || "Sreya's Journey",
        journeyTagline: settings.journeyTagline || "Providing Affordable, Quality Healthcare for nearly 2 decades.",
        journeyMilestones: (settings.journeyMilestones && settings.journeyMilestones.length > 0) 
          ? settings.journeyMilestones 
          : defaultMilestones,
        journeyStats: settings.journeyStats || defaultStats
      })
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
    <div className="space-y-6 text-left">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-brand-navy">Sreya's Journey Timeline</h1>
          <p className="mt-1 text-xs text-slate-500 font-bold">
            Configure the animated history timeline (2007–2026) and milestone stats shown on the Doctors page.
          </p>
        </div>
        <Link 
          to="/admin/doctors" 
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#087f8c] bg-teal-50 px-4 py-2 text-xs font-extrabold text-[#087f8c] hover:bg-[#087f8c] hover:text-white transition"
        >
          ← Go to Doctors Profile Manager
        </Link>
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
