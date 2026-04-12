import { Navigate, Route, Routes } from 'react-router-dom'

import { RoleGate } from '../auth/RoleGate'
import { MainLayout } from '../layout/MainLayout'
import { LoginPage } from '../pages/LoginPage'
import { AccessDeniedPage } from '../pages/AccessDeniedPage'
import { CategoriasPage } from '../pages/CategoriasPage'
import { ConfiguracoesPage } from '../pages/ConfiguracoesPage'
import { AuditoriaHistoricoPage } from '../pages/AuditoriaHistoricoPage'
import { UsuariosPage } from '../pages/UsuariosPage'
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
import { ProtectedRoute } from './ProtectedRoute'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
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
          <Route
            path="/contas-pagar"
            element={
              <RoleGate perfis={['ADMIN', 'MANAGER']}>
                <ContasPagarPage />
              </RoleGate>
            }
          />
          <Route
            path="/contas-receber"
            element={
              <RoleGate perfis={['ADMIN', 'MANAGER']}>
                <ContasReceberPage />
              </RoleGate>
            }
          />
          <Route
            path="/financeiro"
            element={
              <RoleGate perfis={['ADMIN', 'MANAGER']}>
                <FinanceiroPage />
              </RoleGate>
            }
          />
          <Route
            path="/relatorio-financeiro"
            element={
              <RoleGate perfis={['ADMIN', 'MANAGER']}>
                <RelatorioFinanceiroPage />
              </RoleGate>
            }
          />
          <Route
            path="/usuarios"
            element={
              <RoleGate perfis={['ADMIN']}>
                <UsuariosPage />
              </RoleGate>
            }
          />
          <Route
            path="/auditoria-historico"
            element={
              <RoleGate perfis={['ADMIN']}>
                <AuditoriaHistoricoPage />
              </RoleGate>
            }
          />
          <Route
            path="/configuracoes"
            element={
              <RoleGate perfis={['ADMIN']}>
                <ConfiguracoesPage />
              </RoleGate>
            }
          />
          <Route path="/acesso-negado" element={<AccessDeniedPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}
