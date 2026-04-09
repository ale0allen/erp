export type StatusContaReceber = 'PENDING' | 'RECEIVED' | 'OVERDUE' | 'CANCELLED'

export type ContaReceberListItem = {
  id: number
  descricao: string
  clienteId: number | null
  clienteNome: string | null
  dataVencimento: string // YYYY-MM-DD
  valor: number
  status: StatusContaReceber
}

export type ContaReceberDetail = {
  id: number
  descricao: string
  clienteId: number | null
  clienteNome: string | null
  dataVencimento: string
  valor: number
  status: StatusContaReceber
  observacoes: string | null
  criadoEm: string
}

export type ContaReceberPayload = {
  descricao: string
  clienteId: number | null
  dataVencimento: string // YYYY-MM-DD
  valor: number
  observacoes: string | null
}

export type ContasReceberFiltros = {
  customerId?: number
  status?: StatusContaReceber
  startDueDate?: string
  endDueDate?: string
  description?: string
}
