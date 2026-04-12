import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { hasAuthToken } from '../auth/auth'

export function ProtectedRoute() {
  const location = useLocation()

  if (!hasAuthToken()) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
