import { apiFetch, ensureOk } from '../../api/http'
import { asArrayFromApi } from '../../utils/apiArray'

import type {
  CompraDetail,
  CompraItem,
  CompraListItem,
  CompraPayload,
  StatusCompra
} from './compra.types'

const API_BASE = import.meta.env.VITE_API_URL

export type CompraListFiltros = {
  fornecedorId?: number
  status?: StatusCompra
  startDate?: string // YYYY-MM-DD
  endDate?: string // YYYY-MM-DD
}

export async function fetchCompras(
  filtros: CompraListFiltros = {}
): Promise<CompraListItem[]> {
  const params = new URLSearchParams()
  if (filtros.fornecedorId != null) {
    params.set('fornecedorId', String(filtros.fornecedorId))
  }
  if (filtros.status) {
    params.set('status', filtros.status)
  }
  if (filtros.startDate) {
    params.set('startDate', filtros.startDate)
  }
  if (filtros.endDate) {
    params.set('endDate', filtros.endDate)
  }

  const qs = params.toString()
  const url = qs ? `${API_BASE}/compras?${qs}` : `${API_BASE}/compras`
  const response = await apiFetch(url)
  await ensureOk(response)
  const data: unknown = await response.json()
  return asArrayFromApi<CompraListItem>(data, 'fetchCompras')
}

function normalizeCompraDetail(raw: unknown): CompraDetail {
  if (!raw || typeof raw !== 'object') {
    console.error('[fetchCompraDetalhe] Invalid response:', raw)
    throw new Error('Resposta inválida ao carregar compra.')
  }
  const o = raw as Record<string, unknown> & CompraDetail
  const itens = Array.isArray(o.itens)
    ? (o.itens as CompraItem[])
    : (console.error('[fetchCompraDetalhe] itens is not an array:', o.itens), [])
  return { ...o, itens }
}

export async function fetchCompraDetalhe(id: number): Promise<CompraDetail> {
  const response = await apiFetch(`${API_BASE}/compras/${id}`)
  await ensureOk(response)
  const data: unknown = await response.json()
  return normalizeCompraDetail(data)
}

export async function criarCompra(payload: CompraPayload): Promise<CompraDetail> {
  const response = await apiFetch(`${API_BASE}/compras`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  await ensureOk(response)
  return response.json()
}

export async function atualizarCompra(
  id: number,
  payload: CompraPayload
): Promise<CompraDetail> {
  const response = await apiFetch(`${API_BASE}/compras/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  await ensureOk(response)
  return response.json()
}

export async function cancelarCompra(id: number): Promise<CompraDetail> {
  const response = await apiFetch(`${API_BASE}/compras/${id}/cancelar`, { method: 'POST' })
  await ensureOk(response)
  return response.json()
}

export async function finalizarCompra(id: number): Promise<CompraDetail> {
  const response = await apiFetch(`${API_BASE}/compras/${id}/finalizar`, { method: 'POST' })
  await ensureOk(response)
  return response.json()
}
