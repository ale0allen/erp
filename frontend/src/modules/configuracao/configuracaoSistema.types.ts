import type { Auditoria } from '../../types/audit.types'

/** Alinhado a `ConfiguracaoSistemaResponse` no backend. */
export type ConfiguracaoSistema = {
  companyName: string
  tradeName: string | null
  companyEmail: string | null
  companyPhone: string | null
  currencyCode: string
  timezone: string
  defaultPageSize: number
  lowStockDefaultThreshold: number
  additionalInfo: string | null
  auditoria?: Auditoria | null
}

export type ConfiguracaoSistemaPayload = {
  companyName: string
  tradeName: string | null
  companyEmail: string | null
  companyPhone: string | null
  currencyCode: string
  timezone: string
  defaultPageSize: number
  lowStockDefaultThreshold: number
  additionalInfo: string | null
}
