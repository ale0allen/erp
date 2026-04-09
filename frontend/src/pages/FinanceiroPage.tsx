import { useCallback, useEffect, useState } from 'react'

import { fetchFinanceiroDashboard } from '../modules/financeiro/financeiroDashboardService'
import type { FinanceiroDashboardResumo } from '../modules/financeiro/financeiroDashboard.types'
import '../styles/financeiro-dashboard.css'
import '../styles/pages.css'
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

export function FinanceiroPage() {
  const [resumo, setResumo] = useState<FinanceiroDashboardResumo | null>(null)
  const [fIni, setFIni] = useState('')
  const [fFim, setFFim] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(true)

  const carregar = useCallback(async (filtros: { startDate?: string; endDate?: string } = {}) => {
    setCarregando(true)
    setMensagem('')
    try {
      const data = await fetchFinanceiroDashboard({
        startDate: filtros.startDate,
        endDate: filtros.endDate
      })
      setResumo(data)
    } catch (e) {
      console.error(e)
      setMensagem(`Erro ao carregar dashboard financeiro: ${String(e)}`)
      setResumo(null)
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    void carregar({})
  }, [carregar])

  const aplicarFiltros = (e: React.FormEvent) => {
    e.preventDefault()
    void carregar({
      startDate: fIni.trim() || undefined,
      endDate: fFim.trim() || undefined
    })
  }

  const limparFiltros = () => {
    setFIni('')
    setFFim('')
    void carregar({})
  }

  const proj = resumo ? Number(resumo.projectedBalance) : 0
  const balanceClass =
    !Number.isFinite(proj) || proj === 0
      ? 'fin-dashboard-card fin-dashboard-card--balance-neutral'
      : proj > 0
        ? 'fin-dashboard-card fin-dashboard-card--balance-positive'
        : 'fin-dashboard-card fin-dashboard-card--balance-negative'

  return (
    <div className="erp-page">
      <div className="erp-page__container">
        <h2 className="erp-page__title">Dashboard financeiro</h2>
        <p className="fin-dashboard__lead">
          Visão gerencial de contas a pagar e a receber. Vencidos consideram apenas títulos
          pendentes com data de vencimento anterior a hoje. O saldo projetado é: a receber
          pendentes (não vencidos) menos a pagar pendentes (não vencidos), no período filtrado
          por data de vencimento.
        </p>

        {mensagem && (
          <p className={getStatusMessageClass(mensagem)} role="status">
            {mensagem}
          </p>
        )}

        <section className="card" aria-labelledby="fin-filtros">
          <h3 id="fin-filtros" className="card__title">
            Filtros (por vencimento)
          </h3>
          <form className="fin-dashboard__filters" onSubmit={aplicarFiltros}>
            <div className="form-field">
              <label className="form-label" htmlFor="fin-ini">
                Vencimento (de)
              </label>
              <input
                id="fin-ini"
                className="form-input"
                type="date"
                value={fIni}
                onChange={e => setFIni(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="fin-fim">
                Vencimento (até)
              </label>
              <input
                id="fin-fim"
                className="form-input"
                type="date"
                value={fFim}
                onChange={e => setFFim(e.target.value)}
              />
            </div>
            <div className="fin-dashboard__filters-actions">
              <button type="submit" className="btn btn--primary">
                Aplicar
              </button>
              <button type="button" className="btn btn--secondary" onClick={limparFiltros}>
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

        {!carregando && resumo && (
          <>
            <h3 className="fin-dashboard__section-title">Contas a pagar</h3>
            <div className="fin-dashboard__cards">
              <article className="fin-dashboard-card fin-dashboard-card--pending">
                <span className="fin-dashboard-card__label">Pendentes</span>
                <p className="fin-dashboard-card__count">{resumo.totalPayablesPending}</p>
                <p className="fin-dashboard-card__amount">
                  {formatCurrency(resumo.totalPayablesAmountPending)}
                </p>
                <p className="fin-dashboard-card__hint">Não vencidos</p>
              </article>
              <article className="fin-dashboard-card fin-dashboard-card--overdue">
                <span className="fin-dashboard-card__label">Vencidos</span>
                <p className="fin-dashboard-card__count">{resumo.totalPayablesOverdue}</p>
                <p className="fin-dashboard-card__amount">
                  {formatCurrency(resumo.totalPayablesAmountOverdue)}
                </p>
                <p className="fin-dashboard-card__hint">Pendentes com vencimento antes de hoje</p>
              </article>
              <article className="fin-dashboard-card fin-dashboard-card--success">
                <span className="fin-dashboard-card__label">Pagos</span>
                <p className="fin-dashboard-card__count">{resumo.totalPayablesPaid}</p>
                <p className="fin-dashboard-card__amount">
                  {formatCurrency(resumo.totalPayablesAmountPaid)}
                </p>
                <p className="fin-dashboard-card__hint">Total pago</p>
              </article>
            </div>

            <h3 className="fin-dashboard__section-title">Contas a receber</h3>
            <div className="fin-dashboard__cards">
              <article className="fin-dashboard-card fin-dashboard-card--pending">
                <span className="fin-dashboard-card__label">Pendentes</span>
                <p className="fin-dashboard-card__count">{resumo.totalReceivablesPending}</p>
                <p className="fin-dashboard-card__amount">
                  {formatCurrency(resumo.totalReceivablesAmountPending)}
                </p>
                <p className="fin-dashboard-card__hint">Não vencidos</p>
              </article>
              <article className="fin-dashboard-card fin-dashboard-card--overdue">
                <span className="fin-dashboard-card__label">Vencidos</span>
                <p className="fin-dashboard-card__count">{resumo.totalReceivablesOverdue}</p>
                <p className="fin-dashboard-card__amount">
                  {formatCurrency(resumo.totalReceivablesAmountOverdue)}
                </p>
                <p className="fin-dashboard-card__hint">Pendentes com vencimento antes de hoje</p>
              </article>
              <article className="fin-dashboard-card fin-dashboard-card--success">
                <span className="fin-dashboard-card__label">Recebidos</span>
                <p className="fin-dashboard-card__count">{resumo.totalReceivablesReceived}</p>
                <p className="fin-dashboard-card__amount">
                  {formatCurrency(resumo.totalReceivablesAmountReceived)}
                </p>
                <p className="fin-dashboard-card__hint">Total recebido</p>
              </article>
            </div>

            <h3 className="fin-dashboard__section-title">Indicador</h3>
            <div className="fin-dashboard__cards">
              <article className={balanceClass}>
                <span className="fin-dashboard-card__label">Saldo projetado</span>
                <p className="fin-dashboard-card__amount" style={{ fontSize: '1.5rem' }}>
                  {formatCurrency(resumo.projectedBalance)}
                </p>
                <p className="fin-dashboard-card__hint">
                  A receber pendentes (não vencidos) − a pagar pendentes (não vencidos)
                </p>
              </article>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
