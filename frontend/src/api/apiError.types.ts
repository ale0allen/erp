/**
 * Corpo de erro padronizado da API (`ApiErrorResponse` no backend).
 * Campos opcionais para compatibilidade com respostas antigas só com `message`.
 */
export type ApiErrorResponseBody = {
  timestamp?: string
  status: number
  error?: string
  message: string
  path?: string
  fieldErrors?: Record<string, string>
}
