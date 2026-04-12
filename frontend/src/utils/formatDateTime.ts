/** Exibe instante ISO em pt-BR; retorna em dash se vazio. */
export function formatarDataHora(iso: string | null | undefined): string {
  if (iso == null || iso === '') return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  })
}
