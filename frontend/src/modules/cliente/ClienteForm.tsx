type ClienteFormProps = {
  editandoId: number | null
  nome: string
  setNome: (v: string) => void
  documento: string
  setDocumento: (v: string) => void
  email: string
  setEmail: (v: string) => void
  telefone: string
  setTelefone: (v: string) => void
  nomeContato: string
  setNomeContato: (v: string) => void
  ativo: boolean
  setAtivo: (v: boolean) => void
  observacoes: string
  setObservacoes: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCancelarEdicao: () => void
}

export function ClienteForm({
  editandoId,
  nome,
  setNome,
  documento,
  setDocumento,
  email,
  setEmail,
  telefone,
  setTelefone,
  nomeContato,
  setNomeContato,
  ativo,
  setAtivo,
  observacoes,
  setObservacoes,
  onSubmit,
  onCancelarEdicao
}: ClienteFormProps) {
  return (
    <form className="produto-form" onSubmit={onSubmit}>
      {editandoId != null && (
        <p className="produto-form__edit-banner">
          <span>Editando cliente ID {editandoId}</span>
          <button
            type="button"
            className="btn btn--secondary btn--small"
            onClick={onCancelarEdicao}
          >
            Cancelar edição
          </button>
        </p>
      )}

      <div className="form-field">
        <label className="form-label" htmlFor="cliente-nome">
          Nome
        </label>
        <input
          id="cliente-nome"
          className="form-input"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
          autoComplete="off"
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="cliente-documento">
          Documento
        </label>
        <input
          id="cliente-documento"
          className="form-input"
          value={documento}
          onChange={e => setDocumento(e.target.value)}
          autoComplete="off"
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="cliente-email">
          Email
        </label>
        <input
          id="cliente-email"
          className="form-input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="off"
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="cliente-telefone">
          Telefone
        </label>
        <input
          id="cliente-telefone"
          className="form-input"
          value={telefone}
          onChange={e => setTelefone(e.target.value)}
          autoComplete="off"
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="cliente-contato">
          Nome do contato
        </label>
        <input
          id="cliente-contato"
          className="form-input"
          value={nomeContato}
          onChange={e => setNomeContato(e.target.value)}
          autoComplete="off"
        />
      </div>

      <div className="form-field form-field--checkbox">
        <input
          id="cliente-ativo"
          className="form-input form-input--checkbox"
          type="checkbox"
          checked={ativo}
          onChange={e => setAtivo(e.target.checked)}
        />
        <label className="form-label" htmlFor="cliente-ativo">
          Ativo
        </label>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="cliente-observacoes">
          Observações
        </label>
        <textarea
          id="cliente-observacoes"
          className="form-input"
          value={observacoes}
          onChange={e => setObservacoes(e.target.value)}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn--primary">
          {editandoId != null ? 'Atualizar' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}

