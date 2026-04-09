import { useCallback, useEffect, useMemo, useState } from 'react'

import { fetchClientes } from '../modules/cliente/clienteService'
import type { Cliente } from '../modules/cliente/cliente.types'
import type {
  ContaReceberListItem,
  StatusContaReceber
} from '../modules/financeiro/contasReceber.types'
import {
  atualizarContaReceber,
  cancelarContaReceber,
  criarContaReceber,
  fetchContasReceber,
  receberContaReceber
} from '../modules/financeiro/contasReceberService'
import '../styles/contas-receber.css'
import { getStatusMessageClass } from '../utils/statusMessage'

type FiltroStatus = '' | StatusContaReceber

function badgeClass(status: StatusContaReceber): string {
  if (status === 'PENDING') return 'receivable-badge receivable-badge--pending'
  if (status === 'RECEIVED') return 'receivable-badge receivable-badge--received'
  if (status === 'OVERDUE') return 'receivable-badge receivable-badge--overdue'
  return 'receivable-badge receivable-badge--cancelled'
}

function labelStatus(status: StatusContaReceber): string {
  if (status === 'PENDING') return 'Pendente'
  if (status === 'RECEIVED') return 'Recebido'
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

export function ContasReceberPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [contas, setContas] = useState<ContaReceberListItem[]>([])

  const [fClienteId, setFClienteId] = useState('')
  const [fStatus, setFStatus] = useState<FiltroStatus>('')
  const [fIni, setFIni] = useState('')
  const [fFim, setFFim] = useState('')
  const [fDescricao, setFDescricao] = useState('')

  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [descricao, setDescricao] = useState('')
  const [clienteId, setClienteId] = useState('')
  const [dataVencimento, setDataVencimento] = useState(todayIso())
  const [valor, setValor] = useState('')
  const [observacoes, setObservacoes] = useState('')

  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(true)

  const carregarClientes = useCallback(async () => {
    try {
      const data = await fetchClientes()
      setClientes(data)
    } catch (e) {
      console.error(e)
      setMensagem(`Erro ao buscar clientes: ${String(e)}`)
    }
  }, [])

  const carregarContas = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) {
      setCarregando(true)
    }
    try {
      const filtros: Parameters<typeof fetchContasReceber>[0] = {}
      if (fClienteId !== '') filtros.customerId = Number(fClienteId)
      if (fStatus !== '') filtros.status = fStatus
      if (fIni) filtros.startDueDate = fIni
      if (fFim) filtros.endDueDate = fFim
      if (fDescricao.trim()) filtros.description = fDescricao.trim()

      const data = await fetchContasReceber(filtros)
      setContas(data)
    } catch (e) {
      console.error(e)
      setMensagem(`Erro ao buscar contas a receber: ${String(e)}`)
      setContas([])
    } finally {
      if (!opts?.silent) {
        setCarregando(false)
      }
    }
  }, [fDescricao, fFim, fClienteId, fIni, fStatus])

  useEffect(() => {
    void (async () => {
      await carregarClientes()
      await carregarContas()
    })()
  }, [carregarContas, carregarClientes])

  const limparFormulario = () => {
    setEditandoId(null)
    setDescricao('')
    setClienteId('')
    setDataVencimento(todayIso())
    setValor('')
    setObservacoes('')
  }

  const iniciarEdicao = (c: ContaReceberListItem) => {
    setEditandoId(c.id)
    setDescricao(c.descricao ?? '')
    setClienteId(c.clienteId != null ? String(c.clienteId) : '')
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
        clienteId: clienteId === '' ? null : Number(clienteId),
        dataVencimento,
        valor: v,
        observacoes: observacoes.trim() ? observacoes.trim() : null
      }

      if (editandoId == null) {
        await criarContaReceber(payload)
        setMensagem('Conta a receber salva com sucesso.')
      } else {
        await atualizarContaReceber(editandoId, payload)
        setMensagem('Conta a receber atualizada com sucesso.')
      }

      limparFormulario()
      await carregarContas({ silent: true })
    } catch (err) {
      console.error(err)
      setMensagem(`Erro ao salvar conta a receber: ${String(err)}`)
    }
  }

  const receber = async (id: number) => {
    const ok = window.confirm('Marcar esta conta como recebida?')
    if (!ok) return
    try {
      setMensagem('Marcando como recebida...')
      await receberContaReceber(id)
      await carregarContas({ silent: true })
      setMensagem('Conta marcada como recebida com sucesso.')
    } catch (e) {
      console.error(e)
      setMensagem(`Erro ao marcar como recebida: ${String(e)}`)
    }
  }

  const cancelar = async (id: number) => {
    const ok = window.confirm('Cancelar esta conta a receber?')
    if (!ok) return
    try {
      setMensagem('Cancelando conta...')
      await cancelarContaReceber(id)
      await carregarContas({ silent: true })
      setMensagem('Conta cancelada com sucesso.')
    } catch (e) {
      console.error(e)
      setMensagem(`Erro ao cancelar conta: ${String(e)}`)
    }
  }

  const limparFiltros = () => {
    setFClienteId('')
    setFStatus('')
    setFIni('')
    setFFim('')
    setFDescricao('')
  }

  const resumo = useMemo(() => {
    let pend = 0
    let rec = 0
    let venc = 0
    let canc = 0
    for (const c of contas) {
      if (c.status === 'PENDING') pend++
      else if (c.status === 'RECEIVED') rec++
      else if (c.status === 'OVERDUE') venc++
      else canc++
    }
    return { total: contas.length, pend, rec, venc, canc }
  }, [contas])

  return (
    <div className="erp-page">
      <div className="erp-page__container">
        <h2 className="erp-page__title">Contas a receber</h2>
        <p className="contas-receber__lead">
          Cadastre e acompanhe valores a receber (manual). Vencido é calculado automaticamente a partir do vencimento.
        </p>

        {mensagem && (
          <p className={getStatusMessageClass(mensagem)} role="status">
            {mensagem}
          </p>
        )}

        <section className="card" aria-labelledby="cr-filtros">
          <h3 id="cr-filtros" className="card__title">Filtros</h3>
          <form
            className="contas-receber__filters"
            onSubmit={e => {
              e.preventDefault()
              void carregarContas()
            }}
          >
            <div className="form-field">
              <label className="form-label" htmlFor="cr-f-cliente">Cliente</label>
              <select
                id="cr-f-cliente"
                className="form-input"
                value={fClienteId}
                onChange={e => setFClienteId(e.target.value)}
              >
                <option value="">Todos</option>
                {clientes.map(cl => (
                  <option key={cl.id} value={String(cl.id)}>{cl.nome}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="cr-f-status">Status</label>
              <select
                id="cr-f-status"
                className="form-input"
                value={fStatus}
                onChange={e => setFStatus(e.target.value as FiltroStatus)}
              >
                <option value="">Todos</option>
                <option value="PENDING">Pendente</option>
                <option value="OVERDUE">Vencido</option>
                <option value="RECEIVED">Recebido</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="cr-f-ini">Venc. (de)</label>
              <input
                id="cr-f-ini"
                className="form-input"
                type="date"
                value={fIni}
                onChange={e => setFIni(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="cr-f-fim">Venc. (até)</label>
              <input
                id="cr-f-fim"
                className="form-input"
                type="date"
                value={fFim}
                onChange={e => setFFim(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="cr-f-desc">Descrição</label>
              <input
                id="cr-f-desc"
                className="form-input"
                value={fDescricao}
                onChange={e => setFDescricao(e.target.value)}
                placeholder="Contém..."
              />
            </div>
            <div className="contas-receber__filters-actions">
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

        <section className="card" aria-labelledby="cr-form">
          <h3 id="cr-form" className="card__title">
            {editandoId != null ? `Editar conta #${editandoId}` : 'Nova conta a receber'}
          </h3>
          <form className="produto-form" onSubmit={salvar}>
            <div className="form-field">
              <label className="form-label" htmlFor="cr-descricao">Descrição</label>
              <input
                id="cr-descricao"
                className="form-input"
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="cr-cliente">Cliente (opcional)</label>
              <select
                id="cr-cliente"
                className="form-input"
                value={clienteId}
                onChange={e => setClienteId(e.target.value)}
              >
                <option value="">Sem cliente</option>
                {clientes.map(cl => (
                  <option key={cl.id} value={String(cl.id)}>{cl.nome}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="cr-venc">Vencimento</label>
              <input
                id="cr-venc"
                className="form-input"
                type="date"
                value={dataVencimento}
                onChange={e => setDataVencimento(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="cr-valor">Valor</label>
              <input
                id="cr-valor"
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
              <label className="form-label" htmlFor="cr-obs">Observações</label>
              <textarea
                id="cr-obs"
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

        <section className="card" aria-labelledby="cr-lista">
          <h3 id="cr-lista" className="card__title">
            Lista ({resumo.total}) — Pendentes: {resumo.pend} | Vencidas: {resumo.venc} | Recebidas: {resumo.rec} | Canceladas: {resumo.canc}
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
                    <th scope="col">Cliente</th>
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
                      <td>{c.clienteNome ?? '—'}</td>
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
                            onClick={() => void receber(c.id)}
                            disabled={c.status !== 'PENDING' && c.status !== 'OVERDUE'}
                          >
                            Receber
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
