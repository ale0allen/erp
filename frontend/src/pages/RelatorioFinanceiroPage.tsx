import { useCallback, useEffect, useState } from 'react'

import { fetchClientes } from '../modules/cliente/clienteService'
import type { Cliente } from '../modules/cliente/cliente.types'
import { fetchFornecedores } from '../modules/fornecedor/fornecedorService'
import type { Fornecedor } from '../modules/fornecedor/fornecedor.types'
import type { StatusContaPagar } from '../modules/financeiro/contasPagar.types'
import type { StatusContaReceber } from '../modules/financeiro/contasReceber.types'
import {
  fetchRelatorioContasPagar,
  fetchRelatorioContasReceber
} from '../modules/financeiro/relatorioFinanceiroService'
import type {
  ContaPagarRelatorioRow,
  ContaReceberRelatorioRow,
  RelatorioContasPagarResponse,
  RelatorioContasReceberResponse,
  TipoRelatorioFinanceiro
} from '../modules/financeiro/relatorioFinanceiro.types'
import '../styles/relatorio-financeiro.css'
import { getStatusMessageClass } from '../utils/statusMessage'

const fmtBrl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2
})

function formatCurrency(n: number | null | undefined): string {
  const v = Number(n)
  if (!Number.isFinite(v)) return fmtBrl.format(0)
  return fmtBrl.format(v)
}

function badgeClassPagar(status: StatusContaPagar): string {
  if (status === 'PENDING') return 'fin-rep-badge fin-rep-badge--pending'
  if (status === 'PAID') return 'fin-rep-badge fin-rep-badge--paid'
  if (status === 'OVERDUE') return 'fin-rep-badge fin-rep-badge--overdue'
  return 'fin-rep-badge fin-rep-badge--cancelled'
}

function badgeClassReceber(status: StatusContaReceber): string {
  if (status === 'PENDING') return 'fin-rep-badge fin-rep-badge--pending'
  if (status === 'RECEIVED') return 'fin-rep-badge fin-rep-badge--received'
  if (status === 'OVERDUE') return 'fin-rep-badge fin-rep-badge--overdue'
  return 'fin-rep-badge fin-rep-badge--cancelled'
}

function labelPagar(status: StatusContaPagar): string {
  if (status === 'PENDING') return 'Pendente'
  if (status === 'PAID') return 'Pago'
  if (status === 'OVERDUE') return 'Vencido'
  return 'Cancelado'
}

function labelReceber(status: StatusContaReceber): string {
  if (status === 'PENDING') return 'Pendente'
  if (status === 'RECEIVED') return 'Recebido'
  if (status === 'OVERDUE') return 'Vencido'
  return 'Cancelado'
}

export function RelatorioFinanceiroPage() {
  const [tipo, setTipo] = useState<TipoRelatorioFinanceiro>('pagar')
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])

  const [fSupplier, setFSupplier] = useState('')
  const [fCustomer, setFCustomer] = useState('')
  const [fStatus, setFStatus] = useState('')
  const [fIni, setFIni] = useState('')
  const [fFim, setFFim] = useState('')
  const [fDesc, setFDesc] = useState('')

  const [pagarRes, setPagarRes] = useState<RelatorioContasPagarResponse | null>(null)
  const [receberRes, setReceberRes] = useState<RelatorioContasReceberResponse | null>(null)

  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(true)

  const carregar = useCallback(async () => {
    setCarregando(true)
    setMensagem('')
    try {
      if (tipo === 'pagar') {
        const res = await fetchRelatorioContasPagar({
          supplierId: fSupplier === '' ? undefined : Number(fSupplier),
          status: (fStatus || undefined) as StatusContaPagar | undefined,
          startDueDate: fIni || undefined,
          endDueDate: fFim || undefined,
          description: fDesc.trim() || undefined
        })
        setPagarRes(res)
        setReceberRes(null)
      } else {
        const res = await fetchRelatorioContasReceber({
          customerId: fCustomer === '' ? undefined : Number(fCustomer),
          status: (fStatus || undefined) as StatusContaReceber | undefined,
          startDueDate: fIni || undefined,
          endDueDate: fFim || undefined,
          description: fDesc.trim() || undefined
        })
        setReceberRes(res)
        setPagarRes(null)
      }
    } catch (e) {
      console.error(e)
      setMensagem(`Erro ao carregar relatório: ${String(e)}`)
      setPagarRes(null)
      setReceberRes(null)
    } finally {
      setCarregando(false)
    }
  }, [tipo, fSupplier, fCustomer, fStatus, fIni, fFim, fDesc])

  useEffect(() => {
    void (async () => {
      try {
        const [fs, cs] = await Promise.all([fetchFornecedores(), fetchClientes()])
        setFornecedores(fs)
        setClientes(cs)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  useEffect(() => {
    setFSupplier('')
    setFCustomer('')
    setFStatus('')
    setFIni('')
    setFFim('')
    setFDesc('')
    void (async () => {
      setCarregando(true)
      setMensagem('')
      try {
        if (tipo === 'pagar') {
          const res = await fetchRelatorioContasPagar({})
          setPagarRes(res)
          setReceberRes(null)
        } else {
          const res = await fetchRelatorioContasReceber({})
          setReceberRes(res)
          setPagarRes(null)
        }
      } catch (e) {
        console.error(e)
        setMensagem(`Erro ao carregar relatório: ${String(e)}`)
        setPagarRes(null)
        setReceberRes(null)
      } finally {
        setCarregando(false)
      }
    })()
  }, [tipo])

  const aplicar = (e: React.FormEvent) => {
    e.preventDefault()
    void carregar()
  }

  const limpar = async () => {
    setFSupplier('')
    setFCustomer('')
    setFStatus('')
    setFIni('')
    setFFim('')
    setFDesc('')
    setCarregando(true)
    setMensagem('')
    try {
      if (tipo === 'pagar') {
        const res = await fetchRelatorioContasPagar({})
        setPagarRes(res)
        setReceberRes(null)
      } else {
        const res = await fetchRelatorioContasReceber({})
        setReceberRes(res)
        setPagarRes(null)
      }
    } catch (e) {
      console.error(e)
      setMensagem(`Erro ao carregar relatório: ${String(e)}`)
      setPagarRes(null)
      setReceberRes(null)
    } finally {
      setCarregando(false)
    }
  }

  const rowsPagar: ContaPagarRelatorioRow[] = pagarRes?.rows ?? []
  const rowsReceber: ContaReceberRelatorioRow[] = receberRes?.rows ?? []

  return (
    <div className="erp-page">
      <div className="erp-page__container">
        <h2 className="erp-page__title">Relatório financeiro</h2>
        <p className="relatorio-fin__lead">
          Consulta de contas a pagar e a receber com totais. Os status refletem a mesma regra do sistema
          (vencido = pendente com vencimento anterior a hoje).
        </p>

        {mensagem && (
          <p className={getStatusMessageClass(mensagem)} role="status">
            {mensagem}
          </p>
        )}

        <div className="relatorio-fin__toolbar">
          <div className="relatorio-fin__tipo">
            <span className="relatorio-fin__tipo-label">Relatório:</span>
            <label className="form-label" style={{ margin: 0 }}>
              <input
                type="radio"
                name="tipo-relatorio"
                checked={tipo === 'pagar'}
                onChange={() => setTipo('pagar')}
              />{' '}
              Contas a pagar
            </label>
            <label className="form-label" style={{ margin: 0 }}>
              <input
                type="radio"
                name="tipo-relatorio"
                checked={tipo === 'receber'}
                onChange={() => setTipo('receber')}
              />{' '}
              Contas a receber
            </label>
          </div>
        </div>

        <section className="card" aria-labelledby="rel-fin-filtros">
          <h3 id="rel-fin-filtros" className="card__title">
            Filtros
          </h3>
          <form className="relatorio-fin__filters" onSubmit={aplicar}>
            {tipo === 'pagar' && (
              <div className="form-field">
                <label className="form-label" htmlFor="rel-fin-forn">
                  Fornecedor
                </label>
                <select
                  id="rel-fin-forn"
                  className="form-input"
                  value={fSupplier}
                  onChange={e => setFSupplier(e.target.value)}
                >
                  <option value="">Todos</option>
                  {fornecedores.map(f => (
                    <option key={f.id} value={String(f.id)}>
                      {f.nome}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {tipo === 'receber' && (
              <div className="form-field">
                <label className="form-label" htmlFor="rel-fin-cli">
                  Cliente
                </label>
                <select
                  id="rel-fin-cli"
                  className="form-input"
                  value={fCustomer}
                  onChange={e => setFCustomer(e.target.value)}
                >
                  <option value="">Todos</option>
                  {clientes.map(c => (
                    <option key={c.id} value={String(c.id)}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="form-field">
              <label className="form-label" htmlFor="rel-fin-status">
                Status
              </label>
              <select
                id="rel-fin-status"
                className="form-input"
                value={fStatus}
                onChange={e => setFStatus(e.target.value)}
              >
                <option value="">Todos</option>
                {tipo === 'pagar' ? (
                  <>
                    <option value="PENDING">Pendente</option>
                    <option value="OVERDUE">Vencido</option>
                    <option value="PAID">Pago</option>
                    <option value="CANCELLED">Cancelado</option>
                  </>
                ) : (
                  <>
                    <option value="PENDING">Pendente</option>
                    <option value="OVERDUE">Vencido</option>
                    <option value="RECEIVED">Recebido</option>
                    <option value="CANCELLED">Cancelado</option>
                  </>
                )}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="rel-fin-ini">
                Venc. (de)
              </label>
              <input
                id="rel-fin-ini"
                className="form-input"
                type="date"
                value={fIni}
                onChange={e => setFIni(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="rel-fin-fim">
                Venc. (até)
              </label>
              <input
                id="rel-fin-fim"
                className="form-input"
                type="date"
                value={fFim}
                onChange={e => setFFim(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="rel-fin-desc">
                Descrição
              </label>
              <input
                id="rel-fin-desc"
                className="form-input"
                value={fDesc}
                onChange={e => setFDesc(e.target.value)}
                placeholder="Contém..."
              />
            </div>
            <div className="relatorio-fin__filters-actions">
              <button type="submit" className="btn btn--primary">
                Buscar
              </button>
              <button type="button" className="btn btn--secondary" onClick={limpar}>
                Limpar filtros
              </button>
            </div>
          </form>
        </section>

        {carregando && (
          <p className="status-message status-message--loading" role="status">
            Carregando...
          </p>
        )}

        {!carregando && tipo === 'pagar' && pagarRes && (
          <>
            <h3 className="relatorio-fin__section-title">Resumo</h3>
            <div className="relatorio-fin__summary">
              <div className="relatorio-fin__summary-card">
                <span className="relatorio-fin__summary-label">Total de registros</span>
                <p className="relatorio-fin__summary-value relatorio-fin__summary-value--muted">
                  {pagarRes.totals.totalCount}
                </p>
              </div>
              <div className="relatorio-fin__summary-card">
                <span className="relatorio-fin__summary-label">Valor total</span>
                <p className="relatorio-fin__summary-value">
                  {formatCurrency(pagarRes.totals.totalAmount)}
                </p>
              </div>
              <div className="relatorio-fin__summary-card">
                <span className="relatorio-fin__summary-label">Pendente</span>
                <p className="relatorio-fin__summary-value">
                  {formatCurrency(pagarRes.totals.totalPendingAmount)}
                </p>
              </div>
              <div className="relatorio-fin__summary-card">
                <span className="relatorio-fin__summary-label">Vencido</span>
                <p className="relatorio-fin__summary-value">
                  {formatCurrency(pagarRes.totals.totalOverdueAmount)}
                </p>
              </div>
              <div className="relatorio-fin__summary-card">
                <span className="relatorio-fin__summary-label">Pago</span>
                <p className="relatorio-fin__summary-value">
                  {formatCurrency(pagarRes.totals.totalPaidAmount)}
                </p>
              </div>
            </div>

            <h3 className="relatorio-fin__section-title">Detalhes</h3>
            {rowsPagar.length === 0 ? (
              <p className="table-empty">Nenhum registro encontrado.</p>
            ) : (
              <div className="table-wrap">
                <table className="data-table" style={{ minWidth: 960 }}>
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Descrição</th>
                      <th scope="col">Fornecedor</th>
                      <th scope="col">Vencimento</th>
                      <th scope="col" className="data-table__num">
                        Valor
                      </th>
                      <th scope="col">Status</th>
                      <th scope="col">Observações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowsPagar.map((r: ContaPagarRelatorioRow) => (
                      <tr
                        key={r.id}
                        style={r.status === 'CANCELLED' ? { opacity: 0.72 } : undefined}
                      >
                        <td>{r.id}</td>
                        <td>{r.description ?? '—'}</td>
                        <td>{r.supplierName ?? '—'}</td>
                        <td>
                          {r.dueDate
                            ? new Date(r.dueDate).toLocaleDateString('pt-BR')
                            : '—'}
                        </td>
                        <td className="data-table__num">{formatCurrency(r.amount)}</td>
                        <td>
                          <span className={badgeClassPagar(r.status)}>{labelPagar(r.status)}</span>
                        </td>
                        <td className="relatorio-fin__notes" title={r.notes ?? undefined}>
                          {r.notes ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {!carregando && tipo === 'receber' && receberRes && (
          <>
            <h3 className="relatorio-fin__section-title">Resumo</h3>
            <div className="relatorio-fin__summary">
              <div className="relatorio-fin__summary-card">
                <span className="relatorio-fin__summary-label">Total de registros</span>
                <p className="relatorio-fin__summary-value relatorio-fin__summary-value--muted">
                  {receberRes.totals.totalCount}
                </p>
              </div>
              <div className="relatorio-fin__summary-card">
                <span className="relatorio-fin__summary-label">Valor total</span>
                <p className="relatorio-fin__summary-value">
                  {formatCurrency(receberRes.totals.totalAmount)}
                </p>
              </div>
              <div className="relatorio-fin__summary-card">
                <span className="relatorio-fin__summary-label">Pendente</span>
                <p className="relatorio-fin__summary-value">
                  {formatCurrency(receberRes.totals.totalPendingAmount)}
                </p>
              </div>
              <div className="relatorio-fin__summary-card">
                <span className="relatorio-fin__summary-label">Vencido</span>
                <p className="relatorio-fin__summary-value">
                  {formatCurrency(receberRes.totals.totalOverdueAmount)}
                </p>
              </div>
              <div className="relatorio-fin__summary-card">
                <span className="relatorio-fin__summary-label">Recebido</span>
                <p className="relatorio-fin__summary-value">
                  {formatCurrency(receberRes.totals.totalReceivedAmount)}
                </p>
              </div>
            </div>

            <h3 className="relatorio-fin__section-title">Detalhes</h3>
            {rowsReceber.length === 0 ? (
              <p className="table-empty">Nenhum registro encontrado.</p>
            ) : (
              <div className="table-wrap">
                <table className="data-table" style={{ minWidth: 960 }}>
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Descrição</th>
                      <th scope="col">Cliente</th>
                      <th scope="col">Vencimento</th>
                      <th scope="col" className="data-table__num">
                        Valor
                      </th>
                      <th scope="col">Status</th>
                      <th scope="col">Observações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowsReceber.map((r: ContaReceberRelatorioRow) => (
                      <tr
                        key={r.id}
                        style={r.status === 'CANCELLED' ? { opacity: 0.72 } : undefined}
                      >
                        <td>{r.id}</td>
                        <td>{r.description ?? '—'}</td>
                        <td>{r.customerName ?? '—'}</td>
                        <td>
                          {r.dueDate
                            ? new Date(r.dueDate).toLocaleDateString('pt-BR')
                            : '—'}
                        </td>
                        <td className="data-table__num">{formatCurrency(r.amount)}</td>
                        <td>
                          <span className={badgeClassReceber(r.status)}>
                            {labelReceber(r.status)}
                          </span>
                        </td>
                        <td className="relatorio-fin__notes" title={r.notes ?? undefined}>
                          {r.notes ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
