import { apiFetch, ensureOk } from '../../api/http'
import { asArrayFromApi } from '../../utils/apiArray'

import type {
  MovimentacaoEstoque,
  MovimentacaoEstoquePayload
} from './movimentacaoEstoque.types'

const API_BASE = import.meta.env.VITE_API_URL

export async function fetchMovimentacoes(): Promise<MovimentacaoEstoque[]> {
  const response = await apiFetch(`${API_BASE}/movimentacoes-estoque`)
  await ensureOk(response)
  const data: unknown = await response.json()
  return asArrayFromApi<MovimentacaoEstoque>(data, 'fetchMovimentacoes')
}

export async function registrarMovimentacao(
  payload: MovimentacaoEstoquePayload
): Promise<MovimentacaoEstoque> {
  const response = await apiFetch(`${API_BASE}/movimentacoes-estoque`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      produtoId: payload.produtoId,
      tipo: payload.tipo,
      quantidade: payload.quantidade,
      observacao: payload.observacao ?? null
    })
  })
  await ensureOk(response)
  return response.json()
}
