import type { AuthUser, LoginResponseBody } from './auth.types'

import { apiFetch, ensureOk, parseApiErrorBody } from '../api/http'

const API_BASE = import.meta.env.VITE_API_URL

export async function loginApi(login: string, password: string): Promise<LoginResponseBody> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login: login.trim(), password })
  })

  if (!response.ok) {
    const parsed = await parseApiErrorBody(response)
    // Alinhar com defaultMessage(401) em errorHandling: mensagem genérica → texto de login
    const message =
      response.status === 401 && parsed.message === 'Não autenticado.'
        ? 'Credenciais inválidas'
        : parsed.message
    throw new Error(message)
  }

  return response.json()
}

export async function fetchMeApi(): Promise<AuthUser> {
  const response = await apiFetch(`${API_BASE}/auth/me`)
  await ensureOk(response)
  return response.json() as Promise<AuthUser>
}
