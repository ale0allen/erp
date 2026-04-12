import type { Cliente } from './cliente.types'

type ClienteTableProps = {
  clientes: Cliente[]
  onEditar: (cliente: Cliente) => void
  onExcluir: (cliente: Cliente) => void
  somenteLeitura?: boolean
}

export function ClienteTable({
  clientes,
  onEditar,
  onExcluir,
  somenteLeitura = false
}: ClienteTableProps) {
  if (clientes.length === 0) {
    return <p className="table-empty">Nenhum cliente encontrado.</p>
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
          {clientes.map(c => (
            <tr key={c.id}>
              <td>{c.nome ?? '—'}</td>
              <td>{c.documento ?? '—'}</td>
              <td>{c.nomeContato ?? '—'}</td>
              <td>{c.email ?? '—'}</td>
              <td>{c.telefone ?? '—'}</td>
              <td>{c.ativo ? 'Ativo' : 'Inativo'}</td>
              {!somenteLeitura ? (
                <td className="data-table__actions">
                  <div className="table-actions">
                    <button
                      type="button"
                      className="btn btn--secondary btn--small"
                      onClick={() => onEditar(c)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn--danger btn--small"
                      onClick={() => onExcluir(c)}
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

