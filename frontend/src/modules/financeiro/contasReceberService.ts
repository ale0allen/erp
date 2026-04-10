import type {
  ContaReceberDetail,
  ContaReceberListItem,
  ContaReceberPayload,
  ContasReceberFiltros
} from './contasReceber.types'

const API_BASE = import.meta.env.VITE_API_URL

fetch(`${API_BASE}/contas-receber`)

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
  const response = await fetch(url)
  if (!response.ok) {
    const msg = await extractApiErrorMessage(response)
    throw new Error(msg ?? `Erro ao buscar contas a receber. Status: ${response.status}`)
  }
  return response.json()
}

export async function fetchContaReceber(id: number): Promise<ContaReceberDetail> {
  const response = await fetch(`${API_BASE}/contas-receber/${id}`)
  if (!response.ok) {
    const msg = await extractApiErrorMessage(response)
    throw new Error(msg ?? `Erro ao buscar conta a receber. Status: ${response.status}`)
  }
  return response.json()
}

export async function criarContaReceber(payload: ContaReceberPayload): Promise<ContaReceberDetail> {
  const response = await fetch(`${API_BASE}/contas-receber`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!response.ok) {
    const msg = await extractApiErrorMessage(response)
    throw new Error(msg ?? `Erro ao criar conta a receber. Status: ${response.status}`)
  }
  return response.json()
}

export async function atualizarContaReceber(
  id: number,
  payload: ContaReceberPayload
): Promise<ContaReceberDetail> {
  const response = await fetch(`${API_BASE}/contas-receber/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!response.ok) {
    const msg = await extractApiErrorMessage(response)
    throw new Error(msg ?? `Erro ao atualizar conta a receber. Status: ${response.status}`)
  }
  return response.json()
}

export async function receberContaReceber(id: number): Promise<ContaReceberDetail> {
  const response = await fetch(`${API_BASE}/contas-receber/${id}/receber`, { method: 'POST' })
  if (!response.ok) {
    const msg = await extractApiErrorMessage(response)
    throw new Error(msg ?? `Erro ao marcar conta como recebida. Status: ${response.status}`)
  }
  return response.json()
}

export async function cancelarContaReceber(id: number): Promise<ContaReceberDetail> {
  const response = await fetch(`${API_BASE}/contas-receber/${id}/cancelar`, { method: 'POST' })
  if (!response.ok) {
    const msg = await extractApiErrorMessage(response)
    throw new Error(msg ?? `Erro ao cancelar conta a receber. Status: ${response.status}`)
  }
  return response.json()
}
