export type StatusVenda = 'DRAFT' | 'COMPLETED' | 'CANCELLED'

export type VendaItemPayload = {
  produtoId: number
  quantidade: number
  precoUnitario: number
}

export type VendaPayload = {
  clienteId: number
  dataVenda: string // ISO
  observacoes: string | null
  itens: VendaItemPayload[]
}

export type VendaListItem = {
  id: number
  clienteNome: string
  dataVenda: string
  status: StatusVenda
  valorTotal: number
}

export type VendaItem = {
  id: number
  produtoId: number
  produtoNome: string
  quantidade: number
  precoUnitario: number
  subtotal: number
}

export type VendaDetail = {
  id: number
  clienteId: number
  clienteNome: string
  dataVenda: string
  status: StatusVenda
  observacoes: string | null
  valorTotal: number
  itens: VendaItem[]
  /** Presente quando a venda foi finalizada e gerou conta a receber */
  contaReceberId?: number | null
}

