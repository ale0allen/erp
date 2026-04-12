/** Alinhado a `HistoricoAuditoriaResponse` no backend. */
export type HistoricoAuditoriaItem = {
  id: number
  action: string
  module: string
  entityId: number | null
  description: string | null
  performedByUserId: number | null
  performedByUserName: string | null
  performedAt: string
}

export type AuditoriaHistoricoFiltros = {
  usuarioId: number | ''
  modulo: string
  acao: string
  inicio: string
  fim: string
}

/** Resposta paginada Spring (`Page`). */
export type PageHistoricoAuditoria = {
  content: HistoricoAuditoriaItem[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

export const AUDITORIA_MODULO_OPTIONS = [
  { value: '', label: 'Todos os módulos' },
  { value: 'USER', label: 'Usuários' },
  { value: 'SETTINGS', label: 'Configurações' },
  { value: 'PURCHASE', label: 'Compras' },
  { value: 'SALE', label: 'Vendas' }
] as const

export const AUDITORIA_ACAO_OPTIONS = [
  { value: '', label: 'Todas as ações' },
  { value: 'USER_CREATED', label: 'Usuário criado' },
  { value: 'USER_UPDATED', label: 'Usuário atualizado' },
  { value: 'USER_INACTIVATED', label: 'Usuário inativado' },
  { value: 'USER_ROLE_CHANGED', label: 'Perfis alterados' },
  { value: 'SETTINGS_UPDATED', label: 'Configurações atualizadas' },
  { value: 'PURCHASE_COMPLETED', label: 'Compra finalizada' },
  { value: 'SALE_COMPLETED', label: 'Venda finalizada' }
] as const
