import type { Auditoria } from '../types/audit.types'
import { formatarDataHora } from '../utils/formatDateTime'

import './AuditoriaMeta.css'

type AuditoriaMetaProps = {
  auditoria: Auditoria | null | undefined
  /** Título curto da seção (ex.: "Auditoria da compra") */
  titulo?: string
}

export function AuditoriaMeta({ auditoria, titulo = 'Auditoria' }: AuditoriaMetaProps) {
  if (auditoria == null) {
    return null
  }

  const criadoPor = auditoria.criadoPorNome?.trim() || (auditoria.criadoPorId != null ? `Usuário #${auditoria.criadoPorId}` : '—')
  const atualizadoPor =
    auditoria.atualizadoPorNome?.trim() ||
    (auditoria.atualizadoPorId != null ? `Usuário #${auditoria.atualizadoPorId}` : '—')

  return (
    <div className="auditoria-meta" aria-label={titulo}>
      <p className="auditoria-meta__title">{titulo}</p>
      <div className="auditoria-meta__grid">
        <div className="auditoria-meta__pair">
          <span className="auditoria-meta__dt">Criado em</span>
          <span className="auditoria-meta__dd">{formatarDataHora(auditoria.criadoEm)}</span>
        </div>
        <div className="auditoria-meta__pair">
          <span className="auditoria-meta__dt">Criado por</span>
          <span className="auditoria-meta__dd">{criadoPor}</span>
        </div>
        <div className="auditoria-meta__pair">
          <span className="auditoria-meta__dt">Atualizado em</span>
          <span className="auditoria-meta__dd">{formatarDataHora(auditoria.atualizadoEm)}</span>
        </div>
        <div className="auditoria-meta__pair">
          <span className="auditoria-meta__dt">Atualizado por</span>
          <span className="auditoria-meta__dd">{atualizadoPor}</span>
        </div>
      </div>
    </div>
  )
}
