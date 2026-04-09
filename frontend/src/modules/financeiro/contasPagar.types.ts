export type StatusContaPagar = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED'

export type ContaPagarListItem = {
  id: number
  descricao: string
  fornecedorId: number | null
  fornecedorNome: string | null
  dataVencimento: string // YYYY-MM-DD
  valor: number
  status: StatusContaPagar
}

export type ContaPagarDetail = {
  id: number
  descricao: string
  fornecedorId: number | null
  fornecedorNome: string | null
  dataVencimento: string
  valor: number
  status: StatusContaPagar
  observacoes: string | null
  criadoEm: string
}

export type ContaPagarPayload = {
  descricao: string
  fornecedorId: number | null
  dataVencimento: string // YYYY-MM-DD
  valor: number
  observacoes: string | null
}

export type ContasPagarFiltros = {
  fornecedorId?: number
  status?: StatusContaPagar
  startDueDate?: string
  endDueDate?: string
  description?: string
}

