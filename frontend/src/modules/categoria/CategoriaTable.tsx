import type { Categoria } from './categoria.types'

type CategoriaTableProps = {
  categorias: Categoria[]
  onEditar: (categoria: Categoria) => void
  onExcluir: (categoria: Categoria) => void
  somenteLeitura?: boolean
}

export function CategoriaTable({
  categorias,
  onEditar,
  onExcluir,
  somenteLeitura = false
}: CategoriaTableProps) {
  if (categorias.length === 0) {
    return <p className="table-empty">Nenhuma categoria encontrada.</p>
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nome</th>
            <th scope="col">Ativo</th>
            {!somenteLeitura ? <th scope="col">Ações</th> : null}
          </tr>
        </thead>
        <tbody>
          {categorias.map(categoria => (
            <tr key={categoria.id}>
              <td>{categoria.id}</td>
              <td>{categoria.nome}</td>
              <td>{categoria.ativo ? 'Sim' : 'Não'}</td>
              {!somenteLeitura ? (
                <td className="data-table__actions">
                  <div className="table-actions">
                    <button
                      type="button"
                      className="btn btn--secondary btn--small"
                      onClick={() => onEditar(categoria)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn--danger btn--small"
                      onClick={() => onExcluir(categoria)}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
