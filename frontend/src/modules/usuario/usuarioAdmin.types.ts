import type { Auditoria } from '../../types/audit.types'

/** Alinhado a `PageResponse` no backend (listas paginadas). */
export type PageResponse<T> = {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

/** Opção vinda de GET /perfis */
export type PerfilOption = {
  id: number
  nome: string
}

export type UsuarioAdmin = {
  id: number
  nome: string
  email: string
  username: string | null
  ativo: boolean
  perfis: string[]
  auditoria?: Auditoria | null
}

export type UsuarioCreatePayload = {
  nome: string
  email: string
  username: string | null
  password: string
  perfis: string[]
  ativo: boolean
}

export type UsuarioUpdatePayload = {
  nome: string
  email: string
  username: string | null
  ativo: boolean
  perfis: string[]
  /** omitido ou null para não alterar */
  password: string | null
}
