/** Alinhado a `AuditoriaResponse` no backend (Instant serializado como ISO-8601). */
export type Auditoria = {
  criadoEm: string | null
  atualizadoEm: string | null
  criadoPorId: number | null
  atualizadoPorId: number | null
  criadoPorNome: string | null
  atualizadoPorNome: string | null
}
