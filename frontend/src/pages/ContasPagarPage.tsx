import { useCallback, useEffect, useMemo, useState } from 'react'

import { fetchFornecedores } from '../modules/fornecedor/fornecedorService'
import type { Fornecedor } from '../modules/fornecedor/fornecedor.types'
import type {
  ContaPagarListItem,
  StatusContaPagar
} from '../modules/financeiro/contasPagar.types'
import {
  atualizarContaPagar,
  cancelarContaPagar,
  criarContaPagar,
  fetchContasPagar,
  pagarContaPagar
} from '../modules/financeiro/contasPagarService'
import '../styles/contas-pagar.css'
import { getStatusMessageClass } from '../utils/statusMessage'

type FiltroStatus = '' | StatusContaPagar

function badgeClass(status: StatusContaPagar): string {
  if (status === 'PENDING') return 'payable-badge payable-badge--pending'
  if (status === 'PAID') return 'payable-badge payable-badge--paid'
  if (status === 'OVERDUE') return 'payable-badge payable-badge--overdue'
  return 'payable-badge payable-badge--cancelled'
}

function labelStatus(status: StatusContaPagar): string {
  if (status === 'PENDING') return 'Pendente'
  if (status === 'PAID') return 'Pago'
  if (status === 'OVERDUE') return 'Vencido'
  return 'Cancelado'
}

function todayIso(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function ContasPagarPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [contas, setContas] = useState<ContaPagarListItem[]>([])

  const [fFornecedorId, setFFornecedorId] = useState('')
  const [fStatus, setFStatus] = useState<FiltroStatus>('')
  const [fIni, setFIni] = useState('')
  const [fFim, setFFim] = useState('')
  const [fDescricao, setFDescricao] = useState('')

  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [descricao, setDescricao] = useState('')
  const [fornecedorId, setFornecedorId] = useState('')
  const [dataVencimento, setDataVencimento] = useState(todayIso())
  const [valor, setValor] = useState('')
  const [observacoes, setObservacoes] = useState('')

  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(true)

  const carregarFornecedores = useCallback(async () => {
    try {
      const data = await fetchFornecedores()
      setFornecedores(data)
    } catch (e) {
      console.error(e)
      setMensagem(`Erro ao buscar fornecedores: ${String(e)}`)
    }
  }, [])

  const carregarContas = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) {
      setCarregando(true)
    }
    try {
      const filtros: Parameters<typeof fetchContasPagar>[0] = {}
      if (fFornecedorId !== '') filtros.fornecedorId = Number(fFornecedorId)
      if (fStatus !== '') filtros.status = fStatus
      if (fIni) filtros.startDueDate = fIni
      if (fFim) filtros.endDueDate = fFim
      if (fDescricao.trim()) filtros.description = fDescricao.trim()

      const data = await fetchContasPagar(filtros)
      setContas(data)
    } catch (e) {
      console.error(e)
      setMensagem(`Erro ao buscar contas a pagar: ${String(e)}`)
      setContas([])
    } finally {
      if (!opts?.silent) {
        setCarregando(false)
      }
    }
  }, [fDescricao, fFim, fFornecedorId, fIni, fStatus])

  useEffect(() => {
    void (async () => {
      await carregarFornecedores()
      await carregarContas()
    })()
  }, [carregarContas, carregarFornecedores])

  const limparFormulario = () => {
    setEditandoId(null)
    setDescricao('')
    setFornecedorId('')
    setDataVencimento(todayIso())
    setValor('')
    setObservacoes('')
  }

  const iniciarEdicao = (c: ContaPagarListItem) => {
    setEditandoId(c.id)
    setDescricao(c.descricao ?? '')
    setFornecedorId(c.fornecedorId != null ? String(c.fornecedorId) : '')
    setDataVencimento(c.dataVencimento)
    setValor(String(c.valor ?? ''))
    setObservacoes('')
    setMensagem('')
  }

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!descricao.trim()) {
      setMensagem('Descrição é obrigatória.')
      return
    }
    if (!dataVencimento) {
      setMensagem('Data de vencimento é obrigatória.')
      return
    }
    const v = Number(valor)
    if (!Number.isFinite(v) || v <= 0) {
      setMensagem('Valor deve ser maior que 0.')
      return
    }

    try {
      setMensagem(editandoId != null ? 'Atualizando conta...' : 'Salvando conta...')

      const payload = {
        descricao: descricao.trim(),
        fornecedorId: fornecedorId === '' ? null : Number(fornecedorId),
        dataVencimento,
        valor: v,
        observacoes: observacoes.trim() ? observacoes.trim() : null
      }

      if (editandoId == null) {
        await criarContaPagar(payload)
        setMensagem('Conta a pagar salva com sucesso.')
      } else {
        await atualizarContaPagar(editandoId, payload)
        setMensagem('Conta a pagar atualizada com sucesso.')
      }

      limparFormulario()
      await carregarContas({ silent: true })
    } catch (err) {
      console.error(err)
      setMensagem(`Erro ao salvar conta a pagar: ${String(err)}`)
    }
  }

  const pagar = async (id: number) => {
    const ok = window.confirm('Marcar esta conta como paga?')
    if (!ok) return
    try {
      setMensagem('Marcando como paga...')
      await pagarContaPagar(id)
      await carregarContas({ silent: true })
      setMensagem('Conta marcada como paga com sucesso.')
    } catch (e) {
      console.error(e)
      setMensagem(`Erro ao pagar conta: ${String(e)}`)
    }
  }

  const cancelar = async (id: number) => {
    const ok = window.confirm('Cancelar esta conta a pagar?')
    if (!ok) return
    try {
      setMensagem('Cancelando conta...')
      await cancelarContaPagar(id)
      await carregarContas({ silent: true })
      setMensagem('Conta cancelada com sucesso.')
    } catch (e) {
      console.error(e)
      setMensagem(`Erro ao cancelar conta: ${String(e)}`)
    }
  }

  const limparFiltros = () => {
    setFFornecedorId('')
    setFStatus('')
    setFIni('')
    setFFim('')
    setFDescricao('')
  }

  const resumo = useMemo(() => {
    let pend = 0
    let pago = 0
    let venc = 0
    let canc = 0
    for (const c of contas) {
      if (c.status === 'PENDING') pend++
      else if (c.status === 'PAID') pago++
      else if (c.status === 'OVERDUE') venc++
      else canc++
    }
    return { total: contas.length, pend, pago, venc, canc }
  }, [contas])

  return (
    <div className="erp-page">
      <div className="erp-page__container">
        <h2 className="erp-page__title">Contas a pagar</h2>
        <p className="contas-pagar__lead">
          Cadastre e acompanhe obrigações financeiras (manual). Vencido é calculado automaticamente a partir do vencimento.
        </p>

        {mensagem && (
          <p className={getStatusMessageClass(mensagem)} role="status">
            {mensagem}
          </p>
        )}

        <section className="card" aria-labelledby="cp-filtros">
          <h3 id="cp-filtros" className="card__title">Filtros</h3>
          <form
            className="contas-pagar__filters"
            onSubmit={e => {
              e.preventDefault()
              void carregarContas()
            }}
          >
            <div className="form-field">
              <label className="form-label" htmlFor="cp-f-fornecedor">Fornecedor</label>
              <select
                id="cp-f-fornecedor"
                className="form-input"
                value={fFornecedorId}
                onChange={e => setFFornecedorId(e.target.value)}
              >
                <option value="">Todos</option>
                {fornecedores.map(f => (
                  <option key={f.id} value={String(f.id)}>{f.nome}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="cp-f-status">Status</label>
              <select
                id="cp-f-status"
                className="form-input"
                value={fStatus}
                onChange={e => setFStatus(e.target.value as FiltroStatus)}
              >
                <option value="">Todos</option>
                <option value="PENDING">Pendente</option>
                <option value="OVERDUE">Vencido</option>
                <option value="PAID">Pago</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="cp-f-ini">Venc. (de)</label>
              <input
                id="cp-f-ini"
                className="form-input"
                type="date"
                value={fIni}
                onChange={e => setFIni(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="cp-f-fim">Venc. (até)</label>
              <input
                id="cp-f-fim"
                className="form-input"
                type="date"
                value={fFim}
                onChange={e => setFFim(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="cp-f-desc">Descrição</label>
              <input
                id="cp-f-desc"
                className="form-input"
                value={fDescricao}
                onChange={e => setFDescricao(e.target.value)}
                placeholder="Contém..."
              />
            </div>
            <div className="contas-pagar__filters-actions">
              <button type="submit" className="btn btn--primary">Buscar</button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => {
                  limparFiltros()
                  void carregarContas()
                }}
              >
                Limpar filtros
              </button>
            </div>
          </form>
        </section>

        <section className="card" aria-labelledby="cp-form">
          <h3 id="cp-form" className="card__title">
            {editandoId != null ? `Editar conta #${editandoId}` : 'Nova conta a pagar'}
          </h3>
          <form className="produto-form" onSubmit={salvar}>
            <div className="form-field">
              <label className="form-label" htmlFor="cp-descricao">Descrição</label>
              <input
                id="cp-descricao"
                className="form-input"
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="cp-fornecedor">Fornecedor (opcional)</label>
              <select
                id="cp-fornecedor"
                className="form-input"
                value={fornecedorId}
                onChange={e => setFornecedorId(e.target.value)}
              >
                <option value="">Sem fornecedor</option>
                {fornecedores.map(f => (
                  <option key={f.id} value={String(f.id)}>{f.nome}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="cp-venc">Vencimento</label>
              <input
                id="cp-venc"
                className="form-input"
                type="date"
                value={dataVencimento}
                onChange={e => setDataVencimento(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="cp-valor">Valor</label>
              <input
                id="cp-valor"
                className="form-input"
                type="number"
                min={0.01}
                step="0.01"
                value={valor}
                onChange={e => setValor(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="cp-obs">Observações</label>
              <textarea
                id="cp-obs"
                className="form-input"
                value={observacoes}
                onChange={e => setObservacoes(e.target.value)}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn--primary">
                {editandoId != null ? 'Atualizar' : 'Salvar'}
              </button>
              <button type="button" className="btn btn--secondary" onClick={limparFormulario}>
                Novo
              </button>
            </div>
          </form>
        </section>

        <section className="card" aria-labelledby="cp-lista">
          <h3 id="cp-lista" className="card__title">
            Lista ({resumo.total}) — Pendentes: {resumo.pend} | Vencidas: {resumo.venc} | Pagas: {resumo.pago} | Canceladas: {resumo.canc}
          </h3>

          {carregando && (
            <p className="status-message status-message--loading" role="status">
              Carregando...
            </p>
          )}

          {!carregando && contas.length === 0 && (
            <p className="table-empty">Nenhuma conta encontrada.</p>
          )}

          {!carregando && contas.length > 0 && (
            <div className="table-wrap">
              <table className="data-table" style={{ minWidth: 980 }}>
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Descrição</th>
                    <th scope="col">Fornecedor</th>
                    <th scope="col">Vencimento</th>
                    <th scope="col" className="data-table__num">Valor</th>
                    <th scope="col">Status</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {contas.map(c => (
                    <tr key={c.id} style={c.status === 'CANCELLED' ? { opacity: 0.7 } : undefined}>
                      <td>{c.id}</td>
                      <td>{c.descricao ?? '—'}</td>
                      <td>{c.fornecedorNome ?? '—'}</td>
                      <td>{c.dataVencimento ? new Date(c.dataVencimento).toLocaleDateString('pt-BR') : '—'}</td>
                      <td className="data-table__num">{Number(c.valor ?? 0).toFixed(2)}</td>
                      <td>
                        <span className={badgeClass(c.status)}>{labelStatus(c.status)}</span>
                      </td>
                      <td className="data-table__actions">
                        <div className="table-actions">
                          <button
                            type="button"
                            className="btn btn--secondary btn--small"
                            onClick={() => iniciarEdicao(c)}
                            disabled={c.status !== 'PENDING' && c.status !== 'OVERDUE'}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn--secondary btn--small"
                            onClick={() => void pagar(c.id)}
                            disabled={c.status !== 'PENDING' && c.status !== 'OVERDUE'}
                          >
                            Pagar
                          </button>
                          <button
                            type="button"
                            className="btn btn--danger btn--small"
                            onClick={() => void cancelar(c.id)}
                            disabled={c.status !== 'PENDING' && c.status !== 'OVERDUE'}
                          >
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

