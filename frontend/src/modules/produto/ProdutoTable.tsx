import {
  calcularStatusEstoque,
  statusBadgeClass,
  statusLabel,
  statusTitleAttr
} from './stockIndicators'
import type { Produto } from './produto.types'

type ProdutoTableProps = {
  produtos: Produto[]
  onEditar: (produto: Produto) => void
  onExcluir: (produto: Produto) => void
  /** Somente consulta: oculta a coluna de ações (perfil OPERATOR). */
  somenteLeitura?: boolean
}

export function ProdutoTable({
  produtos,
  onEditar,
  onExcluir,
  somenteLeitura = false
}: ProdutoTableProps) {
  if (produtos.length === 0) {
    return <p className="table-empty">Nenhum produto encontrado.</p>
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col" className="data-table__col--xs-hide">
              ID
            </th>
            <th scope="col">Código</th>
            <th scope="col">Nome</th>
            <th scope="col" className="data-table__num">
              Saldo
            </th>
            <th scope="col" className="data-table__num">
              Mínimo
            </th>
            <th scope="col">Status</th>
            <th scope="col">Categoria</th>
            <th scope="col" className="data-table__num">
              Preço de custo
            </th>
            <th scope="col" className="data-table__num">
              Preço de venda
            </th>
            <th scope="col">Ativo</th>
            {!somenteLeitura ? <th scope="col">Ações</th> : null}
          </tr>
        </thead>
        <tbody>
          {produtos.map(produto => {
            const saldo = produto.saldoEstoque ?? 0
            const minimo = produto.estoqueMinimo ?? 0
            const status =
              produto.statusEstoque ??
              calcularStatusEstoque(saldo, minimo)
            return (
              <tr key={produto.id}>
                <td className="data-table__col--xs-hide">{produto.id}</td>
                <td>{produto.codigo}</td>
                <td>{produto.nome}</td>
                <td className="data-table__num data-table__saldo">
                  {saldo}
                </td>
                <td className="data-table__num">{minimo}</td>
                <td>
                  <span
                    className={statusBadgeClass(status)}
                    title={statusTitleAttr(status, saldo, minimo)}
                  >
                    {statusLabel(status)}
                  </span>
                </td>
                <td>{produto.categoriaNome}</td>
                <td className="data-table__num">
                  {produto.precoCusto ?? ''}
                </td>
                <td className="data-table__num">
                  {produto.precoVenda ?? ''}
                </td>
                <td>{produto.ativo ? 'Sim' : 'Não'}</td>
                {!somenteLeitura ? (
                  <td className="data-table__actions">
                    <div className="table-actions">
                      <button
                        type="button"
                        className="btn btn--secondary btn--small"
                        onClick={() => onEditar(produto)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn--danger btn--small"
                        onClick={() => onExcluir(produto)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                ) : null}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
