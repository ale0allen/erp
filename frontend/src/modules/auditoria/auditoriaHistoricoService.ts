import { apiFetch } from '../../api/http'

import type { AuditoriaHistoricoFiltros, PageHistoricoAuditoria } from './auditoriaHistorico.types'

const API_BASE = import.meta.env.VITE_API_URL

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json()
    if (data && typeof data === 'object' && 'message' in data) {
      const m = (data as { message?: unknown }).message
      if (typeof m === 'string' && m.length > 0) return m
    }
  } catch {
    /* ignore */
  }
  return `Erro HTTP ${response.status}`
}

function appendIfValue(
  params: URLSearchParams,
  key: string,
  value: string | number | null | undefined
): void {
  if (value === '' || value == null) return
  params.set(key, String(value))
}

/** Converte valor de `datetime-local` para ISO-8601 aceito pelo backend. */
function dataLocalParaIsoOuVazio(s: string): string | null {
  const t = s.trim()
  if (t === '') return null
  const d = new Date(t)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

/**
 * `inicio` / `fim`: strings ISO (datetime-local → to ISO) ou vazias.
 */
export async function fetchHistoricoAuditoria(
  filtros: AuditoriaHistoricoFiltros,
  page: number,
  pageSize = 50
): Promise<PageHistoricoAuditoria> {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('size', String(pageSize))
  params.set('sort', 'realizadoEm,desc')

  appendIfValue(params, 'usuarioId', filtros.usuarioId === '' ? null : filtros.usuarioId)
  appendIfValue(params, 'modulo', filtros.modulo.trim() || null)
  appendIfValue(params, 'acao', filtros.acao.trim() || null)
  const inicioIso = dataLocalParaIsoOuVazio(filtros.inicio)
  const fimIso = dataLocalParaIsoOuVazio(filtros.fim)
  appendIfValue(params, 'inicio', inicioIso)
  appendIfValue(params, 'fim', fimIso)

  const response = await apiFetch(`${API_BASE}/auditoria-historico?${params.toString()}`)
  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }
  return response.json()
}
