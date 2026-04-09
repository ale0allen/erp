export type Fornecedor = {
  id: number
  nome: string
  documento: string | null
  email: string | null
  telefone: string | null
  nomeContato: string | null
  ativo: boolean
  observacoes: string | null
}

export type FornecedorPayload = {
  nome: string
  documento: string | null
  email: string | null
  telefone: string | null
  nomeContato: string | null
  ativo: boolean
  observacoes: string | null
}

