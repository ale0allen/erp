export type FinanceiroDashboardResumo = {
  totalPayablesPending: number
  totalPayablesOverdue: number
  totalPayablesPaid: number
  totalReceivablesPending: number
  totalReceivablesOverdue: number
  totalReceivablesReceived: number
  totalPayablesAmountPending: number
  totalPayablesAmountOverdue: number
  totalReceivablesAmountPending: number
  totalReceivablesAmountOverdue: number
  totalReceivablesAmountReceived: number
  totalPayablesAmountPaid: number
  projectedBalance: number
}

export type FinanceiroDashboardFiltros = {
  startDate?: string // YYYY-MM-DD
  endDate?: string // YYYY-MM-DD
}
