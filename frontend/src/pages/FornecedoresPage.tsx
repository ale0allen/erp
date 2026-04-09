import { useEffect, useState } from 'react'

import { FornecedorForm } from '../modules/fornecedor/FornecedorForm'
import { FornecedorTable } from '../modules/fornecedor/FornecedorTable'
import {
  atualizarFornecedor,
  criarFornecedor,
  fetchFornecedores,
  removerFornecedor
} from '../modules/fornecedor/fornecedorService'
import type { Fornecedor } from '../modules/fornecedor/fornecedor.types'
import { getStatusMessageClass } from '../utils/statusMessage'

export function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [nome, setNome] = useState('')
  const [documento, setDocumento] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [nomeContato, setNomeContato] = useState('')
  const [ativo, setAtivo] = useState(true)
  const [observacoes, setObservacoes] = useState('')
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [mensagem, setMensagem] = useState('')

  const carregarFornecedores = async () => {
    try {
      const data = await fetchFornecedores()
      setFornecedores(data)
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error)
      setMensagem(`Erro ao buscar fornecedores: ${String(error)}`)
    }
  }

  useEffect(() => {
    carregarFornecedores()
  }, [])

  const limparFormulario = () => {
    setNome('')
    setDocumento('')
    setEmail('')
    setTelefone('')
    setNomeContato('')
    setAtivo(true)
    setObservacoes('')
    setEditandoId(null)
  }

  const iniciarEdicao = (f: Fornecedor) => {
    setEditandoId(f.id)
    setNome(f.nome ?? '')
    setDocumento(f.documento ?? '')
    setEmail(f.email ?? '')
    setTelefone(f.telefone ?? '')
    setNomeContato(f.nomeContato ?? '')
    setAtivo(Boolean(f.ativo))
    setObservacoes(f.observacoes ?? '')
    setMensagem('')
  }

  const excluirFornecedor = async (f: Fornecedor) => {
    const ok = window.confirm(
      `Excluir o fornecedor \"${f.nome}\"? Esta ação não pode ser desfeita.`
    )
    if (!ok) {
      return
    }

    try {
      setMensagem('Excluindo fornecedor...')
      await removerFornecedor(f.id)
      if (editandoId === f.id) {
        limparFormulario()
      }
      await carregarFornecedores()
      setMensagem('Fornecedor excluído com sucesso.')
    } catch (error) {
      console.error('Erro ao excluir fornecedor:', error)
      setMensagem(`Erro ao excluir fornecedor: ${String(error)}`)
    }
  }

  const salvarFornecedor = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nome.trim()) {
      setMensagem('Nome é obrigatório.')
      return
    }

    try {
      setMensagem(editandoId != null ? 'Atualizando fornecedor...' : 'Salvando fornecedor...')

      const payload = {
        nome: nome.trim(),
        documento: documento.trim() ? documento.trim() : null,
        email: email.trim() ? email.trim() : null,
        telefone: telefone.trim() ? telefone.trim() : null,
        nomeContato: nomeContato.trim() ? nomeContato.trim() : null,
        ativo,
        observacoes: observacoes.trim() ? observacoes.trim() : null
      }

      const criando = editandoId == null
      if (criando) {
        await criarFornecedor(payload)
      } else {
        await atualizarFornecedor(editandoId, payload)
      }

      limparFormulario()
      await carregarFornecedores()
      setMensagem(criando ? 'Fornecedor salvo com sucesso.' : 'Fornecedor atualizado com sucesso.')
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error)
      setMensagem(`Erro ao salvar fornecedor: ${String(error)}`)
    }
  }

  return (
    <div className="erp-page">
      <div className="erp-page__container">
        <h2 className="erp-page__title">Fornecedores</h2>

        {mensagem && (
          <p className={getStatusMessageClass(mensagem)} role="status">
            {mensagem}
          </p>
        )}

        <section className="card" aria-labelledby="form-fornecedor-heading">
          <h3 id="form-fornecedor-heading" className="card__title">
            {editandoId != null ? 'Editar fornecedor' : 'Novo fornecedor'}
          </h3>
          <FornecedorForm
            editandoId={editandoId}
            nome={nome}
            setNome={setNome}
            documento={documento}
            setDocumento={setDocumento}
            email={email}
            setEmail={setEmail}
            telefone={telefone}
            setTelefone={setTelefone}
            nomeContato={nomeContato}
            setNomeContato={setNomeContato}
            ativo={ativo}
            setAtivo={setAtivo}
            observacoes={observacoes}
            setObservacoes={setObservacoes}
            onSubmit={salvarFornecedor}
            onCancelarEdicao={limparFormulario}
          />
        </section>

        <section className="card" aria-labelledby="lista-fornecedores-heading">
          <h3 id="lista-fornecedores-heading" className="card__title">
            Lista de fornecedores
          </h3>
          <FornecedorTable
            fornecedores={fornecedores}
            onEditar={iniciarEdicao}
            onExcluir={excluirFornecedor}
          />
        </section>
      </div>
    </div>
  )
}

