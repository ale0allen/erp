import { getToken } from '../auth/auth'

export {
  ApiRequestError,
  ensureOk,
  getErrorMessage,
  parseApiErrorBody
} from './errorHandling'
export type { ParsedApiError } from './errorHandling'

/**
 * fetch com Authorization Bearer quando existe token no localStorage.
 * Para erros HTTP, prefira {@link ensureOk} após receber a resposta.
 */
export function apiFetch(input: string | URL, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers ?? undefined)
  const token = getToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  return fetch(input, { ...init, headers })
}
