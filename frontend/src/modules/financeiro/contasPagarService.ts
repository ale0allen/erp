import { apiFetch, ensureOk } from '../../api/http'
import { asArrayFromApi } from '../../utils/apiArray'

import type {
  ContaPagarDetail,
  ContaPagarListItem,
  ContaPagarPayload,
  ContasPagarFiltros
} from './contasPagar.types'

const API_BASE = import.meta.env.VITE_API_URL

export async function fetchContasPagar(
  filtros: ContasPagarFiltros = {}
): Promise<ContaPagarListItem[]> {
  const params = new URLSearchParams()
  if (filtros.fornecedorId != null) params.set('fornecedorId', String(filtros.fornecedorId))
  if (filtros.status) params.set('status', filtros.status)
  if (filtros.startDueDate) params.set('startDueDate', filtros.startDueDate)
  if (filtros.endDueDate) params.set('endDueDate', filtros.endDueDate)
  if (filtros.description?.trim()) params.set('description', filtros.description.trim())

  const qs = params.toString()
  const url = qs ? `${API_BASE}/contas-pagar?${qs}` : `${API_BASE}/contas-pagar`
  const response = await apiFetch(url)
  await ensureOk(response)
  const data: unknown = await response.json()
  return asArrayFromApi<ContaPagarListItem>(data, 'fetchContasPagar')
}

export async function fetchContaPagar(id: number): Promise<ContaPagarDetail> {
  const response = await apiFetch(`${API_BASE}/contas-pagar/${id}`)
  await ensureOk(response)
  return response.json()
}

export async function criarContaPagar(payload: ContaPagarPayload): Promise<ContaPagarDetail> {
  const response = await apiFetch(`${API_BASE}/contas-pagar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  await ensureOk(response)
  return response.json()
}

export async function atualizarContaPagar(
  id: number,
  payload: ContaPagarPayload
): Promise<ContaPagarDetail> {
  const response = await apiFetch(`${API_BASE}/contas-pagar/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  await ensureOk(response)
  return response.json()
}

export async function pagarContaPagar(id: number): Promise<ContaPagarDetail> {
  const response = await apiFetch(`${API_BASE}/contas-pagar/${id}/pagar`, { method: 'POST' })
  await ensureOk(response)
  return response.json()
}

export async function cancelarContaPagar(id: number): Promise<ContaPagarDetail> {
  const response = await apiFetch(`${API_BASE}/contas-pagar/${id}/cancelar`, { method: 'POST' })
  await ensureOk(response)
  return response.json()
}
