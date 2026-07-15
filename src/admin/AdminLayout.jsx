import { Link, NavLink, Outlet } from 'react-router-dom'
import { LogOut, Stethoscope } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const links = [
  ['Dashboard', '/admin', ['admin', 'editor']],
  ['Analytics', '/admin/analytics', ['admin']],
  ['Announcement', '/admin/announcement', ['admin']],
  ['Hero Slides', '/admin/hero-slides', ['admin']],
  ['Services', '/admin/services', ['admin']],
  ['Doctors', '/admin/doctors', ['admin']],
  ['Gallery', '/admin/gallery', ['admin', 'editor']],
  ['Blog', '/admin/blog', ['admin', 'editor']],
  ['Appointments', '/admin/appointments', ['admin', 'editor']],
  ['Contacts', '/admin/contacts', ['admin', 'editor']],
  ['Payments', '/admin/payments', ['admin']],
  ['Testimonials', '/admin/testimonials', ['admin']],
  ['Facilities', '/admin/facilities', ['admin']],
  ['Theme', '/admin/theme', ['admin']],
  ['Settings', '/admin/settings', ['admin']],
]

export function AdminLayout() {
  const { logout, user, role } = useAuth()
  const visibleLinks = links.filter(([, , roles]) => roles.includes(role))
  return (
    <div className="min-h-screen bg-brand-cream">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 overflow-auto border-r border-slate-200 bg-white p-4 lg:block">
        <Link to="/admin" className="flex items-center gap-3 rounded-lg bg-brand-teal p-3 text-white">
          <Stethoscope className="size-6" />
          <span className="font-black">Sreya Admin</span>
        </Link>
        <nav className="mt-5 grid gap-1">
          {visibleLinks.map(([label, href]) => (
            <NavLink
              key={href}
              to={href}
              end={href === '/admin'}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-bold ${isActive ? 'bg-brand-blush text-brand-rose' : 'text-slate-700 hover:bg-slate-50'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:px-8">
          <div>
            <p className="text-xs font-bold text-slate-500">Logged in as</p>
            <p className="text-sm font-black text-brand-navy">{user?.email}</p>
            <p className="text-xs font-bold uppercase text-slate-500">{role}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-brand-navy">View Site</Link>
            <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-lg bg-brand-navy px-3 py-2 text-sm font-bold text-white">
              <LogOut className="size-4" /> Logout
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
