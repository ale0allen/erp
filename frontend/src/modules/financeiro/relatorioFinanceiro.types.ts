import type { StatusContaPagar } from './contasPagar.types'
import type { StatusContaReceber } from './contasReceber.types'

export type TipoRelatorioFinanceiro = 'pagar' | 'receber'

export type ContaPagarRelatorioRow = {
  id: number
  description: string
  supplierName: string | null
  dueDate: string
  amount: number
  status: StatusContaPagar
  notes: string | null
}

export type RelatorioTotaisPagar = {
  totalCount: number
  totalAmount: number
  totalPendingAmount: number
  totalOverdueAmount: number
  totalPaidAmount: number
}

export type RelatorioContasPagarResponse = {
  rows: ContaPagarRelatorioRow[]
  totals: RelatorioTotaisPagar
}

export type ContaReceberRelatorioRow = {
  id: number
  description: string
  customerName: string | null
  dueDate: string
  amount: number
  status: StatusContaReceber
  notes: string | null
}

export type RelatorioTotaisReceber = {
  totalCount: number
  totalAmount: number
  totalPendingAmount: number
  totalOverdueAmount: number
  totalReceivedAmount: number
}

export type RelatorioContasReceberResponse = {
  rows: ContaReceberRelatorioRow[]
  totals: RelatorioTotaisReceber
}

export type RelatorioFinanceiroFiltrosPagar = {
  supplierId?: number
  status?: StatusContaPagar
  startDueDate?: string
  endDueDate?: string
  description?: string
}

export type RelatorioFinanceiroFiltrosReceber = {
  customerId?: number
  status?: StatusContaReceber
  startDueDate?: string
  endDueDate?: string
  description?: string
}
