import type { Categoria, CategoriaPayload } from './categoria.types'

const API_BASE = import.meta.env.VITE_API_URL

fetch(`${API_BASE}/categorias`)

export async function fetchCategorias(): Promise<Categoria[]> {
  const response = await fetch(`${API_BASE}/categorias`)

  if (!response.ok) {
    throw new Error(`Erro ao buscar categorias. Status: ${response.status}`)
  }

  return response.json()
}

export async function criarCategoria(payload: CategoriaPayload): Promise<Categoria> {
  const response = await fetch(`${API_BASE}/categorias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`Erro ao salvar categoria. Status: ${response.status}`)
  }

  return response.json()
}

export async function atualizarCategoria(
  id: number,
  payload: CategoriaPayload
): Promise<Categoria> {
  const response = await fetch(`${API_BASE}/categorias/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`Erro ao atualizar categoria. Status: ${response.status}`)
  }

  return response.json()
}

export async function removerCategoria(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/categorias/${id}`, { method: 'DELETE' })

  if (!response.ok) {
    throw new Error(`Erro ao excluir categoria. Status: ${response.status}`)
  }
}
