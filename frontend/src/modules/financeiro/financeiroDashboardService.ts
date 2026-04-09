import type { FinanceiroDashboardFiltros, FinanceiroDashboardResumo } from './financeiroDashboard.types'

const API_URL = 'http://localhost:8080/financeiro/dashboard'

export async function fetchFinanceiroDashboard(
  filtros: FinanceiroDashboardFiltros = {}
): Promise<FinanceiroDashboardResumo> {
  const params = new URLSearchParams()
  if (filtros.startDate) params.set('startDate', filtros.startDate)
  if (filtros.endDate) params.set('endDate', filtros.endDate)

  const qs = params.toString()
  const url = qs ? `${API_URL}?${qs}` : API_URL
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Erro ao carregar dashboard financeiro. Status: ${response.status}`)
  }
  return response.json()
}
