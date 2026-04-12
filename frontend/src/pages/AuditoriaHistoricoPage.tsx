import { useCallback, useEffect, useState } from 'react'

import { fetchUsuariosParaSelect } from '../modules/usuario/usuarioAdminService'
import type { UsuarioAdmin } from '../modules/usuario/usuarioAdmin.types'
import { fetchHistoricoAuditoria } from '../modules/auditoria/auditoriaHistoricoService'
import {
  AUDITORIA_ACAO_OPTIONS,
  AUDITORIA_MODULO_OPTIONS,
  type AuditoriaHistoricoFiltros,
  type HistoricoAuditoriaItem,
  type PageHistoricoAuditoria
} from '../modules/auditoria/auditoriaHistorico.types'
import '../styles/auditoria-historico.css'
import { formatarDataHora } from '../utils/formatDateTime'
import { getStatusMessageClass } from '../utils/statusMessage'

function labelModulo(codigo: string): string {
  const o = AUDITORIA_MODULO_OPTIONS.find(x => x.value === codigo)
  return o && o.value !== '' ? o.label : codigo
}

function labelAcao(codigo: string): string {
  const o = AUDITORIA_ACAO_OPTIONS.find(x => x.value === codigo)
  return o && o.value !== '' ? o.label : codigo
}

const FILTROS_VAZIOS: AuditoriaHistoricoFiltros = {
  usuarioId: '',
  modulo: '',
  acao: '',
  inicio: '',
  fim: ''
}

export function AuditoriaHistoricoPage() {
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([])
  const [formFiltros, setFormFiltros] = useState<AuditoriaHistoricoFiltros>({ ...FILTROS_VAZIOS })
  const [aplicados, setAplicados] = useState<AuditoriaHistoricoFiltros>({ ...FILTROS_VAZIOS })

  const [dados, setDados] = useState<PageHistoricoAuditoria | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [mensagem, setMensagem] = useState('')

  const carregarUsuarios = useCallback(async () => {
    try {
      const lista = await fetchUsuariosParaSelect()
      setUsuarios(Array.isArray(lista) ? lista : [])
    } catch (e) {
      console.error(e)
      setUsuarios([])
    }
  }, [])

  const buscar = useCallback(
    async (page: number, filtros: AuditoriaHistoricoFiltros) => {
      setCarregando(true)
      setMensagem('')
      try {
        const p = await fetchHistoricoAuditoria(filtros, page)
        setDados(p)
      } catch (e) {
        console.error(e)
        setMensagem(`Erro ao carregar histórico: ${String(e)}`)
        setDados(null)
      } finally {
        setCarregando(false)
      }
    },
    []
  )

  useEffect(() => {
    void carregarUsuarios()
  }, [carregarUsuarios])

  useEffect(() => {
    void buscar(0, FILTROS_VAZIOS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const aoBuscar = (e: React.FormEvent) => {
    e.preventDefault()
    const next = { ...formFiltros }
    setAplicados(next)
    void buscar(0, next)
  }

  const aoLimpar = () => {
    setFormFiltros({ ...FILTROS_VAZIOS })
    setAplicados({ ...FILTROS_VAZIOS })
    void buscar(0, FILTROS_VAZIOS)
  }

  const linhas: HistoricoAuditoriaItem[] = dados?.content ?? []

  return (
    <div className="erp-page">
      <div className="erp-page__container">
        <h2 className="erp-page__title">Histórico de auditoria</h2>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.9375rem', lineHeight: 1.5 }}>
          Registro de ações relevantes (usuários, configurações, compras e vendas finalizadas). Somente
          administradores.
        </p>

        {mensagem && (
          <p className={getStatusMessageClass(mensagem)} role="status">
            {mensagem}
          </p>
        )}

        <section className="card" aria-labelledby="auditoria-filtros-heading">
          <h3 id="auditoria-filtros-heading" className="card__title">
            Filtros
          </h3>
          <form className="produto-form" onSubmit={aoBuscar}>
            <div className="auditoria-filtros">
              <div className="form-field">
                <label className="form-label" htmlFor="filtro-usuario">
                  Usuário (autor)
                </label>
                <select
                  id="filtro-usuario"
                  className="form-input"
                  value={formFiltros.usuarioId === '' ? '' : String(formFiltros.usuarioId)}
                  onChange={e =>
                    setFormFiltros(f => ({
                      ...f,
                      usuarioId: e.target.value === '' ? '' : Number(e.target.value)
                    }))
                  }
                >
                  <option value="">Todos</option>
                  {(Array.isArray(usuarios) ? usuarios : []).map(u => (
                    <option key={u.id} value={u.id}>
                      {u.nome} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="filtro-modulo">
                  Módulo
                </label>
                <select
                  id="filtro-modulo"
                  className="form-input"
                  value={formFiltros.modulo}
                  onChange={e => setFormFiltros(f => ({ ...f, modulo: e.target.value }))}
                >
                  {AUDITORIA_MODULO_OPTIONS.map(o => (
                    <option key={o.value || 'all'} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="filtro-acao">
                  Ação
                </label>
                <select
                  id="filtro-acao"
                  className="form-input"
                  value={formFiltros.acao}
                  onChange={e => setFormFiltros(f => ({ ...f, acao: e.target.value }))}
                >
                  {AUDITORIA_ACAO_OPTIONS.map(o => (
                    <option key={o.value || 'all-a'} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="filtro-inicio">
                  Data/hora inicial
                </label>
                <input
                  id="filtro-inicio"
                  className="form-input"
                  type="datetime-local"
                  value={formFiltros.inicio}
                  onChange={e => setFormFiltros(f => ({ ...f, inicio: e.target.value }))}
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="filtro-fim">
                  Data/hora final
                </label>
                <input
                  id="filtro-fim"
                  className="form-input"
                  type="datetime-local"
                  value={formFiltros.fim}
                  onChange={e => setFormFiltros(f => ({ ...f, fim: e.target.value }))}
                />
              </div>

              <div className="auditoria-filtros__actions">
                <button type="submit" className="btn btn--primary">
                  Buscar
                </button>
                <button type="button" className="btn btn--secondary" onClick={aoLimpar}>
                  Limpar filtros
                </button>
              </div>
            </div>
          </form>
        </section>

        <section className="card" aria-labelledby="auditoria-tabela-heading">
          <h3 id="auditoria-tabela-heading" className="card__title">
            Registros
          </h3>

          {carregando && (
            <p className="status-message status-message--loading" role="status">
              Carregando...
            </p>
          )}

          {!carregando && linhas.length === 0 && (
            <p className="table-empty">Nenhum registro encontrado com os filtros atuais.</p>
          )}

          {!carregando && linhas.length > 0 && (
            <>
              <div className="table-wrap">
                <table className="data-table" style={{ minWidth: 720 }}>
                  <thead>
                    <tr>
                      <th scope="col">Data/hora</th>
                      <th scope="col">Usuário</th>
                      <th scope="col">Módulo</th>
                      <th scope="col">Ação</th>
                      <th scope="col">Descrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    {linhas.map(row => (
                      <tr key={row.id}>
                        <td>{formatarDataHora(row.performedAt)}</td>
                        <td>
                          {row.performedByUserName?.trim()
                            ? row.performedByUserName
                            : row.performedByUserId != null
                              ? `Usuário #${row.performedByUserId}`
                              : '—'}
                        </td>
                        <td>{labelModulo(row.module)}</td>
                        <td>{labelAcao(row.action)}</td>
                        <td>{row.description?.trim() ? row.description : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {dados != null && dados.totalPages > 1 && (
                <div className="auditoria-paginacao">
                  <span>
                    Página {dados.page + 1} de {dados.totalPages} ({dados.totalElements} registros)
                  </span>
                  <div className="auditoria-paginacao__nav">
                    <button
                      type="button"
                      className="btn btn--secondary btn--small"
                      disabled={dados.page <= 0}
                      onClick={() => void buscar(dados.page - 1, aplicados)}
                    >
                      Anterior
                    </button>
                    <button
                      type="button"
                      className="btn btn--secondary btn--small"
                      disabled={dados.last}
                      onClick={() => void buscar(dados.page + 1, aplicados)}
                    >
                      Próxima
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}
