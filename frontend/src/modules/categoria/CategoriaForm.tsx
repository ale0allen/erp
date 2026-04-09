type CategoriaFormProps = {
  editandoId: number | null
  nome: string
  setNome: (v: string) => void
  ativo: boolean
  setAtivo: (v: boolean) => void
  onSubmit: (e: React.FormEvent) => void
  onCancelarEdicao: () => void
}

export function CategoriaForm({
  editandoId,
  nome,
  setNome,
  ativo,
  setAtivo,
  onSubmit,
  onCancelarEdicao
}: CategoriaFormProps) {
  return (
    <form className="produto-form" onSubmit={onSubmit}>
      {editandoId != null && (
        <p className="produto-form__edit-banner">
          <span>Editando categoria ID {editandoId}</span>
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
        <label className="form-label" htmlFor="categoria-nome">
          Nome
        </label>
        <input
          id="categoria-nome"
          className="form-input"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
          autoComplete="off"
        />
      </div>

      <div className="form-field form-field--checkbox">
        <input
          id="categoria-ativo"
          className="form-input form-input--checkbox"
          type="checkbox"
          checked={ativo}
          onChange={e => setAtivo(e.target.checked)}
        />
        <label className="form-label" htmlFor="categoria-ativo">
          Ativo
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn--primary">
          {editandoId != null ? 'Atualizar' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}
