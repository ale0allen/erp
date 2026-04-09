import type { Categoria } from '../categoria/categoria.types'

type ProdutoFormProps = {
  editandoId: number | null
  categorias: Categoria[]
  codigo: string
  setCodigo: (v: string) => void
  nome: string
  setNome: (v: string) => void
  precoCusto: string
  setPrecoCusto: (v: string) => void
  precoVenda: string
  setPrecoVenda: (v: string) => void
  estoqueMinimo: string
  setEstoqueMinimo: (v: string) => void
  ativo: boolean
  setAtivo: (v: boolean) => void
  categoriaId: string
  setCategoriaId: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCancelarEdicao: () => void
}

export function ProdutoForm({
  editandoId,
  categorias,
  codigo,
  setCodigo,
  nome,
  setNome,
  precoCusto,
  setPrecoCusto,
  precoVenda,
  setPrecoVenda,
  estoqueMinimo,
  setEstoqueMinimo,
  ativo,
  setAtivo,
  categoriaId,
  setCategoriaId,
  onSubmit,
  onCancelarEdicao
}: ProdutoFormProps) {
  return (
    <form className="produto-form" onSubmit={onSubmit}>
      {editandoId != null && (
        <p className="produto-form__edit-banner">
          <span>Editando produto ID {editandoId}</span>
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
        <label className="form-label" htmlFor="produto-categoria">
          Categoria
        </label>
        <select
          id="produto-categoria"
          className="form-input"
          value={categoriaId}
          onChange={e => setCategoriaId(e.target.value)}
          required
        >
          <option value="">Selecione uma categoria</option>
          {categorias.map(c => (
            <option key={c.id} value={String(c.id)}>
              {c.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="produto-codigo">
          Código
        </label>
        <input
          id="produto-codigo"
          className="form-input"
          value={codigo}
          onChange={e => setCodigo(e.target.value)}
          required
          autoComplete="off"
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="produto-nome">
          Nome
        </label>
        <input
          id="produto-nome"
          className="form-input"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
          autoComplete="off"
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="produto-preco-custo">
          Preço de custo
        </label>
        <input
          id="produto-preco-custo"
          className="form-input"
          type="number"
          step="0.01"
          value={precoCusto}
          onChange={e => setPrecoCusto(e.target.value)}
          required
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="produto-preco-venda">
          Preço de venda
        </label>
        <input
          id="produto-preco-venda"
          className="form-input"
          type="number"
          step="0.01"
          value={precoVenda}
          onChange={e => setPrecoVenda(e.target.value)}
          required
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="produto-estoque-minimo">
          Estoque mínimo
        </label>
        <input
          id="produto-estoque-minimo"
          className="form-input"
          type="number"
          min={0}
          step={1}
          value={estoqueMinimo}
          onChange={e => setEstoqueMinimo(e.target.value)}
          required
        />
      </div>

      <div className="form-field form-field--checkbox">
        <input
          id="produto-ativo"
          className="form-input form-input--checkbox"
          type="checkbox"
          checked={ativo}
          onChange={e => setAtivo(e.target.checked)}
        />
        <label className="form-label" htmlFor="produto-ativo">
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
