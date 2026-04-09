export type StatusCompra = 'DRAFT' | 'COMPLETED' | 'CANCELLED'

export type CompraItemPayload = {
  produtoId: number
  quantidade: number
  custoUnitario: number
}

export type CompraPayload = {
  fornecedorId: number
  dataCompra: string // ISO
  observacoes: string | null
  itens: CompraItemPayload[]
}

export type CompraListItem = {
  id: number
  fornecedorNome: string
  dataCompra: string
  status: StatusCompra
  valorTotal: number
}

export type CompraItem = {
  id: number
  produtoId: number
  produtoNome: string
  quantidade: number
  custoUnitario: number
  subtotal: number
}

export type CompraDetail = {
  id: number
  fornecedorId: number
  fornecedorNome: string
  dataCompra: string
  status: StatusCompra
  observacoes: string | null
  valorTotal: number
  itens: CompraItem[]
  /** Presente quando a compra foi finalizada e gerou conta a pagar */
  contaPagarId?: number | null
}

