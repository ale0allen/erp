import type { StatusVenda, VendaDetail, VendaListItem, VendaPayload } from './venda.types'

const API_BASE = import.meta.env.VITE_API_URL
fetch(`${API_BASE}/vendas`)

async function extractApiErrorMessage(response: Response): Promise<string | null> {
  try {
    const data = await response.json()
    if (data && typeof data === 'object') {
      const msg = (data as { message?: unknown }).message
      if (typeof msg === 'string' && msg.trim()) {
        return msg
      }
      const err = (data as { erro?: unknown }).erro
      if (typeof err === 'string' && err.trim()) {
        return err
      }
    }
  } catch {
    // ignore
  }
  try {
    const text = await response.text()
    return text.trim() ? text : null
  } catch {
    return null
  }
}

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
  const response = await fetch(`${API_BASE}/vendas` + qs)

  if (!response.ok) {
    const msg = await extractApiErrorMessage(response)
    throw new Error(msg ?? `Erro ao buscar vendas. Status: ${response.status}`)
  }
  return response.json()
}

export async function fetchVendaDetalhe(id: number): Promise<VendaDetail> {
  const response = await fetch(`${API_BASE}/vendas/${id}`)
  if (!response.ok) {
    const msg = await extractApiErrorMessage(response)
    throw new Error(msg ?? `Erro ao buscar venda. Status: ${response.status}`)
  }
  return response.json()
}

export async function criarVenda(payload: VendaPayload): Promise<VendaDetail> {
  const response = await fetch(`${API_BASE}/vendas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!response.ok) {
    const msg = await extractApiErrorMessage(response)
    throw new Error(msg ?? `Erro ao criar venda. Status: ${response.status}`)
  }
  return response.json()
}

export async function atualizarVenda(id: number, payload: VendaPayload): Promise<VendaDetail> {
  const response = await fetch(`${API_BASE}/vendas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!response.ok) {
    const msg = await extractApiErrorMessage(response)
    throw new Error(msg ?? `Erro ao atualizar venda. Status: ${response.status}`)
  }
  return response.json()
}

export async function cancelarVenda(id: number): Promise<VendaDetail> {
  const response = await fetch(`${API_BASE}/vendas/${id}/cancelar`, { method: 'POST' })
  if (!response.ok) {
    const msg = await extractApiErrorMessage(response)
    throw new Error(msg ?? `Erro ao cancelar venda. Status: ${response.status}`)
  }
  return response.json()
}

export async function finalizarVenda(id: number): Promise<VendaDetail> {
  const response = await fetch(`${API_BASE}/vendas/${id}/finalizar`, { method: 'POST' })
  if (!response.ok) {
    const msg = await extractApiErrorMessage(response)
    throw new Error(msg ?? `Erro ao finalizar venda. Status: ${response.status}`)
  }
  return response.json()
}

