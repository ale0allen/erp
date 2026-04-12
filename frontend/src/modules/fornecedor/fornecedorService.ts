import { apiFetch, ensureOk } from '../../api/http'
import { asArrayFromApi } from '../../utils/apiArray'

import type { Fornecedor, FornecedorPayload } from './fornecedor.types'

const API_BASE = import.meta.env.VITE_API_URL

export async function fetchFornecedores(): Promise<Fornecedor[]> {
  const response = await apiFetch(`${API_BASE}/fornecedores`)
  await ensureOk(response)
  const data: unknown = await response.json()
  return asArrayFromApi<Fornecedor>(data, 'fetchFornecedores')
}

export async function criarFornecedor(payload: FornecedorPayload): Promise<Fornecedor> {
  const response = await apiFetch(`${API_BASE}/fornecedores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  await ensureOk(response)
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
  await ensureOk(response)
  return response.json()
}

export async function removerFornecedor(id: number): Promise<void> {
  const response = await apiFetch(`${API_BASE}/fornecedores/${id}`, { method: 'DELETE' })
  await ensureOk(response)
}
