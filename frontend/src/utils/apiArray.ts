/**
 * Normaliza JSON de API para array: aceita lista direta ou objeto paginado com `content`.
 * Registra estrutura inesperada no console (não oculta dados incorretos).
 */
export function asArrayFromApi<T>(data: unknown, context: string): T[] {
  if (Array.isArray(data)) {
    return data
  }
  if (
    data != null &&
    typeof data === 'object' &&
    'content' in data &&
    Array.isArray((data as { content: unknown }).content)
  ) {
    return (data as { content: T[] }).content
  }
  console.error(`[${context}] Expected array or { content: [] }, got:`, data)
  return []
}

/** Garante que o valor é `string[]` para exibição ou uso seguro com `.map`. */
export function asStringArray(value: unknown, context: string): string[] {
  if (Array.isArray(value) && value.every(v => typeof v === 'string')) {
    return value
  }
  console.error(`[${context}] Expected string[], got:`, value)
  return []
}

/** Normaliza resposta paginada estilo Spring (`content`, `page` ou `number`, …). */
export function parseSpringPage<T>(data: unknown, context: string): {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
} {
  const empty = {
    content: [] as T[],
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
    last: true
  }
  if (!data || typeof data !== 'object') {
    console.error(`[${context}] Invalid page response:`, data)
    return empty
  }
  const o = data as Record<string, unknown>
  const content = Array.isArray(o.content)
    ? (o.content as T[])
    : (console.error(`[${context}] page.content is not an array:`, o.content), [] as T[])
  const page =
    typeof o.page === 'number'
      ? o.page
      : typeof o.number === 'number'
        ? o.number
        : 0
  const size = typeof o.size === 'number' ? o.size : 20
  const totalElements = typeof o.totalElements === 'number' ? o.totalElements : 0
  const totalPages = typeof o.totalPages === 'number' ? o.totalPages : 0
  const last = typeof o.last === 'boolean' ? o.last : totalPages <= 1
  return { content, page, size, totalElements, totalPages, last }
}
