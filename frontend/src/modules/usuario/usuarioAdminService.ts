import { apiFetch, ensureOk } from '../../api/http'

import type {
  PageResponse,
  PerfilOption,
  UsuarioAdmin,
  UsuarioCreatePayload,
  UsuarioUpdatePayload
} from './usuarioAdmin.types'

const API_BASE = import.meta.env.VITE_API_URL

export type FetchUsuariosParams = {
  page?: number
  size?: number
}

export async function fetchPerfisDisponiveis(): Promise<PerfilOption[]> {
  const response = await apiFetch(`${API_BASE}/perfis`)
  await ensureOk(response)
  const data: unknown = await response.json()
  return Array.isArray(data) ? data : []
}

/** GET /usuarios — resposta paginada (`content`, `page`, `totalPages`, …). */
export async function fetchUsuarios(
  params: FetchUsuariosParams = {}
): Promise<PageResponse<UsuarioAdmin>> {
  const page = params.page ?? 0
  const size = params.size ?? 20
  const search = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort: 'id,asc'
  })
  const response = await apiFetch(`${API_BASE}/usuarios?${search.toString()}`)
  await ensureOk(response)
  return response.json()
}

/**
 * Lista plana para selects (ex.: filtro na auditoria): uma página com limite alto.
 */
export async function fetchUsuariosParaSelect(): Promise<UsuarioAdmin[]> {
  const res = await fetchUsuarios({ page: 0, size: 500 })
  return Array.isArray(res.content) ? res.content : []
}

export async function fetchUsuario(id: number): Promise<UsuarioAdmin> {
  const response = await apiFetch(`${API_BASE}/usuarios/${id}`)
  await ensureOk(response)
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
  await ensureOk(response)
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
  await ensureOk(response)
  return response.json()
}
