import type { StatusEstoque } from '../produto/produto.types'

export type RelatorioEstoqueItem = {
  productId: number
  productCode: string
  productName: string
  categoryName: string
  active: boolean
  stockBalance: number
  minimumStock: number
  stockStatus: StatusEstoque
}

export type RelatorioEstoqueFiltros = {
  productName?: string
  categoryId?: number
  stockStatus?: StatusEstoque
  active?: boolean
}
