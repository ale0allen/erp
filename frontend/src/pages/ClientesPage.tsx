import { useEffect, useState } from 'react'

import { useAuth } from '../auth/AuthContext'
import { podeGerenciarCadastros } from '../auth/permissions'
import { ClienteForm } from '../modules/cliente/ClienteForm'
import { ClienteTable } from '../modules/cliente/ClienteTable'
import {
  atualizarCliente,
  criarCliente,
  fetchClientes,
  removerCliente
} from '../modules/cliente/clienteService'
import type { Cliente } from '../modules/cliente/cliente.types'
import { getStatusMessageClass } from '../utils/statusMessage'

export function ClientesPage() {
  const { user } = useAuth()
  const podeEditar = podeGerenciarCadastros(user)

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [nome, setNome] = useState('')
  const [documento, setDocumento] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [nomeContato, setNomeContato] = useState('')
  const [ativo, setAtivo] = useState(true)
  const [observacoes, setObservacoes] = useState('')
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [mensagem, setMensagem] = useState('')

  const carregarClientes = async () => {
    try {
      const data = await fetchClientes()
      setClientes(data)
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
      setMensagem(`Erro ao buscar clientes: ${String(error)}`)
    }
  }

  useEffect(() => {
    carregarClientes()
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

  const iniciarEdicao = (c: Cliente) => {
    setEditandoId(c.id)
    setNome(c.nome ?? '')
    setDocumento(c.documento ?? '')
    setEmail(c.email ?? '')
    setTelefone(c.telefone ?? '')
    setNomeContato(c.nomeContato ?? '')
    setAtivo(Boolean(c.ativo))
    setObservacoes(c.observacoes ?? '')
    setMensagem('')
  }

  const excluirCliente = async (c: Cliente) => {
    const ok = window.confirm(
      `Excluir o cliente "${c.nome}"? Esta ação não pode ser desfeita.`
    )
    if (!ok) {
      return
    }

    try {
      setMensagem('Excluindo cliente...')
      await removerCliente(c.id)

      if (editandoId === c.id) {
        limparFormulario()
      }

      await carregarClientes()
      setMensagem('Cliente excluído com sucesso.')
    } catch (error) {
      console.error('Erro ao excluir cliente:', error)
      setMensagem(`Erro ao excluir cliente: ${String(error)}`)
    }
  }

  const salvarCliente = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nome.trim()) {
      setMensagem('Nome é obrigatório.')
      return
    }

    try {
      setMensagem(editandoId != null ? 'Atualizando cliente...' : 'Salvando cliente...')

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
        await criarCliente(payload)
      } else {
        await atualizarCliente(editandoId, payload)
      }

      limparFormulario()
      await carregarClientes()
      setMensagem(criando ? 'Cliente salvo com sucesso.' : 'Cliente atualizado com sucesso.')
    } catch (error) {
      console.error('Erro ao salvar cliente:', error)
      setMensagem(`Erro ao salvar cliente: ${String(error)}`)
    }
  }

  return (
    <div className="erp-page">
      <div className="erp-page__container">
        <h2 className="erp-page__title">Clientes</h2>

        {mensagem && (
          <p className={getStatusMessageClass(mensagem)} role="status">
            {mensagem}
          </p>
        )}

        {podeEditar ? (
          <section className="card" aria-labelledby="form-cliente-heading">
            <h3 id="form-cliente-heading" className="card__title">
              {editandoId != null ? 'Editar cliente' : 'Novo cliente'}
            </h3>
            <ClienteForm
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
              onSubmit={salvarCliente}
              onCancelarEdicao={limparFormulario}
            />
          </section>
        ) : (
          <p className="status-message" role="status">
            Perfil <strong>operador</strong>: consulta de clientes para uso em vendas.
          </p>
        )}

        <section className="card" aria-labelledby="lista-clientes-heading">
          <h3 id="lista-clientes-heading" className="card__title">
            Lista de clientes
          </h3>
          <ClienteTable
            clientes={clientes}
            onEditar={iniciarEdicao}
            onExcluir={excluirCliente}
            somenteLeitura={!podeEditar}
          />
        </section>
      </div>
    </div>
  )
}

