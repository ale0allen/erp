import type { CompraDetail, CompraListItem, CompraPayload, StatusCompra } from './compra.types'

const API_BASE = import.meta.env.VITE_API_URL

fetch(`${API_BASE}/compras`)

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
  const url = qs ? `${API_BASE}?${qs}` : API_BASE
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Erro ao buscar compras. Status: ${response.status}`)
  }
  return response.json()
}

export async function fetchCompraDetalhe(id: number): Promise<CompraDetail> {
  const response = await fetch(`${API_BASE}/${id}`)
  if (!response.ok) {
    throw new Error(`Erro ao buscar compra. Status: ${response.status}`)
  }
  return response.json()
}

export async function criarCompra(payload: CompraPayload): Promise<CompraDetail> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!response.ok) {
    throw new Error(`Erro ao criar compra. Status: ${response.status}`)
  }
  return response.json()
}

export async function atualizarCompra(
  id: number,
  payload: CompraPayload
): Promise<CompraDetail> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!response.ok) {
    throw new Error(`Erro ao atualizar compra. Status: ${response.status}`)
  }
  return response.json()
}

export async function cancelarCompra(id: number): Promise<CompraDetail> {
  const response = await fetch(`${API_BASE}/${id}/cancelar`, { method: 'POST' })
  if (!response.ok) {
    throw new Error(`Erro ao cancelar compra. Status: ${response.status}`)
  }
  return response.json()
}

export async function finalizarCompra(id: number): Promise<CompraDetail> {
  const response = await fetch(`${API_BASE}/${id}/finalizar`, { method: 'POST' })
  if (!response.ok) {
    throw new Error(`Erro ao finalizar compra. Status: ${response.status}`)
  }
  return response.json()
}

