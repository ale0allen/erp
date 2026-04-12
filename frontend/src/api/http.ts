import { getToken } from '../auth/auth'

/**
 * fetch com Authorization Bearer quando existe token no localStorage.
 * Usar em todas as chamadas a APIs protegidas do ERP.
 */
export function apiFetch(input: string | URL, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers ?? undefined)
  const token = getToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  return fetch(input, { ...init, headers })
}
