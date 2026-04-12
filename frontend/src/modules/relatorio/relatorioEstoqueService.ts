import { apiFetch, ensureOk } from '../../api/http'
import { asArrayFromApi } from '../../utils/apiArray'

import type { RelatorioEstoqueFiltros, RelatorioEstoqueItem } from './relatorioEstoque.types'

const API_BASE = import.meta.env.VITE_API_URL

export async function fetchRelatorioEstoque(
  filtros: RelatorioEstoqueFiltros = {}
): Promise<RelatorioEstoqueItem[]> {
  const params = new URLSearchParams()

  if (filtros.productName?.trim()) {
    params.set('productName', filtros.productName.trim())
  }
  if (filtros.categoryId != null) {
    params.set('categoryId', String(filtros.categoryId))
  }
  if (filtros.stockStatus) {
    params.set('stockStatus', filtros.stockStatus)
  }
  if (filtros.active === true || filtros.active === false) {
    params.set('active', String(filtros.active))
  }

  const qs = params.toString()
  const url = qs ? `${API_BASE}/produtos/relatorio-estoque?${qs}` : `${API_BASE}/produtos/relatorio-estoque`

  const response = await apiFetch(url)
  await ensureOk(response)
  const data: unknown = await response.json()
  return asArrayFromApi<RelatorioEstoqueItem>(data, 'fetchRelatorioEstoque')
}
