/** Tipos alinhados ao backend de movimentações de estoque */

export type TipoMovimentacaoEstoque = 'ENTRADA' | 'SAIDA'

export type MovimentacaoEstoquePayload = {
  produtoId: number
  tipo: TipoMovimentacaoEstoque
  quantidade: number
  observacao: string | null
}

export type MovimentacaoEstoque = {
  id: number
  produtoId: number
  produtoCodigo: string
  produtoNome: string
  tipo: TipoMovimentacaoEstoque
  quantidade: number
  observacao: string | null
  dataMovimentacao: string
}
