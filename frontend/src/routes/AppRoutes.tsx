import { Navigate, Route, Routes } from 'react-router-dom'

import { MainLayout } from '../layout/MainLayout'
import { CategoriasPage } from '../pages/CategoriasPage'
import { ConfiguracoesPage } from '../pages/ConfiguracoesPage'
import { DashboardPage } from '../pages/DashboardPage'
import { EstoquePage } from '../pages/EstoquePage'
import { FinanceiroPage } from '../pages/FinanceiroPage'
import { RelatorioFinanceiroPage } from '../pages/RelatorioFinanceiroPage'
import { ContasPagarPage } from '../pages/ContasPagarPage'
import { ContasReceberPage } from '../pages/ContasReceberPage'
import { FornecedoresPage } from '../pages/FornecedoresPage'
import { ComprasPage } from '../pages/ComprasPage'
import { ClientesPage } from '../pages/ClientesPage'
import { VendasPage } from '../pages/VendasPage'
import { ProdutosPage } from '../pages/ProdutosPage'
import { RelatorioEstoquePage } from '../pages/RelatorioEstoquePage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/produtos" element={<ProdutosPage />} />
        <Route path="/categorias" element={<CategoriasPage />} />
        <Route path="/estoque" element={<EstoquePage />} />
        <Route path="/relatorio-estoque" element={<RelatorioEstoquePage />} />
        <Route path="/fornecedores" element={<FornecedoresPage />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/compras" element={<ComprasPage />} />
        <Route path="/vendas" element={<VendasPage />} />
        <Route path="/contas-pagar" element={<ContasPagarPage />} />
        <Route path="/contas-receber" element={<ContasReceberPage />} />
        <Route path="/financeiro" element={<FinanceiroPage />} />
        <Route path="/relatorio-financeiro" element={<RelatorioFinanceiroPage />} />
        <Route path="/configuracoes" element={<ConfiguracoesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
