import { apiFetch, ensureOk } from '../../api/http'
import { asArrayFromApi } from '../../utils/apiArray'

import type {
  ContaReceberDetail,
  ContaReceberListItem,
  ContaReceberPayload,
  ContasReceberFiltros
} from './contasReceber.types'

const API_BASE = import.meta.env.VITE_API_URL

export async function fetchContasReceber(
  filtros: ContasReceberFiltros = {}
): Promise<ContaReceberListItem[]> {
  const params = new URLSearchParams()
  if (filtros.customerId != null) params.set('customerId', String(filtros.customerId))
  if (filtros.status) params.set('status', filtros.status)
  if (filtros.startDueDate) params.set('startDueDate', filtros.startDueDate)
  if (filtros.endDueDate) params.set('endDueDate', filtros.endDueDate)
  if (filtros.description?.trim()) params.set('description', filtros.description.trim())

  const qs = params.toString()
  const url = qs ? `${API_BASE}/contas-receber?${qs}` : `${API_BASE}/contas-receber`
  const response = await apiFetch(url)
  await ensureOk(response)
  const data: unknown = await response.json()
  return asArrayFromApi<ContaReceberListItem>(data, 'fetchContasReceber')
}

export async function fetchContaReceber(id: number): Promise<ContaReceberDetail> {
  const response = await apiFetch(`${API_BASE}/contas-receber/${id}`)
  await ensureOk(response)
  return response.json()
}

export async function criarContaReceber(payload: ContaReceberPayload): Promise<ContaReceberDetail> {
  const response = await apiFetch(`${API_BASE}/contas-receber`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  await ensureOk(response)
  return response.json()
}

export async function atualizarContaReceber(
  id: number,
  payload: ContaReceberPayload
): Promise<ContaReceberDetail> {
  const response = await apiFetch(`${API_BASE}/contas-receber/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  await ensureOk(response)
  return response.json()
}

export async function receberContaReceber(id: number): Promise<ContaReceberDetail> {
  const response = await apiFetch(`${API_BASE}/contas-receber/${id}/receber`, { method: 'POST' })
  await ensureOk(response)
  return response.json()
}

export async function cancelarContaReceber(id: number): Promise<ContaReceberDetail> {
  const response = await apiFetch(`${API_BASE}/contas-receber/${id}/cancelar`, { method: 'POST' })
  await ensureOk(response)
  return response.json()
}
