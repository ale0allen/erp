import type { Auditoria } from '../../types/audit.types'

export type Produto = {
  id: number
  codigo: string
  nome: string
  precoCusto: number | null
  precoVenda: number | null
  ativo: boolean
  categoriaId: number
  categoriaNome: string
  saldoEstoque: number
  estoqueMinimo: number
  statusEstoque: StatusEstoque
  auditoria?: Auditoria | null
}

export type StatusEstoque = 'OUT_OF_STOCK' | 'LOW_STOCK' | 'NORMAL'

export type ProdutoPayload = {
  codigo: string
  nome: string
  precoCusto: number | null
  precoVenda: number | null
  ativo: boolean
  estoqueMinimo: number
  categoriaId: number
}

export type ProdutoResumo = {
  totalProducts: number
  activeProducts: number
  inactiveProducts: number
  totalStockQuantity: number
  productsOutOfStock: number
  productsWithLowStock: number
  productsWithNormalStock: number
}
