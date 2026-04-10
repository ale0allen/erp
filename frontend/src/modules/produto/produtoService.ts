import type { Produto, ProdutoPayload, ProdutoResumo } from './produto.types'

const API_BASE = import.meta.env.VITE_API_URL
fetch(`${API_BASE}/produtos`)

export async function fetchProdutoResumo(): Promise<ProdutoResumo> {
  const response = await fetch(`${API_BASE}/produtos/resumo`)

  if (!response.ok) {
    throw new Error(`Erro ao buscar resumo de produtos. Status: ${response.status}`)
  }

  return response.json()
}

export async function fetchProdutos(): Promise<Produto[]> {
  const response = await fetch(`${API_BASE}/produtos`)

  if (!response.ok) {
    throw new Error(`Erro ao buscar produtos. Status: ${response.status}`)
  }

  const data = await response.json()
  return data
}

export async function criarProduto(produto: ProdutoPayload): Promise<Produto> {
  const url = `${API_BASE}/produtos`
  console.log('POST', url, 'body:', produto)

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(produto)
  })

  console.log('POST', url, 'status:', response.status)

  if (!response.ok) {
    throw new Error(`Erro ao salvar produto. Status: ${response.status}`)
  }

  const data = await response.json()
  console.log('POST', url, 'response:', data)
  return data
}

export async function atualizarProduto(
  id: number,
  produto: ProdutoPayload
): Promise<Produto> {
  const url = `${API_BASE}/produtos/${id}`
  console.log('PUT', url, 'body:', produto)

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(produto)
  })

  console.log('PUT', url, 'status:', response.status)

  if (!response.ok) {
    throw new Error(`Erro ao atualizar produto. Status: ${response.status}`)
  }

  const data = await response.json()
  console.log('PUT', url, 'response:', data)
  return data
}

export async function removerProduto(id: number): Promise<void> {
  const url = `${API_BASE}/produtos/${id}`
  console.log('DELETE', url)

  const response = await fetch(url, { method: 'DELETE' })
  console.log('DELETE', url, 'status:', response.status)

  if (!response.ok) {
    throw new Error(`Erro ao excluir produto. Status: ${response.status}`)
  }
}
