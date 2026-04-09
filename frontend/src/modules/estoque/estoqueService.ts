import type {
  MovimentacaoEstoque,
  MovimentacaoEstoquePayload
} from './movimentacaoEstoque.types'

const API_BASE = 'http://localhost:8080/movimentacoes-estoque'

export async function fetchMovimentacoes(): Promise<MovimentacaoEstoque[]> {
  const response = await fetch(API_BASE)

  if (!response.ok) {
    throw new Error(`Erro ao buscar movimentações. Status: ${response.status}`)
  }

  return response.json()
}

export async function registrarMovimentacao(
  payload: MovimentacaoEstoquePayload
): Promise<MovimentacaoEstoque> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      produtoId: payload.produtoId,
      tipo: payload.tipo,
      quantidade: payload.quantidade,
      observacao: payload.observacao ?? null
    })
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(
      text || `Erro ao registrar movimentação. Status: ${response.status}`
    )
  }

  return response.json()
}
