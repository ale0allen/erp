import { apiFetch } from '../../api/http'

import type {
  PerfilOption,
  UsuarioAdmin,
  UsuarioCreatePayload,
  UsuarioUpdatePayload
} from './usuarioAdmin.types'

const API_BASE = import.meta.env.VITE_API_URL

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json()
    if (data && typeof data === 'object' && 'message' in data) {
      const m = (data as { message?: unknown }).message
      if (typeof m === 'string' && m.length > 0) return m
    }
  } catch {
    /* ignore */
  }
  return `Erro HTTP ${response.status}`
}

export async function fetchPerfisDisponiveis(): Promise<PerfilOption[]> {
  const response = await apiFetch(`${API_BASE}/perfis`)
  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }
  return response.json()
}

export async function fetchUsuarios(): Promise<UsuarioAdmin[]> {
  const response = await apiFetch(`${API_BASE}/usuarios`)
  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }
  return response.json()
}

export async function fetchUsuario(id: number): Promise<UsuarioAdmin> {
  const response = await apiFetch(`${API_BASE}/usuarios/${id}`)
  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }
  return response.json()
}

export async function criarUsuario(payload: UsuarioCreatePayload): Promise<UsuarioAdmin> {
  const body = {
    nome: payload.nome,
    email: payload.email,
    username: payload.username && payload.username.trim() ? payload.username.trim() : null,
    password: payload.password,
    perfis: payload.perfis,
    ativo: payload.ativo
  }
  const response = await apiFetch(`${API_BASE}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }
  return response.json()
}

export async function atualizarUsuario(
  id: number,
  payload: UsuarioUpdatePayload
): Promise<UsuarioAdmin> {
  const body: Record<string, unknown> = {
    nome: payload.nome,
    email: payload.email,
    username: payload.username && payload.username.trim() ? payload.username.trim() : null,
    ativo: payload.ativo,
    perfis: payload.perfis
  }
  if (payload.password != null && payload.password.trim() !== '') {
    body.password = payload.password
  }
  const response = await apiFetch(`${API_BASE}/usuarios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }
  return response.json()
}
