import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from './AuthContext'
import type { Perfil } from './auth.types'
import { hasAlgumPerfil } from './permissions'

type RoleGateProps = {
  perfis: Perfil[]
  children: ReactNode
}

export function RoleGate({ perfis, children }: RoleGateProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div
        className="erp-page"
        style={{
          minHeight: '40vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <p className="status-message status-message--loading" role="status">
          Carregando permissões…
        </p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!hasAlgumPerfil(user, ...perfis)) {
    return <Navigate to="/acesso-negado" replace />
  }

  return <>{children}</>
}
