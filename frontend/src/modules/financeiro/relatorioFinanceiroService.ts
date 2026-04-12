import { apiFetch } from '../../api/http'

import type {
  RelatorioContasPagarResponse,
  RelatorioContasReceberResponse,
  RelatorioFinanceiroFiltrosPagar,
  RelatorioFinanceiroFiltrosReceber
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

export async function fetchRelatorioContasPagar(
  filtros: RelatorioFinanceiroFiltrosPagar = {}
): Promise<RelatorioContasPagarResponse> {
  const qs = paramsPagar(filtros).toString()
  const url = qs ? `${API_PAGAR}/financeiro/relatorios/contas-pagar?${qs}` : `${API_PAGAR}/financeiro/relatorios/contas-pagar`
  const response = await apiFetch(url)
  if (!response.ok) {
    throw new Error(`Erro ao carregar relatório de contas a pagar. Status: ${response.status}`)
  }
  return response.json()
}

export async function fetchRelatorioContasReceber(
  filtros: RelatorioFinanceiroFiltrosReceber = {}
): Promise<RelatorioContasReceberResponse> {
  const qs = paramsReceber(filtros).toString()
  const url = qs ? `${API_RECEBER}/financeiro/relatorios/contas-receber?${qs}` : `${API_RECEBER}/financeiro/relatorios/contas-receber`
  const response = await apiFetch(url)
  if (!response.ok) {
    throw new Error(`Erro ao carregar relatório de contas a receber. Status: ${response.status}`)
  }
  return response.json()
}
