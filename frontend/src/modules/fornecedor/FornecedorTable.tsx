import type { Fornecedor } from './fornecedor.types'

type FornecedorTableProps = {
  fornecedores: Fornecedor[]
  onEditar: (fornecedor: Fornecedor) => void
  onExcluir: (fornecedor: Fornecedor) => void
  somenteLeitura?: boolean
}

export function FornecedorTable({
  fornecedores,
  onEditar,
  onExcluir,
  somenteLeitura = false
}: FornecedorTableProps) {
  if (fornecedores.length === 0) {
    return <p className="table-empty">Nenhum fornecedor encontrado.</p>
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">Documento</th>
            <th scope="col">Contato</th>
            <th scope="col">Email</th>
            <th scope="col">Telefone</th>
            <th scope="col">Status</th>
            {!somenteLeitura ? <th scope="col">Ações</th> : null}
          </tr>
        </thead>
        <tbody>
          {fornecedores.map(f => (
            <tr key={f.id}>
              <td>{f.nome ?? '—'}</td>
              <td>{f.documento ?? '—'}</td>
              <td>{f.nomeContato ?? '—'}</td>
              <td>{f.email ?? '—'}</td>
              <td>{f.telefone ?? '—'}</td>
              <td>{f.ativo ? 'Ativo' : 'Inativo'}</td>
              {!somenteLeitura ? (
                <td className="data-table__actions">
                  <div className="table-actions">
                    <button
                      type="button"
                      className="btn btn--secondary btn--small"
                      onClick={() => onEditar(f)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn--danger btn--small"
                      onClick={() => onExcluir(f)}
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

