import { apiFetch } from '../../api/http'

import type { Fornecedor, FornecedorPayload } from './fornecedor.types'

const API_BASE = import.meta.env.VITE_API_URL

export async function fetchFornecedores(): Promise<Fornecedor[]> {
  const response = await apiFetch(`${API_BASE}/fornecedores`)

  if (!response.ok) {
    throw new Error(`Erro ao buscar fornecedores. Status: ${response.status}`)
  }

  return response.json()
}

export async function criarFornecedor(payload: FornecedorPayload): Promise<Fornecedor> {
  const response = await apiFetch(`${API_BASE}/fornecedores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`Erro ao salvar fornecedor. Status: ${response.status}`)
  }

  return response.json()
}

export async function atualizarFornecedor(
  id: number,
  payload: FornecedorPayload
): Promise<Fornecedor> {
  const response = await apiFetch(`${API_BASE}/fornecedores/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`Erro ao atualizar fornecedor. Status: ${response.status}`)
  }

  return response.json()
}

export async function removerFornecedor(id: number): Promise<void> {
  const response = await apiFetch(`${API_BASE}/fornecedores/${id}`, { method: 'DELETE' })

  if (!response.ok) {
    throw new Error(`Erro ao excluir fornecedor. Status: ${response.status}`)
  }
}

