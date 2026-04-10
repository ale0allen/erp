import type { RelatorioEstoqueFiltros, RelatorioEstoqueItem } from './relatorioEstoque.types'

const API_BASE = 'http://localhost:8080/produtos/relatorio-estoque'

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
  const url = qs ? `${API_BASE}?${qs}` : API_BASE

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Erro ao buscar relatório de estoque. Status: ${response.status}`)
  }

  return response.json()
}
