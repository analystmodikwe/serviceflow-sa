import { Navigate, Outlet } from 'react-router-dom'
import { homePathForRole, type UserRole } from './AuthContext'
import { useAuth } from './useAuth'

export default function ProtectedRoute({
  allowedRoles,
}: {
  allowedRoles: UserRole[]
}) {
  const { session, role, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center" role="status">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-100 border-t-brand-700" />
      </div>
    )
  }
  if (!session) return <Navigate to="/login" replace />
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={homePathForRole(role)} replace />
  }
  return <Outlet />
}
