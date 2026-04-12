import { apiFetch, ensureOk } from '../../api/http'

import type {
  ContaPagarRelatorioRow,
  ContaReceberRelatorioRow,
  RelatorioContasPagarResponse,
  RelatorioContasReceberResponse,
  RelatorioFinanceiroFiltrosPagar,
  RelatorioFinanceiroFiltrosReceber,
  RelatorioTotaisPagar,
  RelatorioTotaisReceber
} from './relatorioFinanceiro.types'

const API_PAGAR = import.meta.env.VITE_API_URL

const API_RECEBER = import.meta.env.VITE_API_URL

function paramsPagar(f: RelatorioFinanceiroFiltrosPagar): URLSearchParams {
  const params = new URLSearchParams()
  if (f.supplierId != null) params.set('supplierId', String(f.supplierId))
  if (f.status) params.set('status', f.status)
  if (f.startDueDate) params.set('startDueDate', f.startDueDate)
  if (f.endDueDate) params.set('endDueDate', f.endDueDate)
  if (f.description?.trim()) params.set('description', f.description.trim())
  return params
}

function paramsReceber(f: RelatorioFinanceiroFiltrosReceber): URLSearchParams {
  const params = new URLSearchParams()
  if (f.customerId != null) params.set('customerId', String(f.customerId))
  if (f.status) params.set('status', f.status)
  if (f.startDueDate) params.set('startDueDate', f.startDueDate)
  if (f.endDueDate) params.set('endDueDate', f.endDueDate)
  if (f.description?.trim()) params.set('description', f.description.trim())
  return params
}

function emptyTotalsPagar(): RelatorioTotaisPagar {
  return {
    totalCount: 0,
    totalAmount: 0,
    totalPendingAmount: 0,
    totalOverdueAmount: 0,
    totalPaidAmount: 0
  }
}

function emptyTotalsReceber(): RelatorioTotaisReceber {
  return {
    totalCount: 0,
    totalAmount: 0,
    totalPendingAmount: 0,
    totalOverdueAmount: 0,
    totalReceivedAmount: 0
  }
}

function parseRelatorioPagar(raw: unknown): RelatorioContasPagarResponse {
  if (!raw || typeof raw !== 'object') {
    console.error('[fetchRelatorioContasPagar] Invalid response:', raw)
    return { rows: [], totals: emptyTotalsPagar() }
  }
  const o = raw as Record<string, unknown>
  const rows = Array.isArray(o.rows)
    ? (o.rows as ContaPagarRelatorioRow[])
    : (console.error('[fetchRelatorioContasPagar] rows is not an array:', o.rows), [])
  if (!o.totals || typeof o.totals !== 'object') {
    console.error('[fetchRelatorioContasPagar] Invalid or missing totals:', o.totals)
    return { rows, totals: emptyTotalsPagar() }
  }
  return { rows, totals: o.totals as RelatorioTotaisPagar }
}

function parseRelatorioReceber(raw: unknown): RelatorioContasReceberResponse {
  if (!raw || typeof raw !== 'object') {
    console.error('[fetchRelatorioContasReceber] Invalid response:', raw)
    return { rows: [], totals: emptyTotalsReceber() }
  }
  const o = raw as Record<string, unknown>
  const rows = Array.isArray(o.rows)
    ? (o.rows as ContaReceberRelatorioRow[])
    : (console.error('[fetchRelatorioContasReceber] rows is not an array:', o.rows), [])
  if (!o.totals || typeof o.totals !== 'object') {
    console.error('[fetchRelatorioContasReceber] Invalid or missing totals:', o.totals)
    return { rows, totals: emptyTotalsReceber() }
  }
  return { rows, totals: o.totals as RelatorioTotaisReceber }
}

export async function fetchRelatorioContasPagar(
  filtros: RelatorioFinanceiroFiltrosPagar = {}
): Promise<RelatorioContasPagarResponse> {
  const qs = paramsPagar(filtros).toString()
  const url = qs ? `${API_PAGAR}/financeiro/relatorios/contas-pagar?${qs}` : `${API_PAGAR}/financeiro/relatorios/contas-pagar`
  const response = await apiFetch(url)
  await ensureOk(response)
  const data: unknown = await response.json()
  return parseRelatorioPagar(data)
}

export async function fetchRelatorioContasReceber(
  filtros: RelatorioFinanceiroFiltrosReceber = {}
): Promise<RelatorioContasReceberResponse> {
  const qs = paramsReceber(filtros).toString()
  const url = qs ? `${API_RECEBER}/financeiro/relatorios/contas-receber?${qs}` : `${API_RECEBER}/financeiro/relatorios/contas-receber`
  const response = await apiFetch(url)
  await ensureOk(response)
  const data: unknown = await response.json()
  return parseRelatorioReceber(data)
}
