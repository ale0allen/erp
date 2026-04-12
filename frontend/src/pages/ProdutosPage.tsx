import { useEffect, useMemo, useState } from 'react'

import { AuditoriaMeta } from '../components/AuditoriaMeta'

import { useAuth } from '../auth/AuthContext'
import { podeGerenciarCadastros } from '../auth/permissions'
import { fetchCategorias } from '../modules/categoria/categoriaService'
import {
  atualizarProduto,
  criarProduto,
  fetchProdutos,
  removerProduto
} from '../modules/produto/produtoService'
import { ProdutoForm } from '../modules/produto/ProdutoForm'
import { ProdutoTable } from '../modules/produto/ProdutoTable'
import type { Categoria } from '../modules/categoria/categoria.types'
import type { Produto } from '../modules/produto/produto.types'
import { getStatusMessageClass } from '../utils/statusMessage'

export function ProdutosPage() {
  const { user } = useAuth()
  const podeEditar = podeGerenciarCadastros(user)

  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [codigo, setCodigo] = useState('')
  const [nome, setNome] = useState('')
  const [precoCusto, setPrecoCusto] = useState('')
  const [precoVenda, setPrecoVenda] = useState('')
  const [estoqueMinimo, setEstoqueMinimo] = useState('0')
  const [ativo, setAtivo] = useState(true)
  const [categoriaId, setCategoriaId] = useState('')
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [mensagem, setMensagem] = useState('')

  const produtoEmEdicao = useMemo(
    () => (editandoId != null ? produtos.find(p => p.id === editandoId) : undefined),
    [editandoId, produtos]
  )

  const carregarCategorias = async () => {
    try {
      const data = await fetchCategorias()
      setCategorias(data)
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
      setMensagem(`Erro ao buscar categorias: ${String(error)}`)
    }
  }

  const carregarProdutos = async () => {
    try {
      const data = await fetchProdutos()
      setProdutos(data)
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      setMensagem(`Erro ao buscar produtos: ${String(error)}`)
    }
  }

  useEffect(() => {
    void carregarCategorias()
    void carregarProdutos()
  }, [])

  useEffect(() => {
    if (
      categorias.length > 0 &&
      categoriaId === '' &&
      editandoId === null
    ) {
      setCategoriaId(String(categorias[0].id))
    }
  }, [categorias, categoriaId, editandoId])

  const limparFormulario = () => {
    setCodigo('')
    setNome('')
    setPrecoCusto('')
    setPrecoVenda('')
    setEstoqueMinimo('0')
    setAtivo(true)
    setEditandoId(null)
    setCategoriaId(categorias[0] ? String(categorias[0].id) : '')
  }

  const iniciarEdicao = (produto: Produto) => {
    setEditandoId(produto.id)
    setCodigo(produto.codigo)
    setNome(produto.nome)
    setPrecoCusto(
      produto.precoCusto != null ? String(produto.precoCusto) : ''
    )
    setPrecoVenda(
      produto.precoVenda != null ? String(produto.precoVenda) : ''
    )
    setEstoqueMinimo(
      produto.estoqueMinimo != null ? String(produto.estoqueMinimo) : '0'
    )
    setAtivo(produto.ativo)
    setCategoriaId(String(produto.categoriaId))
    setMensagem('')
  }

  const excluirProduto = async (produto: Produto) => {
    const ok = window.confirm(
      `Excluir o produto "${produto.nome}" (código ${produto.codigo})? Esta ação não pode ser desfeita.`
    )
    if (!ok) {
      return
    }

    try {
      setMensagem('Excluindo produto...')

      await removerProduto(produto.id)

      if (editandoId === produto.id) {
        limparFormulario()
      }

      await carregarProdutos()
      setMensagem('Produto excluído com sucesso.')
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
      setMensagem(`Erro ao excluir produto: ${String(error)}`)
    }
  }

  const salvarProduto = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!codigo.trim() || !nome.trim()) {
      setMensagem('Código e nome são obrigatórios.')
      return
    }

    if (precoCusto === '' || precoVenda === '') {
      setMensagem('Preço de custo e preço de venda são obrigatórios.')
      return
    }

    if (Number(precoCusto) < 0 || Number(precoVenda) < 0) {
      setMensagem('Os preços não podem ser negativos.')
      return
    }

    if (estoqueMinimo === '' || Number(estoqueMinimo) < 0) {
      setMensagem('O estoque mínimo não pode ser negativo.')
      return
    }

    if (categoriaId === '') {
      setMensagem('Selecione uma categoria.')
      return
    }

    try {
      setMensagem(
        editandoId != null ? 'Atualizando produto...' : 'Salvando produto...'
      )

      const produto = {
        codigo: codigo.trim(),
        nome: nome.trim(),
        precoCusto: precoCusto === '' ? null : Number(precoCusto),
        precoVenda: precoVenda === '' ? null : Number(precoVenda),
        ativo,
        estoqueMinimo: Number(estoqueMinimo),
        categoriaId: Number(categoriaId)
      }

      const criando = editandoId == null
      if (criando) {
        await criarProduto(produto)
      } else {
        await atualizarProduto(editandoId, produto)
      }

      limparFormulario()
      setMensagem(
        criando ? 'Produto salvo com sucesso.' : 'Produto atualizado com sucesso.'
      )

      await carregarProdutos()
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
      setMensagem(`Erro ao salvar produto: ${String(error)}`)
    }
  }

  return (
    <div className="erp-page">
      <div className="erp-page__container">
        <h2 className="erp-page__title">Cadastro de produtos</h2>

        {mensagem && (
          <p
            className={getStatusMessageClass(mensagem)}
            role="status"
          >
            {mensagem}
          </p>
        )}

        {podeEditar ? (
          <section className="card" aria-labelledby="form-produto-heading">
            <h3 id="form-produto-heading" className="card__title">
              {editandoId != null ? 'Editar produto' : 'Novo produto'}
            </h3>
            {editandoId != null && produtoEmEdicao?.auditoria != null ? (
              <AuditoriaMeta
                auditoria={produtoEmEdicao.auditoria}
                titulo="Auditoria do produto"
              />
            ) : null}
            <ProdutoForm
              editandoId={editandoId}
              categorias={categorias}
              codigo={codigo}
              setCodigo={setCodigo}
              nome={nome}
              setNome={setNome}
              precoCusto={precoCusto}
              setPrecoCusto={setPrecoCusto}
              precoVenda={precoVenda}
              setPrecoVenda={setPrecoVenda}
              estoqueMinimo={estoqueMinimo}
              setEstoqueMinimo={setEstoqueMinimo}
              ativo={ativo}
              setAtivo={setAtivo}
              categoriaId={categoriaId}
              setCategoriaId={setCategoriaId}
              onSubmit={salvarProduto}
              onCancelarEdicao={limparFormulario}
            />
          </section>
        ) : (
          <p className="status-message" role="status">
            Perfil <strong>operador</strong>: consulta de produtos. Inclusão e edição são feitas por gestores ou
            administradores.
          </p>
        )}

        <section className="card" aria-labelledby="lista-produtos-heading">
          <h3 id="lista-produtos-heading" className="card__title">
            Lista de produtos
          </h3>
          <ProdutoTable
            produtos={produtos}
            onEditar={iniciarEdicao}
            onExcluir={excluirProduto}
            somenteLeitura={!podeEditar}
          />
        </section>
      </div>
    </div>
  )
}
