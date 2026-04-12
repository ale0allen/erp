import { apiFetch, ensureOk } from '../../api/http'
import { asArrayFromApi } from '../../utils/apiArray'

import type { StatusVenda, VendaDetail, VendaItem, VendaListItem, VendaPayload } from './venda.types'

const API_BASE = import.meta.env.VITE_API_URL

export type VendaListFiltros = {
  clienteId?: number
  status?: StatusVenda
  startDate?: string // YYYY-MM-DD
  endDate?: string // YYYY-MM-DD
}

export async function fetchVendas(filtros: VendaListFiltros = {}): Promise<VendaListItem[]> {
  const params = new URLSearchParams()
  if (filtros.clienteId != null) params.set('clienteId', String(filtros.clienteId))
  if (filtros.status) params.set('status', filtros.status)
  if (filtros.startDate) params.set('startDate', filtros.startDate)
  if (filtros.endDate) params.set('endDate', filtros.endDate)

  const qs = params.toString()
  const url = qs ? `${API_BASE}/vendas?${qs}` : `${API_BASE}/vendas`
  const response = await apiFetch(url)
  await ensureOk(response)
  const data: unknown = await response.json()
  return asArrayFromApi<VendaListItem>(data, 'fetchVendas')
}

function normalizeVendaDetail(raw: unknown): VendaDetail {
  if (!raw || typeof raw !== 'object') {
    console.error('[fetchVendaDetalhe] Invalid response:', raw)
    throw new Error('Resposta inválida ao carregar venda.')
  }
  const o = raw as Record<string, unknown> & VendaDetail
  const itens = Array.isArray(o.itens)
    ? (o.itens as VendaItem[])
    : (console.error('[fetchVendaDetalhe] itens is not an array:', o.itens), [])
  return { ...o, itens }
}

export async function fetchVendaDetalhe(id: number): Promise<VendaDetail> {
  const response = await apiFetch(`${API_BASE}/vendas/${id}`)
  await ensureOk(response)
  const data: unknown = await response.json()
  return normalizeVendaDetail(data)
}

export async function criarVenda(payload: VendaPayload): Promise<VendaDetail> {
  const response = await apiFetch(`${API_BASE}/vendas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  await ensureOk(response)
  return response.json()
}

export async function atualizarVenda(id: number, payload: VendaPayload): Promise<VendaDetail> {
  const response = await apiFetch(`${API_BASE}/vendas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  await ensureOk(response)
  return response.json()
}

export async function cancelarVenda(id: number): Promise<VendaDetail> {
  const response = await apiFetch(`${API_BASE}/vendas/${id}/cancelar`, { method: 'POST' })
  await ensureOk(response)
  return response.json()
}

export async function finalizarVenda(id: number): Promise<VendaDetail> {
  const response = await apiFetch(`${API_BASE}/vendas/${id}/finalizar`, { method: 'POST' })
  await ensureOk(response)
  return response.json()
}
