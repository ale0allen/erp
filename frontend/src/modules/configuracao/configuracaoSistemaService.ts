import { apiFetch, ensureOk } from '../../api/http'

import type { ConfiguracaoSistema, ConfiguracaoSistemaPayload } from './configuracaoSistema.types'

const API_BASE = import.meta.env.VITE_API_URL

/**
 * Obtém configurações. Se ainda não existir registro (404), tenta `POST .../inicializar`.
 */
export async function fetchConfiguracaoSistema(): Promise<ConfiguracaoSistema> {
  const res = await apiFetch(`${API_BASE}/configuracao-sistema`)
  if (res.status === 404) {
    const created = await apiFetch(`${API_BASE}/configuracao-sistema/inicializar`, {
      method: 'POST'
    })
    if (created.status === 409) {
      const retry = await apiFetch(`${API_BASE}/configuracao-sistema`)
      await ensureOk(retry)
      return retry.json() as Promise<ConfiguracaoSistema>
    }
    await ensureOk(created)
    return created.json() as Promise<ConfiguracaoSistema>
  }
  await ensureOk(res)
  return res.json() as Promise<ConfiguracaoSistema>
}

export async function atualizarConfiguracaoSistema(
  payload: ConfiguracaoSistemaPayload
): Promise<ConfiguracaoSistema> {
  const response = await apiFetch(`${API_BASE}/configuracao-sistema`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  await ensureOk(response)
  return response.json() as Promise<ConfiguracaoSistema>
}
