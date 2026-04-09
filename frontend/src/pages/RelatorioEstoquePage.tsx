import { useCallback, useEffect, useMemo, useState } from 'react'

import { fetchCategorias } from '../modules/categoria/categoriaService'
import type { Categoria } from '../modules/categoria/categoria.types'
import { fetchRelatorioEstoque } from '../modules/relatorio/relatorioEstoqueService'
import type { RelatorioEstoqueItem } from '../modules/relatorio/relatorioEstoque.types'
import type { StatusEstoque } from '../modules/produto/produto.types'
import {
  statusBadgeClass,
  statusLabel,
  statusTitleAttr
} from '../modules/produto/stockIndicators'
import '../styles/pages.css'
import '../styles/relatorio-estoque.css'

type FiltroAtivo = '' | 'true' | 'false'

function montarFiltrosApi(
  productName: string,
  categoryId: string,
  stockStatus: '' | StatusEstoque,
  active: FiltroAtivo
): Parameters<typeof fetchRelatorioEstoque>[0] {
  const f: Parameters<typeof fetchRelatorioEstoque>[0] = {}
  const nome = productName.trim()
  if (nome) {
    f.productName = nome
  }
  if (categoryId !== '') {
    f.categoryId = Number(categoryId)
  }
  if (stockStatus !== '') {
    f.stockStatus = stockStatus
  }
  if (active === 'true') {
    f.active = true
  } else if (active === 'false') {
    f.active = false
  }
  return f
}

export function RelatorioEstoquePage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [linhas, setLinhas] = useState<RelatorioEstoqueItem[]>([])
  const [productName, setProductName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [stockStatus, setStockStatus] = useState<'' | StatusEstoque>('')
  const [active, setActive] = useState<FiltroAtivo>('')
  const [carregando, setCarregando] = useState(true)
  const [mensagem, setMensagem] = useState('')

  const carregarCategorias = useCallback(async () => {
    try {
      const data = await fetchCategorias()
      setCategorias(data)
    } catch (e) {
      console.error(e)
      setMensagem(`Erro ao carregar categorias: ${String(e)}`)
    }
  }, [])

  const carregarRelatorio = useCallback(
    async (filtrosApi?: Parameters<typeof fetchRelatorioEstoque>[0]) => {
      setCarregando(true)
      setMensagem('')
      try {
        const data = await fetchRelatorioEstoque(filtrosApi ?? {})
        setLinhas(data)
      } catch (e) {
        console.error(e)
        setMensagem(`Erro ao carregar relatório: ${String(e)}`)
        setLinhas([])
      } finally {
        setCarregando(false)
      }
    },
    []
  )

  useEffect(() => {
    void carregarCategorias()
  }, [carregarCategorias])

  useEffect(() => {
    void carregarRelatorio()
  }, [carregarRelatorio])

  const resumo = useMemo(() => {
    let semEstoque = 0
    let baixo = 0
    let normal = 0
    for (const r of linhas) {
      const s = r.stockStatus
      if (s === 'OUT_OF_STOCK') {
        semEstoque++
      } else if (s === 'LOW_STOCK') {
        baixo++
      } else {
        normal++
      }
    }
    return {
      total: linhas.length,
      semEstoque,
      baixo,
      normal
    }
  }, [linhas])

  const buscar = (e: React.FormEvent) => {
    e.preventDefault()
    void carregarRelatorio(
      montarFiltrosApi(productName, categoryId, stockStatus, active)
    )
  }

  const limparFiltros = () => {
    setProductName('')
    setCategoryId('')
    setStockStatus('')
    setActive('')
    void carregarRelatorio()
  }

  return (
    <div className="erp-page relatorio-estoque">
      <div className="erp-page__container">
        <h2 className="erp-page__title">Relatório de estoque</h2>
        <p className="relatorio-estoque__lead">
          Visão gerencial do estoque atual: saldos, mínimos e status por produto.
        </p>

        {mensagem && (
          <p className="status-message status-message--error" role="alert">
            {mensagem}
          </p>
        )}

        <section className="card" aria-labelledby="relatorio-filtros-heading">
          <h3 id="relatorio-filtros-heading" className="card__title">
            Filtros
          </h3>
          <form className="relatorio-estoque__filtros" onSubmit={buscar}>
            <div className="form-field">
              <label className="form-label" htmlFor="rel-nome">
                Nome do produto
              </label>
              <input
                id="rel-nome"
                className="form-input"
                value={productName}
                onChange={e => setProductName(e.target.value)}
                placeholder="Contém..."
                autoComplete="off"
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="rel-categoria">
                Categoria
              </label>
              <select
                id="rel-categoria"
                className="form-input"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
              >
                <option value="">Todas</option>
                {categorias.map(c => (
                  <option key={c.id} value={String(c.id)}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="rel-status">
                Status do estoque
              </label>
              <select
                id="rel-status"
                className="form-input"
                value={stockStatus}
                onChange={e =>
                  setStockStatus(e.target.value as '' | StatusEstoque)
                }
              >
                <option value="">Todos</option>
                <option value="OUT_OF_STOCK">Sem estoque</option>
                <option value="LOW_STOCK">Baixo</option>
                <option value="NORMAL">Normal</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="rel-ativo">
                Situação
              </label>
              <select
                id="rel-ativo"
                className="form-input"
                value={active}
                onChange={e => setActive(e.target.value as FiltroAtivo)}
              >
                <option value="">Ativos e inativos</option>
                <option value="true">Somente ativos</option>
                <option value="false">Somente inativos</option>
              </select>
            </div>
            <div className="relatorio-estoque__filtros-actions">
              <button type="submit" className="btn btn--primary">
                Buscar
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={limparFiltros}
              >
                Limpar filtros
              </button>
            </div>
          </form>
        </section>

        <section
          className="relatorio-estoque__resumo"
          aria-label="Resumo do relatório"
        >
          <article className="relatorio-estoque__resumo-card relatorio-estoque__resumo-card--total">
            <span className="relatorio-estoque__resumo-label">
              Produtos no relatório
            </span>
            <p className="relatorio-estoque__resumo-value">{resumo.total}</p>
          </article>
          <article className="relatorio-estoque__resumo-card relatorio-estoque__resumo-card--out">
            <span className="relatorio-estoque__resumo-label">Sem estoque</span>
            <p className="relatorio-estoque__resumo-value">
              {resumo.semEstoque}
            </p>
          </article>
          <article className="relatorio-estoque__resumo-card relatorio-estoque__resumo-card--low">
            <span className="relatorio-estoque__resumo-label">Baixo</span>
            <p className="relatorio-estoque__resumo-value">{resumo.baixo}</p>
          </article>
          <article className="relatorio-estoque__resumo-card relatorio-estoque__resumo-card--ok">
            <span className="relatorio-estoque__resumo-label">Normal</span>
            <p className="relatorio-estoque__resumo-value">{resumo.normal}</p>
          </article>
        </section>

        <section className="card" aria-labelledby="relatorio-tabela-heading">
          <h3 id="relatorio-tabela-heading" className="card__title">
            Resultado
          </h3>
          {carregando && (
            <p className="status-message status-message--loading" role="status">
              Carregando relatório...
            </p>
          )}
          {!carregando && linhas.length === 0 && (
            <p className="table-empty">Nenhum produto encontrado com os filtros.</p>
          )}
          {!carregando && linhas.length > 0 && (
            <div className="table-wrap">
              <table className="data-table relatorio-estoque__table">
                <thead>
                  <tr>
                    <th scope="col">Código</th>
                    <th scope="col">Produto</th>
                    <th scope="col">Categoria</th>
                    <th scope="col">Ativo</th>
                    <th scope="col" className="data-table__num">
                      Saldo
                    </th>
                    <th scope="col" className="data-table__num">
                      Mínimo
                    </th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {linhas.map(r => {
                    const saldo = r.stockBalance ?? 0
                    const minimo = r.minimumStock ?? 0
                    const st = r.stockStatus
                    return (
                      <tr key={r.productId}>
                        <td>{r.productCode ?? '—'}</td>
                        <td>{r.productName ?? '—'}</td>
                        <td>{r.categoryName ?? '—'}</td>
                        <td>{r.active ? 'Sim' : 'Não'}</td>
                        <td className="data-table__num">{saldo}</td>
                        <td className="data-table__num">{minimo}</td>
                        <td>
                          <span
                            className={statusBadgeClass(st)}
                            title={statusTitleAttr(st, saldo, minimo)}
                          >
                            {statusLabel(st)}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
