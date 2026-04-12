import { clearAuthStorage } from '../auth/auth'

import type { ApiErrorResponseBody } from './apiError.types'

export type ParsedApiError = {
  message: string
  error?: string
  fieldErrors?: Record<string, string>
}

export class ApiRequestError extends Error {
  readonly status: number
  readonly code?: string
  readonly fieldErrors?: Record<string, string>

  constructor(
    message: string,
    status: number,
    code?: string,
    fieldErrors?: Record<string, string>
  ) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.code = code
    this.fieldErrors = fieldErrors
  }
}

function defaultMessage(status: number): string {
  if (status === 401) return 'Não autenticado.'
  if (status === 403) return 'Acesso negado.'
  if (status === 404) return 'Recurso não encontrado.'
  if (status >= 500) return 'Erro no servidor. Tente novamente mais tarde.'
  return `Erro HTTP ${status}`
}

/** Interpreta JSON de erro (formato novo ou legado `{ message: string }`). */
export async function parseApiErrorBody(response: Response): Promise<ParsedApiError> {
  try {
    const clone = response.clone()
    const data: unknown = await clone.json()
    if (data && typeof data === 'object') {
      const o = data as Partial<ApiErrorResponseBody> & { message?: unknown; error?: unknown }
      const message =
        typeof o.message === 'string' && o.message.trim() ? o.message.trim() : ''
      const error = typeof o.error === 'string' ? o.error : undefined
      const fe = o.fieldErrors
      let fieldErrors: Record<string, string> | undefined
      if (fe && typeof fe === 'object' && !Array.isArray(fe)) {
        fieldErrors = fe as Record<string, string>
      }
      return {
        message: message || defaultMessage(response.status),
        error,
        fieldErrors
      }
    }
  } catch {
    /* ignore */
  }
  return { message: defaultMessage(response.status) }
}

/** Mensagem segura para exibir ao usuário a partir de um erro de API ou desconhecido. */
export function getErrorMessage(err: unknown): string {
  if (err instanceof ApiRequestError) {
    return err.message
  }
  if (err instanceof Error) {
    return err.message
  }
  return String(err)
}

/**
 * Garante que a resposta foi bem-sucedida; caso contrário lança {@link ApiRequestError}
 * com mensagem amigável. Em 401, limpa o token e redireciona para `/login` (exceto se já estiver no login).
 */
export async function ensureOk(response: Response): Promise<Response> {
  if (response.ok) {
    return response
  }

  const parsed = await parseApiErrorBody(response)
  const msg = parsed.message

  if (response.status === 401) {
    clearAuthStorage()
    const path = window.location.pathname
    if (!path.startsWith('/login')) {
      window.location.assign('/login')
    }
    throw new ApiRequestError(
      msg || 'Sessão expirada ou não autenticado. Faça login novamente.',
      401,
      parsed.error
    )
  }

  if (response.status === 403) {
    throw new ApiRequestError(
      msg || 'Você não tem permissão para esta operação.',
      403,
      parsed.error
    )
  }

  if (response.status === 400) {
    throw new ApiRequestError(msg || 'Requisição inválida.', 400, parsed.error, parsed.fieldErrors)
  }

  if (response.status === 404) {
    throw new ApiRequestError(msg || 'Recurso não encontrado.', 404, parsed.error)
  }

  if (response.status >= 500) {
    throw new ApiRequestError(
      msg || 'Erro no servidor. Tente novamente mais tarde.',
      response.status,
      parsed.error
    )
  }

  throw new ApiRequestError(msg || `Erro HTTP ${response.status}`, response.status, parsed.error, parsed.fieldErrors)
}
