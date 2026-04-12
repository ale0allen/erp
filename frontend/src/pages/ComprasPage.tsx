import { useEffect, useMemo, useState } from 'react'

import { AuditoriaMeta } from '../components/AuditoriaMeta'
import { fetchFornecedores } from '../modules/fornecedor/fornecedorService'
import type { Fornecedor } from '../modules/fornecedor/fornecedor.types'
import { fetchProdutos } from '../modules/produto/produtoService'
import type { Produto } from '../modules/produto/produto.types'
import type {
  CompraDetail,
  CompraItemPayload,
  CompraListItem,
  StatusCompra
} from '../modules/compra/compra.types'
import {
  atualizarCompra,
  cancelarCompra,
  criarCompra,
  fetchCompraDetalhe,
  fetchCompras,
  finalizarCompra
} from '../modules/compra/compraService'
import type { Auditoria } from '../types/audit.types'
import '../styles/compras.css'
import { getStatusMessageClass } from '../utils/statusMessage'

type ItemDraft = {
  produtoId: string
  quantidade: string
  custoUnitario: string
}

function statusClass(status: StatusCompra): string {
  if (status === 'DRAFT') {
    return 'compras__status compras__status--draft'
  }
  if (status === 'COMPLETED') {
    return 'compras__status compras__status--completed'
  }
  return 'compras__status compras__status--cancelled'
}

function statusLabel(status: StatusCompra): string {
  if (status === 'DRAFT') return 'Rascunho'
  if (status === 'COMPLETED') return 'Finalizada'
  return 'Cancelada'
}

function todayIso(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function ComprasPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [compras, setCompras] = useState<CompraListItem[]>([])

  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [statusAtual, setStatusAtual] = useState<StatusCompra>('DRAFT')
  const [fornecedorId, setFornecedorId] = useState('')
  const [dataCompra, setDataCompra] = useState(todayIso())
  const [observacoes, setObservacoes] = useState('')
  const [itens, setItens] = useState<ItemDraft[]>([])

  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [contaPagarId, setContaPagarId] = useState<number | null>(null)
  const [auditoriaCompra, setAuditoriaCompra] = useState<Auditoria | null>(null)

  const carregar = async () => {
    setCarregando(true)
    try {
      const [fs, ps, cs] = await Promise.all([
        fetchFornecedores(),
        fetchProdutos(),
        fetchCompras()
      ])
      setFornecedores(fs)
      setProdutos(ps)
      setCompras(cs)

      if (fornecedorId === '' && fs.length > 0 && editandoId == null) {
        setFornecedorId(String(fs[0].id))
      }
    } catch (e) {
      console.error(e)
      setMensagem(`Erro ao carregar dados: ${String(e)}`)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    void carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalCompra = useMemo(() => {
    let total = 0
    for (const i of itens) {
      const q = Number(i.quantidade)
      const u = Number(i.custoUnitario)
      if (Number.isFinite(q) && Number.isFinite(u)) {
        total += q * u
      }
    }
    return total
  }, [itens])

  const adicionarItem = () => {
    setItens(prev => [
      ...prev,
      { produtoId: '', quantidade: '1', custoUnitario: '0' }
    ])
  }

  const removerItem = (idx: number) => {
    setItens(prev => prev.filter((_, i) => i !== idx))
  }

  const atualizarItem = (idx: number, patch: Partial<ItemDraft>) => {
    setItens(prev =>
      prev.map((it, i) => (i === idx ? { ...it, ...patch } : it))
    )
  }

  const limparFormulario = () => {
    setEditandoId(null)
    setStatusAtual('DRAFT')
    setObservacoes('')
    setDataCompra(todayIso())
    setItens([])
    setMensagem('')
    setContaPagarId(null)
    setAuditoriaCompra(null)
    setFornecedorId(fornecedores[0] ? String(fornecedores[0].id) : '')
  }

  const carregarParaEdicao = async (id: number) => {
    try {
      setMensagem('Carregando compra...')
      const detalhe = await fetchCompraDetalhe(id)
      preencherFormulario(detalhe)
      setMensagem('')
    } catch (e) {
      console.error(e)
      setMensagem(`Erro ao carregar compra: ${String(e)}`)
    }
  }

  const preencherFormulario = (detalhe: CompraDetail) => {
    setEditandoId(detalhe.id)
    setStatusAtual(detalhe.status)
    setFornecedorId(String(detalhe.fornecedorId))
    setDataCompra(detalhe.dataCompra.slice(0, 10))
    setObservacoes(detalhe.observacoes ?? '')
    setContaPagarId(detalhe.contaPagarId ?? null)
    setAuditoriaCompra(detalhe.auditoria ?? null)
    setItens(
      (detalhe.itens ?? []).map(i => ({
        produtoId: String(i.produtoId),
        quantidade: String(i.quantidade),
        custoUnitario: String(i.custoUnitario)
      }))
    )
  }

  const montarPayloadItens = (): CompraItemPayload[] => {
    return itens.map(i => ({
      produtoId: Number(i.produtoId),
      quantidade: Number(i.quantidade),
      custoUnitario: Number(i.custoUnitario)
    }))
  }

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault()

    if (fornecedorId === '') {
      setMensagem('Selecione um fornecedor.')
      return
    }

    if (itens.length === 0) {
      setMensagem('Adicione ao menos um item.')
      return
    }

    for (const [idx, i] of itens.entries()) {
      if (i.produtoId === '') {
        setMensagem(`Selecione o produto no item ${idx + 1}.`)
        return
      }
      const q = Number(i.quantidade)
      if (!Number.isFinite(q) || q <= 0) {
        setMensagem(`Quantidade inválida no item ${idx + 1}.`)
        return
      }
      const u = Number(i.custoUnitario)
      if (!Number.isFinite(u) || u < 0) {
        setMensagem(`Custo unitário inválido no item ${idx + 1}.`)
        return
      }
    }

    try {
      setMensagem(editandoId != null ? 'Atualizando compra...' : 'Salvando compra...')

      const payload = {
        fornecedorId: Number(fornecedorId),
        dataCompra: new Date(`${dataCompra}T00:00:00.000Z`).toISOString(),
        observacoes: observacoes.trim() ? observacoes.trim() : null,
        itens: montarPayloadItens()
      }

      let detalhe: CompraDetail
      const criando = editandoId == null
      if (criando) {
        detalhe = await criarCompra(payload)
      } else {
        detalhe = await atualizarCompra(editandoId, payload)
      }

      preencherFormulario(detalhe)
      await carregar()
      setMensagem(criando ? 'Compra salva com sucesso.' : 'Compra atualizada com sucesso.')
    } catch (err) {
      console.error(err)
      setMensagem(`Erro ao salvar compra: ${String(err)}`)
    }
  }

  const finalizar = async () => {
    if (editandoId == null) return
    try {
      setMensagem('Finalizando compra...')
      const detalhe = await finalizarCompra(editandoId)
      preencherFormulario(detalhe)
      await carregar()
      setMensagem(
        'Compra finalizada com sucesso. Entradas de estoque e conta a pagar foram geradas.'
      )
    } catch (e) {
      console.error(e)
      setMensagem(`Erro ao finalizar compra: ${String(e)}`)
    }
  }

  const cancelar = async () => {
    if (editandoId == null) return
    const ok = window.confirm('Cancelar esta compra?')
    if (!ok) return
    try {
      setMensagem('Cancelando compra...')
      const detalhe = await cancelarCompra(editandoId)
      preencherFormulario(detalhe)
      await carregar()
      setMensagem('Compra cancelada com sucesso.')
    } catch (e) {
      console.error(e)
      setMensagem(`Erro ao cancelar compra: ${String(e)}`)
    }
  }

  const podeEditar = statusAtual === 'DRAFT'

  return (
    <div className="erp-page">
      <div className="erp-page__container">
        <h2 className="erp-page__title">Compras</h2>

        {mensagem && (
          <p className={getStatusMessageClass(mensagem)} role="status">
            {mensagem}
          </p>
        )}

        {carregando && (
          <p className="status-message status-message--loading" role="status">
            Carregando...
          </p>
        )}

        <div className="compras__grid">
          <section className="card" aria-labelledby="compra-form-heading">
            <div className="compras__itens-header">
              <h3 id="compra-form-heading" className="card__title" style={{ margin: 0 }}>
                {editandoId != null ? `Compra #${editandoId}` : 'Nova compra'}
              </h3>
              <span className={statusClass(statusAtual)}>
                {statusLabel(statusAtual)}
              </span>
            </div>
            {statusAtual === 'COMPLETED' && contaPagarId != null && (
              <p className="compras__conta-pagar-hint" role="status">
                Conta a pagar #{contaPagarId} gerada para esta compra.
              </p>
            )}

            {editandoId != null && auditoriaCompra != null ? (
              <AuditoriaMeta auditoria={auditoriaCompra} titulo="Auditoria da compra" />
            ) : null}

            <form className="produto-form" onSubmit={salvar}>
              <div className="form-field">
                <label className="form-label" htmlFor="compra-fornecedor">
                  Fornecedor
                </label>
                <select
                  id="compra-fornecedor"
                  className="form-input"
                  value={fornecedorId}
                  onChange={e => setFornecedorId(e.target.value)}
                  required
                  disabled={!podeEditar}
                >
                  {fornecedores.length === 0 && (
                    <option value="">Nenhum fornecedor</option>
                  )}
                  {fornecedores.map(f => (
                    <option key={f.id} value={String(f.id)}>
                      {f.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="compra-data">
                  Data
                </label>
                <input
                  id="compra-data"
                  className="form-input"
                  type="date"
                  value={dataCompra}
                  onChange={e => setDataCompra(e.target.value)}
                  required
                  disabled={!podeEditar}
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="compra-obs">
                  Observações
                </label>
                <textarea
                  id="compra-obs"
                  className="form-input"
                  value={observacoes}
                  onChange={e => setObservacoes(e.target.value)}
                  disabled={!podeEditar}
                />
              </div>

              <div className="compras__itens-header">
                <strong className="compras__itens-total">
                  Total (UI): {totalCompra.toFixed(2)}
                </strong>
                <button
                  type="button"
                  className="btn btn--secondary btn--small"
                  onClick={adicionarItem}
                  disabled={!podeEditar}
                >
                  Adicionar item
                </button>
              </div>

              {itens.length === 0 ? (
                <p className="table-empty">Nenhum item adicionado.</p>
              ) : (
                <div className="table-wrap">
                  <table className="data-table" style={{ minWidth: 900 }}>
                    <thead>
                      <tr>
                        <th scope="col">Produto</th>
                        <th scope="col" className="data-table__num">
                          Quantidade
                        </th>
                        <th scope="col" className="data-table__num">
                          Custo unitário
                        </th>
                        <th scope="col" className="data-table__num">
                          Subtotal
                        </th>
                        <th scope="col">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itens.map((it, idx) => {
                        const q = Number(it.quantidade)
                        const u = Number(it.custoUnitario)
                        const sub =
                          Number.isFinite(q) && Number.isFinite(u) ? q * u : 0
                        return (
                          <tr key={idx}>
                            <td>
                              <select
                                className="form-input"
                                value={it.produtoId}
                                onChange={e =>
                                  atualizarItem(idx, { produtoId: e.target.value })
                                }
                                disabled={!podeEditar}
                              >
                                <option value="">Selecione...</option>
                                {produtos.map(p => (
                                  <option key={p.id} value={String(p.id)}>
                                    {p.codigo} — {p.nome}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="data-table__num">
                              <input
                                className="form-input"
                                type="number"
                                min={1}
                                step={1}
                                value={it.quantidade}
                                onChange={e =>
                                  atualizarItem(idx, { quantidade: e.target.value })
                                }
                                disabled={!podeEditar}
                              />
                            </td>
                            <td className="data-table__num">
                              <input
                                className="form-input"
                                type="number"
                                min={0}
                                step="0.01"
                                value={it.custoUnitario}
                                onChange={e =>
                                  atualizarItem(idx, { custoUnitario: e.target.value })
                                }
                                disabled={!podeEditar}
                              />
                            </td>
                            <td className="data-table__num">{sub.toFixed(2)}</td>
                            <td className="data-table__actions">
                              <div className="table-actions">
                                <button
                                  type="button"
                                  className="btn btn--danger btn--small"
                                  onClick={() => removerItem(idx)}
                                  disabled={!podeEditar}
                                >
                                  Remover
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="btn btn--primary" disabled={!podeEditar}>
                  {editandoId != null ? 'Atualizar' : 'Salvar'}
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={limparFormulario}
                >
                  Nova compra
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={finalizar}
                  disabled={editandoId == null || statusAtual !== 'DRAFT'}
                >
                  Finalizar
                </button>
                <button
                  type="button"
                  className="btn btn--danger"
                  onClick={cancelar}
                  disabled={editandoId == null || statusAtual !== 'DRAFT'}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>

          <section className="card" aria-labelledby="compras-lista-heading">
            <h3 id="compras-lista-heading" className="card__title">
              Compras registradas
            </h3>
            {compras.length === 0 ? (
              <p className="table-empty">Nenhuma compra encontrada.</p>
            ) : (
              <div className="table-wrap">
                <table className="data-table" style={{ minWidth: 720 }}>
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Fornecedor</th>
                      <th scope="col">Data</th>
                      <th scope="col">Status</th>
                      <th scope="col" className="data-table__num">
                        Total
                      </th>
                      <th scope="col">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compras.map(c => (
                      <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>{c.fornecedorNome ?? '—'}</td>
                        <td>
                          {c.dataCompra ? new Date(c.dataCompra).toLocaleDateString('pt-BR') : '—'}
                        </td>
                        <td>
                          <span className={statusClass(c.status)}>
                            {statusLabel(c.status)}
                          </span>
                        </td>
                        <td className="data-table__num">
                          {Number(c.valorTotal ?? 0).toFixed(2)}
                        </td>
                        <td className="data-table__actions">
                          <div className="table-actions">
                            <button
                              type="button"
                              className="btn btn--secondary btn--small"
                              onClick={() => void carregarParaEdicao(c.id)}
                            >
                              Ver
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
    </div>
  )
}

