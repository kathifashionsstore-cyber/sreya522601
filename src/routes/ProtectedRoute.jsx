import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PageSkeleton } from '../components/shared/Skeleton'

export function ProtectedRoute() {
  const { user, isStaff, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageSkeleton />
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  if (!isStaff) return <Navigate to="/admin/login?blocked=staff-claim-required" replace />
  return <Outlet />
}

export function RoleGate({ children, roles = ['admin'] }) {
  const { role, loading } = useAuth()
  if (loading) return <PageSkeleton />
  if (!roles.includes(role)) return <Navigate to="/admin" replace />
  return children
}
