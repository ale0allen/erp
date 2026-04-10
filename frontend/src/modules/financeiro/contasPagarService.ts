import type {
  ContaPagarDetail,
  ContaPagarListItem,
  ContaPagarPayload,
  ContasPagarFiltros
} from './contasPagar.types'

const API_BASE = import.meta.env.VITE_API_URL

fetch(`${API_BASE}/contas-pagar`)

async function extractApiErrorMessage(response: Response): Promise<string | null> {
  try {
    const data = await response.json()
    if (data && typeof data === 'object') {
      const msg = (data as { message?: unknown }).message
      if (typeof msg === 'string' && msg.trim()) return msg
      const err = (data as { erro?: unknown }).erro
      if (typeof err === 'string' && err.trim()) return err
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
  const response = await fetch(url)
  if (!response.ok) {
    const msg = await extractApiErrorMessage(response)
    throw new Error(msg ?? `Erro ao buscar contas a pagar. Status: ${response.status}`)
  }
  return response.json()
}

export async function fetchContaPagar(id: number): Promise<ContaPagarDetail> {
  const response = await fetch(`${API_BASE}/contas-pagar/${id}`)
  if (!response.ok) {
    const msg = await extractApiErrorMessage(response)
    throw new Error(msg ?? `Erro ao buscar conta a pagar. Status: ${response.status}`)
  }
  return response.json()
}

export async function criarContaPagar(payload: ContaPagarPayload): Promise<ContaPagarDetail> {
  const response = await fetch(`${API_BASE}/contas-pagar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!response.ok) {
    const msg = await extractApiErrorMessage(response)
    throw new Error(msg ?? `Erro ao criar conta a pagar. Status: ${response.status}`)
  }
  return response.json()
}

export async function atualizarContaPagar(
  id: number,
  payload: ContaPagarPayload
): Promise<ContaPagarDetail> {
  const response = await fetch(`${API_BASE}/contas-pagar/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!response.ok) {
    const msg = await extractApiErrorMessage(response)
    throw new Error(msg ?? `Erro ao atualizar conta a pagar. Status: ${response.status}`)
  }
  return response.json()
}

export async function pagarContaPagar(id: number): Promise<ContaPagarDetail> {
  const response = await fetch(`${API_BASE}/contas-pagar/${id}/pagar`, { method: 'POST' })
  if (!response.ok) {
    const msg = await extractApiErrorMessage(response)
    throw new Error(msg ?? `Erro ao pagar conta a pagar. Status: ${response.status}`)
  }
  return response.json()
}

export async function cancelarContaPagar(id: number): Promise<ContaPagarDetail> {
  const response = await fetch(`${API_BASE}/contas-pagar/${id}/cancelar`, { method: 'POST' })
  if (!response.ok) {
    const msg = await extractApiErrorMessage(response)
    throw new Error(msg ?? `Erro ao cancelar conta a pagar. Status: ${response.status}`)
  }
  return response.json()
}

