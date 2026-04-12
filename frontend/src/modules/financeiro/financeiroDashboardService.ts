import { apiFetch } from '../../api/http'

import type { FinanceiroDashboardFiltros, FinanceiroDashboardResumo } from './financeiroDashboard.types'

const API_URL = import.meta.env.VITE_API_URL

export async function fetchFinanceiroDashboard(
  filtros: FinanceiroDashboardFiltros = {}
): Promise<FinanceiroDashboardResumo> {
  const params = new URLSearchParams()
  if (filtros.startDate) params.set('startDate', filtros.startDate)
  if (filtros.endDate) params.set('endDate', filtros.endDate)

  const qs = params.toString()
  const url = qs ? `${API_URL}/financeiro/dashboard?${qs}` : `${API_URL}/financeiro/dashboard`
  const response = await apiFetch(url)
  if (!response.ok) {
    throw new Error(`Erro ao carregar dashboard financeiro. Status: ${response.status}`)
  }
  return response.json()
}
