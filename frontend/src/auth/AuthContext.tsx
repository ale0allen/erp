import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react'

import { clearToken, hasAuthToken } from './auth'
import type { AuthUser } from './auth.types'
import { fetchMeApi } from './authService'

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    if (!hasAuthToken()) {
      setUser(null)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const u = await fetchMeApi()
      setUser(u)
    } catch {
      clearToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshUser()
  }, [refreshUser])

  const value = useMemo(
    () => ({
      user,
      loading,
      refreshUser
    }),
    [user, loading, refreshUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return ctx
}
