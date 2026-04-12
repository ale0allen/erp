import type { Auditoria } from '../../types/audit.types'

export type Cliente = {
  id: number
  nome: string
  documento: string | null
  email: string | null
  telefone: string | null
  nomeContato: string | null
  ativo: boolean
  observacoes: string | null
  auditoria?: Auditoria | null
}

export type ClientePayload = {
  nome: string
  documento: string | null
  email: string | null
  telefone: string | null
  nomeContato: string | null
  ativo: boolean
  observacoes: string | null
}

