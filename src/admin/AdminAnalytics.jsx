import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'

const colors = ['#0D9488', '#16A34A', '#0EA5E9', '#F59E0B', '#0F172A']

function countBy(items, key) {
  const counts = new Map()
  items.forEach((item) => counts.set(item[key] || 'Unknown', (counts.get(item[key] || 'Unknown') || 0) + 1))
  return Array.from(counts, ([name, value]) => ({ name, value }))
}

export default function AdminAnalytics() {
  const views = useFirestoreCollection('analytics/pageViews/events', [], 'timestamp').data
  const appointments = useFirestoreCollection('appointments', [], 'preferredDate').data
  const pageData = countBy(views, 'path')
  const deviceData = countBy(views, 'device')
  const departmentData = countBy(appointments, 'department')
  const statusData = countBy(appointments, 'status')
  const appointmentPageVisits = views.filter((item) => item.path?.startsWith('/appointment')).length
  const funnel = [
    { name: 'Page views', value: views.length },
    { name: 'Appointment visits', value: appointmentPageVisits },
    { name: 'Submissions', value: appointments.length },
  ]

  return (
    <section className="grid gap-6">
      <div>
        <h1 className="text-3xl font-black text-brand-navy">Analytics</h1>
        <p className="mt-2 text-sm text-slate-600">Page views, funnel, department popularity, devices, and appointment statuses.</p>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        {[
          ['Funnel', funnel],
          ['Top pages', pageData],
          ['Department popularity', departmentData],
          ['Appointment status', statusData],
        ].map(([title, data]) => (
          <div key={title} className="rounded-lg bg-white p-5 shadow-soft">
            <h2 className="font-black text-brand-navy">{title}</h2>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0D9488" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
        <div className="rounded-lg bg-white p-5 shadow-soft">
          <h2 className="font-black text-brand-navy">Device breakdown</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deviceData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {deviceData.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  )
}
