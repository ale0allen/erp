import { apiFetch, ensureOk } from '../../api/http'

import type { Cliente, ClientePayload } from './cliente.types'

const API_BASE = import.meta.env.VITE_API_URL

export async function fetchClientes(): Promise<Cliente[]> {
  const response = await apiFetch(`${API_BASE}/clientes`)
  await ensureOk(response)
  return response.json()
}

export async function criarCliente(payload: ClientePayload): Promise<Cliente> {
  const response = await apiFetch(`${API_BASE}/clientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  await ensureOk(response)
  return response.json()
}

export async function atualizarCliente(
  id: number,
  payload: ClientePayload
): Promise<Cliente> {
  const response = await apiFetch(`${API_BASE}/clientes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  await ensureOk(response)
  return response.json()
}

export async function removerCliente(id: number): Promise<void> {
  const response = await apiFetch(`${API_BASE}/clientes/${id}`, { method: 'DELETE' })
  await ensureOk(response)
}
