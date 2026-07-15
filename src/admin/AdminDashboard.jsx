import { Link } from 'react-router-dom'
import { Activity, CalendarDays, Image, Mail, RefreshCw, Stethoscope } from 'lucide-react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Button } from '../components/shared/Button'
import { useToast } from '../components/shared/Toast'
import { gallery } from '../data/seed'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { syncSeedData } from './seedSync'

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-soft">
      <Icon className="size-6 text-brand-teal" />
      <p className="mt-4 text-3xl font-black text-brand-navy">{value}</p>
      <p className="text-sm font-bold text-slate-500">{label}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const appointments = useFirestoreCollection('appointments', [], 'preferredDate').data
  const contacts = useFirestoreCollection('contacts', [], 'createdAt').data
  const images = useFirestoreCollection('gallery', gallery).data
  const views = useFirestoreCollection('analytics/pageViews/events', [], 'timestamp').data
  const { push } = useToast()
  const chartData = Array.from({ length: 7 }).map((_, index) => ({ day: `D-${6 - index}`, views: Math.max(0, views.length - index * 2) }))

  async function seed() {
    try {
      await syncSeedData()
      push('Seed data synced to Firestore.', 'success')
    } catch (error) {
      push(error.message || 'Seed sync failed.', 'error')
    }
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-brand-navy">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">Live admin overview and launch shortcuts.</p>
        </div>
        <Button type="button" onClick={seed}>
          <RefreshCw className="size-4" /> Sync Seed Data
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Stat icon={Activity} label="Page views" value={views.length} />
        <Stat icon={CalendarDays} label="Appointments" value={appointments.length} />
        <Stat icon={Mail} label="Contacts" value={contacts.length} />
        <Stat icon={Image} label="Gallery items" value={images.length} />
        <Stat icon={Stethoscope} label="Open appointments" value={appointments.filter((item) => item.status === 'pending').length} />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-lg bg-white p-5 shadow-soft">
          <h2 className="font-black text-brand-navy">7-day traffic</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#0D9488" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-soft">
          <h2 className="font-black text-brand-navy">Quick Actions</h2>
          <div className="mt-4 grid gap-2">
            {[
              ['Edit announcement', '/admin/announcement'],
              ['Manage services', '/admin/services'],
              ['Review appointments', '/admin/appointments'],
              ['Update settings', '/admin/settings'],
            ].map(([label, href]) => (
              <Link key={href} to={href} className="rounded-lg bg-slate-50 px-4 py-3 text-sm font-bold text-brand-navy hover:bg-brand-blush">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
