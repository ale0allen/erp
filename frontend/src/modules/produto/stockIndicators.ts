import type { StatusEstoque } from './produto.types'

export function calcularStatusEstoque(
  saldoEstoque: number,
  estoqueMinimo: number
): StatusEstoque {
  const saldo = Number.isFinite(saldoEstoque) ? saldoEstoque : 0
  const minimo = Number.isFinite(estoqueMinimo) ? estoqueMinimo : 0

  if (saldo <= 0) {
    return 'OUT_OF_STOCK'
  }
  if (saldo <= minimo) {
    return 'LOW_STOCK'
  }
  return 'NORMAL'
}

export function statusBadgeClass(status: StatusEstoque): string {
  if (status === 'OUT_OF_STOCK') {
    return 'status-badge status-badge--out'
  }
  if (status === 'LOW_STOCK') {
    return 'status-badge status-badge--low'
  }
  return 'status-badge status-badge--normal'
}

export function statusLabel(status: StatusEstoque): string {
  if (status === 'OUT_OF_STOCK') {
    return 'Sem estoque'
  }
  if (status === 'LOW_STOCK') {
    return 'Baixo'
  }
  return 'Normal'
}

export function statusTitleAttr(
  status: StatusEstoque,
  saldoEstoque: number,
  estoqueMinimo: number
): string {
  const saldo = Number.isFinite(saldoEstoque) ? saldoEstoque : 0
  const minimo = Number.isFinite(estoqueMinimo) ? estoqueMinimo : 0

  if (status === 'OUT_OF_STOCK') {
    return 'Estoque zerado (saldo ≤ 0)'
  }
  if (status === 'LOW_STOCK') {
    return `Abaixo/igual ao mínimo (saldo ${saldo} ≤ mínimo ${minimo})`
  }
  return `Acima do mínimo (saldo ${saldo} > mínimo ${minimo})`
}
