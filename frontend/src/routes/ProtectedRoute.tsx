import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../auth/AuthContext'
import { hasAuthToken } from '../auth/auth'

export function ProtectedRoute() {
  const location = useLocation()
  const { user, loading } = useAuth()

  if (!hasAuthToken()) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (loading) {
    return (
      <div
        className="erp-page"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f1f5f9'
        }}
      >
        <p className="status-message status-message--loading" role="status">
          Carregando sessão…
        </p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
