import { apiFetch, ensureOk } from '../../api/http'

import type { Produto, ProdutoPayload, ProdutoResumo } from './produto.types'

const API_BASE = import.meta.env.VITE_API_URL

export async function fetchProdutoResumo(): Promise<ProdutoResumo> {
  const response = await apiFetch(`${API_BASE}/produtos/resumo`)
  await ensureOk(response)
  return response.json()
}

export async function fetchProdutos(): Promise<Produto[]> {
  const response = await apiFetch(`${API_BASE}/produtos`)
  await ensureOk(response)
  return response.json()
}

export async function criarProduto(produto: ProdutoPayload): Promise<Produto> {
  const response = await apiFetch(`${API_BASE}/produtos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(produto)
  })
  await ensureOk(response)
  return response.json()
}

export async function atualizarProduto(
  id: number,
  produto: ProdutoPayload
): Promise<Produto> {
  const response = await apiFetch(`${API_BASE}/produtos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(produto)
  })
  await ensureOk(response)
  return response.json()
}

export async function removerProduto(id: number): Promise<void> {
  const response = await apiFetch(`${API_BASE}/produtos/${id}`, { method: 'DELETE' })
  await ensureOk(response)
}
