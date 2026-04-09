import { useEffect, useState } from 'react'

import { CategoriaForm } from '../modules/categoria/CategoriaForm'
import { CategoriaTable } from '../modules/categoria/CategoriaTable'
import {
  atualizarCategoria,
  criarCategoria,
  fetchCategorias,
  removerCategoria
} from '../modules/categoria/categoriaService'
import type { Categoria } from '../modules/categoria/categoria.types'
import { getStatusMessageClass } from '../utils/statusMessage'

export function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [nome, setNome] = useState('')
  const [ativo, setAtivo] = useState(true)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [mensagem, setMensagem] = useState('')

  const carregarCategorias = async () => {
    try {
      const data = await fetchCategorias()
      setCategorias(data)
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
      setMensagem(`Erro ao buscar categorias: ${String(error)}`)
    }
  }

  useEffect(() => {
    carregarCategorias()
  }, [])

  const limparFormulario = () => {
    setNome('')
    setAtivo(true)
    setEditandoId(null)
  }

  const iniciarEdicao = (categoria: Categoria) => {
    setEditandoId(categoria.id)
    setNome(categoria.nome)
    setAtivo(categoria.ativo)
    setMensagem('')
  }

  const excluirCategoria = async (categoria: Categoria) => {
    const ok = window.confirm(
      `Excluir a categoria "${categoria.nome}"? Esta ação não pode ser desfeita.`
    )
    if (!ok) {
      return
    }

    try {
      setMensagem('Excluindo categoria...')

      await removerCategoria(categoria.id)

      if (editandoId === categoria.id) {
        limparFormulario()
      }

      await carregarCategorias()
      setMensagem('Categoria excluída com sucesso.')
    } catch (error) {
      console.error('Erro ao excluir categoria:', error)
      setMensagem(`Erro ao excluir categoria: ${String(error)}`)
    }
  }

  const salvarCategoria = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nome.trim()) {
      setMensagem('Nome é obrigatório.')
      return
    }

    try {
      setMensagem(
        editandoId != null ? 'Atualizando categoria...' : 'Salvando categoria...'
      )

      const payload = { nome: nome.trim(), ativo }

      const criando = editandoId == null
      if (criando) {
        await criarCategoria(payload)
      } else {
        await atualizarCategoria(editandoId, payload)
      }

      limparFormulario()
      setMensagem(
        criando
          ? 'Categoria salva com sucesso.'
          : 'Categoria atualizada com sucesso.'
      )

      await carregarCategorias()
    } catch (error) {
      console.error('Erro ao salvar categoria:', error)
      setMensagem(`Erro ao salvar categoria: ${String(error)}`)
    }
  }

  return (
    <div className="erp-page">
      <div className="erp-page__container">
        <h2 className="erp-page__title">Categorias</h2>

        {mensagem && (
          <p
            className={getStatusMessageClass(mensagem)}
            role="status"
          >
            {mensagem}
          </p>
        )}

        <section className="card" aria-labelledby="form-categoria-heading">
          <h3 id="form-categoria-heading" className="card__title">
            {editandoId != null ? 'Editar categoria' : 'Nova categoria'}
          </h3>
          <CategoriaForm
            editandoId={editandoId}
            nome={nome}
            setNome={setNome}
            ativo={ativo}
            setAtivo={setAtivo}
            onSubmit={salvarCategoria}
            onCancelarEdicao={limparFormulario}
          />
        </section>

        <section className="card" aria-labelledby="lista-categorias-heading">
          <h3 id="lista-categorias-heading" className="card__title">
            Lista de categorias
          </h3>
          <CategoriaTable
            categorias={categorias}
            onEditar={iniciarEdicao}
            onExcluir={excluirCategoria}
          />
        </section>
      </div>
    </div>
  )
}
