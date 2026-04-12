import type { AuthUser, LoginResponseBody } from './auth.types'

import { apiFetch } from '../api/http'

const API_BASE = import.meta.env.VITE_API_URL

export async function loginApi(login: string, password: string): Promise<LoginResponseBody> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login: login.trim(), password })
  })

  if (!response.ok) {
    let message = 'Credenciais inválidas'
    try {
      const data = (await response.json()) as { message?: string }
      if (typeof data.message === 'string' && data.message.trim()) {
        message = data.message.trim()
      }
    } catch {
      // ignore
    }
    throw new Error(message)
  }

  return response.json()
}

export async function fetchMeApi(): Promise<AuthUser> {
  const response = await apiFetch(`${API_BASE}/auth/me`)
  if (!response.ok) {
    throw new Error(`Sessão inválida (${response.status})`)
  }
  return response.json() as Promise<AuthUser>
}
