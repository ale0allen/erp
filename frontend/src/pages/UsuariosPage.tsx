import { useCallback, useEffect, useState } from 'react'

import { AuditoriaMeta } from '../components/AuditoriaMeta'
import {
  atualizarUsuario,
  criarUsuario,
  fetchPerfisDisponiveis,
  fetchUsuarios
} from '../modules/usuario/usuarioAdminService'
import type { PerfilOption, UsuarioAdmin } from '../modules/usuario/usuarioAdmin.types'
import '../styles/usuarios.css'
import { formatarDataHora } from '../utils/formatDateTime'
import { getStatusMessageClass } from '../utils/statusMessage'

function perfilLabel(nome: string): string {
  if (nome === 'ADMIN') return 'Administrador'
  if (nome === 'MANAGER') return 'Gestor'
  if (nome === 'OPERATOR') return 'Operador'
  return nome
}

function validarEmail(email: string): boolean {
  const t = email.trim()
  if (t === '') return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)
}

const PAGE_SIZE = 20

export function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([])
  const [opcoesPerfil, setOpcoesPerfil] = useState<PerfilOption[]>([])
  const [carregando, setCarregando] = useState(true)
  const [mensagem, setMensagem] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [ativo, setAtivo] = useState(true)
  const [perfisSelecionados, setPerfisSelecionados] = useState<Set<string>>(new Set())

  const carregar = useCallback(async (pageIndex: number) => {
    setCarregando(true)
    try {
      const [res, perfis] = await Promise.all([
        fetchUsuarios({ page: pageIndex, size: PAGE_SIZE }),
        fetchPerfisDisponiveis()
      ])
      setUsuarios(Array.isArray(res.content) ? res.content : [])
      setPage(typeof res.page === 'number' ? res.page : pageIndex)
      setTotalPages(typeof res.totalPages === 'number' ? res.totalPages : 0)
      setTotalElements(typeof res.totalElements === 'number' ? res.totalElements : 0)
      setOpcoesPerfil(Array.isArray(perfis) ? perfis : [])
      setMensagem('')
    } catch (e) {
      console.error(e)
      setUsuarios([])
      setMensagem(`Erro ao carregar dados: ${String(e)}`)
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    void carregar(0)
  }, [carregar])

  const limparFormulario = () => {
    setEditandoId(null)
    setNome('')
    setEmail('')
    setUsername('')
    setPassword('')
    setAtivo(true)
    setPerfisSelecionados(new Set())
  }

  const iniciarCriacao = () => {
    limparFormulario()
    if (opcoesPerfil.length > 0) {
      setPerfisSelecionados(new Set([opcoesPerfil[0].nome]))
    }
    setMensagem('')
  }

  const iniciarEdicao = (u: UsuarioAdmin) => {
    setEditandoId(u.id)
    setNome(u.nome)
    setEmail(u.email)
    setUsername(u.username ?? '')
    setPassword('')
    setAtivo(u.ativo)
    setPerfisSelecionados(new Set(u.perfis))
    setMensagem('')
  }

  const togglePerfil = (nomePerfil: string) => {
    setPerfisSelecionados(prev => {
      const next = new Set(prev)
      if (next.has(nomePerfil)) {
        next.delete(nomePerfil)
      } else {
        next.add(nomePerfil)
      }
      return next
    })
  }

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensagem('')

    if (!nome.trim()) {
      setMensagem('Informe o nome.')
      return
    }
    if (!validarEmail(email)) {
      setMensagem('Informe um e-mail válido.')
      return
    }
    const perfis = Array.from(perfisSelecionados)
    if (perfis.length === 0) {
      setMensagem('Selecione ao menos um perfil.')
      return
    }

    const criando = editandoId == null
    if (criando) {
      if (password.length < 6) {
        setMensagem('A senha deve ter no mínimo 6 caracteres.')
        return
      }
    } else if (password !== '' && password.length < 6) {
      setMensagem('A nova senha deve ter no mínimo 6 caracteres.')
      return
    }

    try {
      setMensagem(criando ? 'Criando usuário...' : 'Salvando usuário...')
      if (criando) {
        await criarUsuario({
          nome: nome.trim(),
          email: email.trim(),
          username: username.trim() ? username.trim() : null,
          password,
          perfis,
          ativo
        })
      } else {
        await atualizarUsuario(editandoId, {
          nome: nome.trim(),
          email: email.trim(),
          username: username.trim() ? username.trim() : null,
          ativo,
          perfis,
          password: password.trim() ? password.trim() : null
        })
      }
      limparFormulario()
      await carregar(page)
      setMensagem(criando ? 'Usuário criado com sucesso.' : 'Usuário atualizado com sucesso.')
    } catch (err) {
      console.error(err)
      setMensagem(`Erro: ${String(err)}`)
    }
  }

  const usuarioEmEdicao =
    editandoId != null ? usuarios.find(u => u.id === editandoId) : undefined

  return (
    <div className="erp-page">
      <div className="erp-page__container">
        <h2 className="erp-page__title">Usuários</h2>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.9375rem', lineHeight: 1.5 }}>
          Cadastro de usuários, perfis de acesso e situação. Apenas administradores podem acessar
          esta tela.
        </p>

        {mensagem && (
          <p className={getStatusMessageClass(mensagem)} role="status">
            {mensagem}
          </p>
        )}

        {carregando && (
          <p className="status-message status-message--loading" role="status">
            Carregando usuários...
          </p>
        )}

        <section className="card" aria-labelledby="usuarios-form-heading">
          <h3 id="usuarios-form-heading" className="card__title">
            {editandoId != null ? `Editar usuário #${editandoId}` : 'Novo usuário'}
          </h3>

          {editandoId != null && usuarioEmEdicao?.auditoria != null ? (
            <AuditoriaMeta
              auditoria={usuarioEmEdicao.auditoria}
              titulo="Auditoria do cadastro"
            />
          ) : null}

          <form className="produto-form" onSubmit={salvar}>
            <div className="form-field">
              <label className="form-label" htmlFor="usuario-nome">
                Nome
              </label>
              <input
                id="usuario-nome"
                className="form-input"
                value={nome}
                onChange={e => setNome(e.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="usuario-email">
                E-mail (login)
              </label>
              <input
                id="usuario-email"
                className="form-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="usuario-username">
                Nome de usuário (opcional)
              </label>
              <input
                id="usuario-username"
                className="form-input"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="usuario-senha">
                {editandoId != null ? 'Nova senha (opcional)' : 'Senha'}
              </label>
              <input
                id="usuario-senha"
                className="form-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete={editandoId != null ? 'new-password' : 'new-password'}
                placeholder={editandoId != null ? 'Deixe em branco para manter a senha atual' : ''}
              />
            </div>

            <div className="form-field form-field--checkbox">
              <input
                id="usuario-ativo"
                className="form-input form-input--checkbox"
                type="checkbox"
                checked={ativo}
                onChange={e => setAtivo(e.target.checked)}
              />
              <label className="form-label" htmlFor="usuario-ativo">
                Usuário ativo
              </label>
            </div>

            <div className="form-field">
              <span className="form-label">Perfis</span>
              <ul className="usuarios__perfis-grid" aria-label="Perfis do usuário">
                {opcoesPerfil.map(p => (
                  <li key={p.id} className="usuarios__perfil-item">
                    <input
                      id={`perfil-${p.nome}`}
                      type="checkbox"
                      className="form-input form-input--checkbox"
                      checked={perfisSelecionados.has(p.nome)}
                      onChange={() => togglePerfil(p.nome)}
                    />
                    <label htmlFor={`perfil-${p.nome}`}>{perfilLabel(p.nome)}</label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn--primary">
                {editandoId != null ? 'Salvar alterações' : 'Criar usuário'}
              </button>
              {editandoId != null ? (
                <button type="button" className="btn btn--secondary" onClick={limparFormulario}>
                  Cancelar edição
                </button>
              ) : null}
              <button type="button" className="btn btn--secondary" onClick={iniciarCriacao}>
                Limpar / novo
              </button>
            </div>
          </form>
        </section>

        <section className="card" aria-labelledby="usuarios-lista-heading">
          <h3 id="usuarios-lista-heading" className="card__title">
            Lista de usuários
          </h3>

          {!carregando && usuarios.length === 0 ? (
            <p className="table-empty">Nenhum usuário encontrado.</p>
          ) : (
            <div className="table-wrap usuarios__table-wrap">
              <table className="data-table" style={{ minWidth: 640 }}>
                <thead>
                  <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">E-mail</th>
                    <th scope="col">Usuário</th>
                    <th scope="col">Situação</th>
                    <th scope="col">Perfis</th>
                    <th scope="col">Criado em</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(usuarios) ? usuarios : []).map(u => (
                    <tr key={u.id}>
                      <td>{u.nome}</td>
                      <td>{u.email}</td>
                      <td>{u.username?.trim() ? u.username : '—'}</td>
                      <td>
                        <span
                          className={
                            u.ativo
                              ? 'usuarios__status usuarios__status--ativo'
                              : 'usuarios__status usuarios__status--inativo'
                          }
                        >
                          {u.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        {!Array.isArray(u.perfis) || u.perfis.length === 0
                          ? '—'
                          : u.perfis.map(perfilLabel).join(', ')}
                      </td>
                      <td>{formatarDataHora(u.auditoria?.criadoEm)}</td>
                      <td>
                        <div className="usuarios__table-actions">
                          <button
                            type="button"
                            className="btn btn--secondary btn--small"
                            onClick={() => iniciarEdicao(u)}
                          >
                            Editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!carregando && totalPages > 1 ? (
            <div className="usuarios__paginacao">
              <p className="usuarios__paginacao-meta">
                Página {page + 1} de {totalPages} ({totalElements} usuários)
              </p>
              <div className="usuarios__paginacao-nav">
                <button
                  type="button"
                  className="btn btn--secondary btn--small"
                  disabled={page <= 0}
                  onClick={() => void carregar(page - 1)}
                >
                  Anterior
                </button>
                <button
                  type="button"
                  className="btn btn--secondary btn--small"
                  disabled={page >= totalPages - 1}
                  onClick={() => void carregar(page + 1)}
                >
                  Próxima
                </button>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}
