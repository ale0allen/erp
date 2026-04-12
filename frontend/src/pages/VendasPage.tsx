import { useEffect, useMemo, useState } from 'react'

import { AuditoriaMeta } from '../components/AuditoriaMeta'
import { fetchClientes } from '../modules/cliente/clienteService'
import type { Cliente } from '../modules/cliente/cliente.types'
import { fetchProdutos } from '../modules/produto/produtoService'
import type { Produto } from '../modules/produto/produto.types'
import type {
  StatusVenda,
  VendaDetail,
  VendaItemPayload,
  VendaListItem
} from '../modules/venda/venda.types'
import {
  atualizarVenda,
  cancelarVenda,
  criarVenda,
  fetchVendaDetalhe,
  fetchVendas,
  finalizarVenda
} from '../modules/venda/vendaService'
import type { Auditoria } from '../types/audit.types'
import '../styles/compras.css'
import { getStatusMessageClass } from '../utils/statusMessage'

type ItemDraft = {
  produtoId: string
  quantidade: string
  precoUnitario: string
}

function statusClass(status: StatusVenda): string {
  if (status === 'DRAFT') {
    return 'compras__status compras__status--draft'
  }
  if (status === 'COMPLETED') {
    return 'compras__status compras__status--completed'
  }
  return 'compras__status compras__status--cancelled'
}

function statusLabel(status: StatusVenda): string {
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

export function VendasPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [vendas, setVendas] = useState<VendaListItem[]>([])

  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [statusAtual, setStatusAtual] = useState<StatusVenda>('DRAFT')
  const [clienteId, setClienteId] = useState('')
  const [dataVenda, setDataVenda] = useState(todayIso())
  const [observacoes, setObservacoes] = useState('')
  const [itens, setItens] = useState<ItemDraft[]>([])

  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [contaReceberId, setContaReceberId] = useState<number | null>(null)
  const [auditoriaVenda, setAuditoriaVenda] = useState<Auditoria | null>(null)

  const carregar = async () => {
    setCarregando(true)
    try {
      const [cs, ps, vs] = await Promise.all([
        fetchClientes(),
        fetchProdutos(),
        fetchVendas()
      ])
      setClientes(cs)
      setProdutos(ps)
      setVendas(vs)

      if (clienteId === '' && cs.length > 0 && editandoId == null) {
        setClienteId(String(cs[0].id))
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

  const totalVenda = useMemo(() => {
    let total = 0
    for (const i of itens) {
      const q = Number(i.quantidade)
      const u = Number(i.precoUnitario)
      if (Number.isFinite(q) && Number.isFinite(u)) {
        total += q * u
      }
    }
    return total
  }, [itens])

  const adicionarItem = () => {
    setItens(prev => [...prev, { produtoId: '', quantidade: '1', precoUnitario: '0' }])
  }

  const removerItem = (idx: number) => {
    setItens(prev => prev.filter((_, i) => i !== idx))
  }

  const atualizarItem = (idx: number, patch: Partial<ItemDraft>) => {
    setItens(prev => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)))
  }

  const limparFormulario = () => {
    setEditandoId(null)
    setStatusAtual('DRAFT')
    setObservacoes('')
    setDataVenda(todayIso())
    setItens([])
    setMensagem('')
    setContaReceberId(null)
    setAuditoriaVenda(null)
    setClienteId(clientes[0] ? String(clientes[0].id) : '')
  }

  const preencherFormulario = (detalhe: VendaDetail) => {
    setEditandoId(detalhe.id)
    setStatusAtual(detalhe.status)
    setClienteId(String(detalhe.clienteId))
    setDataVenda(detalhe.dataVenda.slice(0, 10))
    setObservacoes(detalhe.observacoes ?? '')
    setContaReceberId(detalhe.contaReceberId ?? null)
    setAuditoriaVenda(detalhe.auditoria ?? null)
    setItens(
      (detalhe.itens ?? []).map(i => ({
        produtoId: String(i.produtoId),
        quantidade: String(i.quantidade),
        precoUnitario: String(i.precoUnitario)
      }))
    )
  }

  const carregarParaEdicao = async (id: number) => {
    try {
      setMensagem('Carregando venda...')
      const detalhe = await fetchVendaDetalhe(id)
      preencherFormulario(detalhe)
      setMensagem('')
    } catch (e) {
      console.error(e)
      setMensagem(`Erro ao carregar venda: ${String(e)}`)
    }
  }

  const montarPayloadItens = (): VendaItemPayload[] => {
    return itens.map(i => ({
      produtoId: Number(i.produtoId),
      quantidade: Number(i.quantidade),
      precoUnitario: Number(i.precoUnitario)
    }))
  }

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault()

    if (clienteId === '') {
      setMensagem('Selecione um cliente.')
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
      const u = Number(i.precoUnitario)
      if (!Number.isFinite(u) || u < 0) {
        setMensagem(`Preço unitário inválido no item ${idx + 1}.`)
        return
      }
    }

    try {
      setMensagem(editandoId != null ? 'Atualizando venda...' : 'Salvando venda...')

      const payload = {
        clienteId: Number(clienteId),
        dataVenda: new Date(`${dataVenda}T00:00:00.000Z`).toISOString(),
        observacoes: observacoes.trim() ? observacoes.trim() : null,
        itens: montarPayloadItens()
      }

      let detalhe: VendaDetail
      const criando = editandoId == null
      if (criando) {
        detalhe = await criarVenda(payload)
      } else {
        detalhe = await atualizarVenda(editandoId, payload)
      }

      preencherFormulario(detalhe)
      await carregar()
      setMensagem(criando ? 'Venda salva com sucesso.' : 'Venda atualizada com sucesso.')
    } catch (err) {
      console.error(err)
      setMensagem(`Erro ao salvar venda: ${String(err)}`)
    }
  }

  const finalizar = async () => {
    if (editandoId == null) return
    try {
      setMensagem('Finalizando venda...')
      const detalhe = await finalizarVenda(editandoId)
      preencherFormulario(detalhe)
      await carregar()
      setMensagem(
        'Venda finalizada com sucesso. Saídas de estoque e conta a receber foram geradas.'
      )
    } catch (e) {
      console.error(e)
      setMensagem(`Erro ao finalizar venda: ${String(e)}`)
    }
  }

  const cancelar = async () => {
    if (editandoId == null) return
    const ok = window.confirm('Cancelar esta venda?')
    if (!ok) return
    try {
      setMensagem('Cancelando venda...')
      const detalhe = await cancelarVenda(editandoId)
      preencherFormulario(detalhe)
      await carregar()
      setMensagem('Venda cancelada com sucesso.')
    } catch (e) {
      console.error(e)
      setMensagem(`Erro ao cancelar venda: ${String(e)}`)
    }
  }

  const podeEditar = statusAtual === 'DRAFT'

  return (
    <div className="erp-page">
      <div className="erp-page__container">
        <h2 className="erp-page__title">Vendas</h2>

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
          <section className="card" aria-labelledby="venda-form-heading">
            <div className="compras__itens-header">
              <h3 id="venda-form-heading" className="card__title" style={{ margin: 0 }}>
                {editandoId != null ? `Venda #${editandoId}` : 'Nova venda'}
              </h3>
              <span className={statusClass(statusAtual)}>{statusLabel(statusAtual)}</span>
            </div>
            {statusAtual === 'COMPLETED' && contaReceberId != null && (
              <p className="vendas__conta-receber-hint" role="status">
                Conta a receber #{contaReceberId} gerada para esta venda.
              </p>
            )}

            {editandoId != null && auditoriaVenda != null ? (
              <AuditoriaMeta auditoria={auditoriaVenda} titulo="Auditoria da venda" />
            ) : null}

            <form className="produto-form" onSubmit={salvar}>
              <div className="form-field">
                <label className="form-label" htmlFor="venda-cliente">
                  Cliente
                </label>
                <select
                  id="venda-cliente"
                  className="form-input"
                  value={clienteId}
                  onChange={e => setClienteId(e.target.value)}
                  required
                  disabled={!podeEditar}
                >
                  {clientes.length === 0 && <option value="">Nenhum cliente</option>}
                  {clientes.map(c => (
                    <option key={c.id} value={String(c.id)}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="venda-data">
                  Data
                </label>
                <input
                  id="venda-data"
                  className="form-input"
                  type="date"
                  value={dataVenda}
                  onChange={e => setDataVenda(e.target.value)}
                  required
                  disabled={!podeEditar}
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="venda-obs">
                  Observações
                </label>
                <textarea
                  id="venda-obs"
                  className="form-input"
                  value={observacoes}
                  onChange={e => setObservacoes(e.target.value)}
                  disabled={!podeEditar}
                />
              </div>

              <div className="compras__itens-header">
                <strong className="compras__itens-total">Total (UI): {totalVenda.toFixed(2)}</strong>
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
                        <th scope="col" className="data-table__num">Quantidade</th>
                        <th scope="col" className="data-table__num">Preço unitário</th>
                        <th scope="col" className="data-table__num">Subtotal</th>
                        <th scope="col">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itens.map((it, idx) => {
                        const q = Number(it.quantidade)
                        const u = Number(it.precoUnitario)
                        const sub = Number.isFinite(q) && Number.isFinite(u) ? q * u : 0
                        return (
                          <tr key={idx}>
                            <td>
                              <select
                                className="form-input"
                                value={it.produtoId}
                                onChange={e => atualizarItem(idx, { produtoId: e.target.value })}
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
                                onChange={e => atualizarItem(idx, { quantidade: e.target.value })}
                                disabled={!podeEditar}
                              />
                            </td>
                            <td className="data-table__num">
                              <input
                                className="form-input"
                                type="number"
                                min={0}
                                step="0.01"
                                value={it.precoUnitario}
                                onChange={e => atualizarItem(idx, { precoUnitario: e.target.value })}
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
                <button type="button" className="btn btn--secondary" onClick={limparFormulario}>
                  Nova venda
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

          <section className="card" aria-labelledby="vendas-lista-heading">
            <h3 id="vendas-lista-heading" className="card__title">
              Vendas registradas
            </h3>
            {vendas.length === 0 ? (
              <p className="table-empty">Nenhuma venda encontrada.</p>
            ) : (
              <div className="table-wrap">
                <table className="data-table" style={{ minWidth: 720 }}>
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Cliente</th>
                      <th scope="col">Data</th>
                      <th scope="col">Status</th>
                      <th scope="col" className="data-table__num">Total</th>
                      <th scope="col">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendas.map(v => (
                      <tr key={v.id}>
                        <td>{v.id}</td>
                        <td>{v.clienteNome ?? '—'}</td>
                        <td>{v.dataVenda ? new Date(v.dataVenda).toLocaleDateString('pt-BR') : '—'}</td>
                        <td>
                          <span className={statusClass(v.status)}>{statusLabel(v.status)}</span>
                        </td>
                        <td className="data-table__num">{Number(v.valorTotal ?? 0).toFixed(2)}</td>
                        <td className="data-table__actions">
                          <div className="table-actions">
                            <button
                              type="button"
                              className="btn btn--secondary btn--small"
                              onClick={() => void carregarParaEdicao(v.id)}
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

