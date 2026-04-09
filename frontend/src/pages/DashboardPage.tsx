import { useEffect, useState } from 'react'

import { fetchProdutoResumo } from '../modules/produto/produtoService'
import type { ProdutoResumo } from '../modules/produto/produto.types'
import '../styles/dashboard.css'
import '../styles/pages.css'

export function DashboardPage() {
  const [resumo, setResumo] = useState<ProdutoResumo | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let cancelado = false

    const carregar = async () => {
      setCarregando(true)
      setErro(null)
      try {
        const data = await fetchProdutoResumo()
        if (!cancelado) {
          setResumo(data)
        }
      } catch (e) {
        if (!cancelado) {
          setErro(`Não foi possível carregar o resumo: ${String(e)}`)
          setResumo(null)
        }
      } finally {
        if (!cancelado) {
          setCarregando(false)
        }
      }
    }

    void carregar()
    return () => {
      cancelado = true
    }
  }, [])

  return (
    <div className="dashboard">
      <p className="dashboard__lead">
        Bem-vindo ao painel principal. Abaixo está o resumo do cadastro de
        produtos e indicadores de estoque.
      </p>

      {carregando && (
        <p
          className="dashboard__status dashboard__status--loading"
          role="status"
        >
          Carregando resumo...
        </p>
      )}

      {!carregando && erro && (
        <p className="dashboard__status" role="alert">
          {erro}
        </p>
      )}

      {!carregando && resumo && (
        <>
          <p className="dashboard__legend">
            <strong>Sem estoque:</strong> saldo ≤ 0. <strong>Baixo:</strong>{' '}
            saldo &gt; 0 e saldo ≤ estoque mínimo do produto.{' '}
            <strong>Normal:</strong> saldo &gt; estoque mínimo.
          </p>

          <div className="dashboard__cards">
            <article className="dashboard-card dashboard-card--total">
              <span className="dashboard-card__label">Total de produtos</span>
              <p className="dashboard-card__value">{resumo.totalProducts}</p>
              <p className="dashboard-card__hint">Cadastrados no sistema</p>
            </article>
            <article className="dashboard-card dashboard-card--ativos">
              <span className="dashboard-card__label">Ativos</span>
              <p className="dashboard-card__value">{resumo.activeProducts}</p>
              <p className="dashboard-card__hint">Disponíveis para uso</p>
            </article>
            <article className="dashboard-card dashboard-card--inativos">
              <span className="dashboard-card__label">Inativos</span>
              <p className="dashboard-card__value">{resumo.inactiveProducts}</p>
              <p className="dashboard-card__hint">Inativos no cadastro</p>
            </article>
            <article className="dashboard-card dashboard-card--qty-estoque">
              <span className="dashboard-card__label">
                Quantidade total em estoque
              </span>
              <p className="dashboard-card__value">
                {resumo.totalStockQuantity}
              </p>
              <p className="dashboard-card__hint">Soma dos saldos</p>
            </article>
            <article className="dashboard-card dashboard-card--sem-estoque">
              <span className="dashboard-card__label">
                Sem estoque
              </span>
              <p className="dashboard-card__value">
                {resumo.productsOutOfStock}
              </p>
              <p className="dashboard-card__hint">Saldo ≤ 0</p>
            </article>
            <article className="dashboard-card dashboard-card--estoque-baixo">
              <span className="dashboard-card__label">
                Estoque baixo
              </span>
              <p className="dashboard-card__value">
                {resumo.productsWithLowStock}
              </p>
              <p className="dashboard-card__hint">
                Saldo &gt; 0 e saldo ≤ mínimo
              </p>
            </article>
            <article className="dashboard-card dashboard-card--estoque-normal">
              <span className="dashboard-card__label">Estoque normal</span>
              <p className="dashboard-card__value">
                {resumo.productsWithNormalStock}
              </p>
              <p className="dashboard-card__hint">Saldo &gt; mínimo</p>
            </article>
          </div>
        </>
      )}

      <div className="page-placeholder__grid dashboard__shortcut">
        <div className="page-placeholder__card">
          <span className="page-placeholder__card-label">Atalhos</span>
          <p className="page-placeholder__card-text">
            Cadastre e movimente em <strong>Produtos</strong> e{' '}
            <strong>Estoque</strong> no menu lateral.
          </p>
        </div>
      </div>
    </div>
  )
}
