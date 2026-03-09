import { useEffect, useState } from 'react'

type Produto = {
  id: number
  codigo: string
  nome: string
  precoCusto: number
  precoVenda: number
  ativo: boolean
}

function App() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [codigo, setCodigo] = useState('')
  const [nome, setNome] = useState('')
  const [precoCusto, setPrecoCusto] = useState('')
  const [precoVenda, setPrecoVenda] = useState('')
  const [ativo, setAtivo] = useState(true)
  const [mensagem, setMensagem] = useState('')

  const carregarProdutos = async () => {
    try {
      setMensagem('Carregando produtos...')

      const response = await fetch('http://localhost:8080/produtos')
      console.log('GET /produtos status:', response.status)

      if (!response.ok) {
        throw new Error(`Erro ao buscar produtos. Status: ${response.status}`)
      }

      const data = await response.json()
      console.log('GET /produtos data:', data)

      setProdutos(data)
      setMensagem('')
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      setMensagem(`Erro ao buscar produtos: ${String(error)}`)
    }
  }

  useEffect(() => {
    carregarProdutos()
  }, [])

  const salvarProduto = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setMensagem('Salvando produto...')

      const produto = {
        codigo,
        nome,
        precoCusto: Number(precoCusto),
        precoVenda: Number(precoVenda),
        ativo
      }

      console.log('POST /produtos body:', produto)

      const response = await fetch('http://localhost:8080/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
      })

      console.log('POST /produtos status:', response.status)

      if (!response.ok) {
        throw new Error(`Erro ao salvar produto. Status: ${response.status}`)
      }

      const data = await response.json()
      console.log('POST /produtos response:', data)

      setCodigo('')
      setNome('')
      setPrecoCusto('')
      setPrecoVenda('')
      setAtivo(true)
      setMensagem('Produto salvo com sucesso.')

      await carregarProdutos()
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
      setMensagem(`Erro ao salvar produto: ${String(error)}`)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>ERP - Produtos</h1>

      {mensagem && (
        <p style={{ marginBottom: '20px' }}>
          {mensagem}
        </p>
      )}

      <form onSubmit={salvarProduto} style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Código: </label>
          <input
            value={codigo}
            onChange={e => setCodigo(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Nome: </label>
          <input
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Preço de Custo: </label>
          <input
            type="number"
            step="0.01"
            value={precoCusto}
            onChange={e => setPrecoCusto(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Preço de Venda: </label>
          <input
            type="number"
            step="0.01"
            value={precoVenda}
            onChange={e => setPrecoVenda(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            <input
              type="checkbox"
              checked={ativo}
              onChange={e => setAtivo(e.target.checked)}
            />
            Ativo
          </label>
        </div>

        <button type="submit">Salvar</button>
      </form>

      {produtos.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
      ) : (
        <table border={1} cellPadding={10} cellSpacing={0}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Código</th>
              <th>Nome</th>
              <th>Preço de Custo</th>
              <th>Preço de Venda</th>
              <th>Ativo</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map(produto => (
              <tr key={produto.id}>
                <td>{produto.id}</td>
                <td>{produto.codigo}</td>
                <td>{produto.nome}</td>
                <td>{produto.precoCusto}</td>
                <td>{produto.precoVenda}</td>
                <td>{produto.ativo ? 'Sim' : 'Não'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App