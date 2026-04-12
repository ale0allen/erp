import { apiFetch, ensureOk } from '../../api/http'

import type { Categoria, CategoriaPayload } from './categoria.types'

const API_BASE = import.meta.env.VITE_API_URL

export async function fetchCategorias(): Promise<Categoria[]> {
  const response = await apiFetch(`${API_BASE}/categorias`)
  await ensureOk(response)
  return response.json()
}

export async function criarCategoria(payload: CategoriaPayload): Promise<Categoria> {
  const response = await apiFetch(`${API_BASE}/categorias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  await ensureOk(response)
  return response.json()
}

export async function atualizarCategoria(
  id: number,
  payload: CategoriaPayload
): Promise<Categoria> {
  const response = await apiFetch(`${API_BASE}/categorias/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  await ensureOk(response)
  return response.json()
}

export async function removerCategoria(id: number): Promise<void> {
  const response = await apiFetch(`${API_BASE}/categorias/${id}`, { method: 'DELETE' })
  await ensureOk(response)
}
