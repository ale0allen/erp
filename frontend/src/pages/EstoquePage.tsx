import { useEffect, useState } from 'react'

import {
  fetchMovimentacoes,
  registrarMovimentacao
} from '../modules/estoque/estoqueService'
import type {
  MovimentacaoEstoque,
  TipoMovimentacaoEstoque
} from '../modules/estoque/movimentacaoEstoque.types'
import { fetchProdutos } from '../modules/produto/produtoService'
import type { Produto } from '../modules/produto/produto.types'
import '../styles/estoque.css'
import { getStatusMessageClass } from '../utils/statusMessage'

function formatarDataHora(iso: string): string {
  try {
    return new Date(iso).toLocaleString('pt-BR')
  } catch {
    return iso
  }
}

function badgeTipoClass(tipo: TipoMovimentacaoEstoque): string {
  return tipo === 'ENTRADA'
    ? 'estoque-tipo-badge estoque-tipo-badge--entrada'
    : 'estoque-tipo-badge estoque-tipo-badge--saida'
}

function labelTipo(tipo: TipoMovimentacaoEstoque): string {
  return tipo === 'ENTRADA' ? 'Entrada' : 'Saída'
}

export function EstoquePage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>([])
  const [produtoId, setProdutoId] = useState('')
  const [tipo, setTipo] = useState<TipoMovimentacaoEstoque>('ENTRADA')
  const [quantidade, setQuantidade] = useState('')
  const [observacao, setObservacao] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(true)

  const carregar = async (opts?: { silent?: boolean }) => {
    try {
      if (!opts?.silent) {
        setCarregando(true)
      }
      const [prods, movs] = await Promise.all([
        fetchProdutos(),
        fetchMovimentacoes()
      ])
      setProdutos(prods)
      setMovimentacoes(movs)
    } catch (error) {
      console.error(error)
      setMensagem(`Erro ao carregar dados: ${String(error)}`)
    } finally {
      if (!opts?.silent) {
        setCarregando(false)
      }
    }
  }

  useEffect(() => {
    void carregar()
  }, [])

  const limparFormulario = () => {
    setProdutoId(produtos[0] ? String(produtos[0].id) : '')
    setTipo('ENTRADA')
    setQuantidade('')
    setObservacao('')
  }

  useEffect(() => {
    if (produtos.length > 0 && produtoId === '') {
      setProdutoId(String(produtos[0].id))
    }
  }, [produtos, produtoId])

  const registrar = async (e: React.FormEvent) => {
    e.preventDefault()

    if (produtoId === '') {
      setMensagem('Selecione um produto.')
      return
    }

    const q = Number(quantidade)
    if (
      quantidade === '' ||
      !Number.isInteger(q) ||
      q < 1
    ) {
      setMensagem('Informe uma quantidade inteira maior ou igual a 1.')
      return
    }

    try {
      setMensagem('Registrando movimentação...')

      await registrarMovimentacao({
        produtoId: Number(produtoId),
        tipo,
        quantidade: q,
        observacao: observacao.trim() === '' ? null : observacao.trim()
      })

      limparFormulario()
      setMensagem('Movimentação registrada com sucesso.')
      await carregar({ silent: true })
    } catch (error) {
      console.error(error)
      setMensagem(`Erro ao registrar: ${String(error)}`)
    }
  }

  return (
    <div className="erp-page">
      <div className="erp-page__container">
        <header>
          <h2 className="erp-page__title">Estoque</h2>
          <p className="estoque-intro">
            Registre entradas e saídas. O saldo do produto é atualizado
            automaticamente; saídas não podem ultrapassar o saldo disponível.
          </p>
        </header>

        {carregando && (
          <p
            className="status-message status-message--loading"
            role="status"
          >
            Carregando produtos e histórico...
          </p>
        )}

        {!carregando && mensagem && (
          <p className={getStatusMessageClass(mensagem)} role="status">
            {mensagem}
          </p>
        )}

        <section className="card" aria-labelledby="form-mov-heading">
          <h3 id="form-mov-heading" className="card__title">
            Nova movimentação
          </h3>
          <form className="produto-form estoque-form-grid" onSubmit={registrar}>
            <div className="form-field">
              <label className="form-label" htmlFor="mov-produto">
                Produto
              </label>
              <select
                id="mov-produto"
                className="form-input"
                value={produtoId}
                onChange={e => setProdutoId(e.target.value)}
                required
                disabled={produtos.length === 0}
              >
                <option value="">
                  {produtos.length === 0
                    ? 'Nenhum produto cadastrado'
                    : 'Selecione o produto'}
                </option>
                {produtos.map(p => (
                  <option key={p.id} value={String(p.id)}>
                    {p.codigo} — {p.nome} (saldo: {p.saldoEstoque ?? 0})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="mov-tipo">
                Tipo
              </label>
              <select
                id="mov-tipo"
                className="form-input"
                value={tipo}
                onChange={e =>
                  setTipo(e.target.value as TipoMovimentacaoEstoque)
                }
              >
                <option value="ENTRADA">Entrada</option>
                <option value="SAIDA">Saída</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="mov-qtd">
                Quantidade
              </label>
              <input
                id="mov-qtd"
                className="form-input"
                type="number"
                min={1}
                step={1}
                value={quantidade}
                onChange={e => setQuantidade(e.target.value)}
                required
              />
            </div>

            <div className="form-field form-field--full">
              <label className="form-label" htmlFor="mov-obs">
                Observação
              </label>
              <textarea
                id="mov-obs"
                className="form-input"
                rows={3}
                value={observacao}
                onChange={e => setObservacao(e.target.value)}
                placeholder="Opcional — motivo, documento, etc."
              />
            </div>

            <div className="form-actions form-field--full">
              <button
                type="submit"
                className="btn btn--primary"
                disabled={produtos.length === 0}
              >
                Registrar movimentação
              </button>
            </div>
          </form>
        </section>

        <section
          className="card estoque-historico"
          aria-labelledby="hist-mov-heading"
        >
          <h3 id="hist-mov-heading" className="card__title">
            Histórico de movimentações
          </h3>
          {movimentacoes.length === 0 ? (
            <p className="table-empty">
              Nenhuma movimentação registrada ainda.
            </p>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Data / hora</th>
                    <th scope="col">Produto</th>
                    <th scope="col">Tipo</th>
                    <th scope="col" className="data-table__num">
                      Qtd
                    </th>
                    <th scope="col">Observação</th>
                  </tr>
                </thead>
                <tbody>
                  {movimentacoes.map(m => (
                    <tr key={m.id}>
                      <td>{formatarDataHora(m.dataMovimentacao)}</td>
                      <td>
                        {m.produtoCodigo} — {m.produtoNome}
                      </td>
                      <td>
                        <span className={badgeTipoClass(m.tipo)}>
                          {labelTipo(m.tipo)}
                        </span>
                      </td>
                      <td className="data-table__num">{m.quantidade}</td>
                      <td className="data-table__obs">
                        {m.observacao ?? '—'}
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
