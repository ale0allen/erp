import type { Auditoria } from '../../types/audit.types'

export type Categoria = {
  id: number
  nome: string
  ativo: boolean
  auditoria?: Auditoria | null
}

export type CategoriaPayload = {
  nome: string
  ativo: boolean
}
