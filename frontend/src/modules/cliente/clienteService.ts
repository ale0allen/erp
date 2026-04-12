import { apiFetch } from '../../api/http'

import type { Cliente, ClientePayload } from './cliente.types'

const API_BASE = import.meta.env.VITE_API_URL

export async function fetchClientes(): Promise<Cliente[]> {
  const response = await apiFetch(`${API_BASE}/clientes`)

  if (!response.ok) {
    throw new Error(`Erro ao buscar clientes. Status: ${response.status}`)
  }

  return response.json()
}

export async function criarCliente(payload: ClientePayload): Promise<Cliente> {
  const response = await apiFetch(`${API_BASE}/clientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`Erro ao salvar cliente. Status: ${response.status}`)
  }

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

  if (!response.ok) {
    throw new Error(`Erro ao atualizar cliente. Status: ${response.status}`)
  }

  return response.json()
}

export async function removerCliente(id: number): Promise<void> {
  const response = await apiFetch(`${API_BASE}/clientes/${id}`, { method: 'DELETE' })

  if (!response.ok) {
    throw new Error(`Erro ao excluir cliente. Status: ${response.status}`)
  }
}

