import { NavLink, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../auth/AuthContext'
import { isAdmin, podeAcessarFinanceiro, rotuloPerfilPrincipal } from '../auth/permissions'
import { logout } from '../auth/auth'

import './MainLayout.css'

type NavItem = { to: string; label: string; end?: boolean }

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/produtos', label: 'Produtos' },
  { to: '/categorias', label: 'Categorias' },
  { to: '/estoque', label: 'Estoque' },
  { to: '/relatorio-estoque', label: 'Relatório estoque' },
  { to: '/fornecedores', label: 'Fornecedores' },
  { to: '/clientes', label: 'Clientes' },
  { to: '/compras', label: 'Compras' },
  { to: '/vendas', label: 'Vendas' },
  { to: '/contas-pagar', label: 'Contas a pagar' },
  { to: '/contas-receber', label: 'Contas a receber' },
  { to: '/financeiro', label: 'Dashboard financeiro' },
  { to: '/relatorio-financeiro', label: 'Relatório financeiro' },
  { to: '/usuarios', label: 'Usuários' },
  { to: '/configuracoes', label: 'Configurações' }
]

const FINANCE_PATHS = new Set([
  '/contas-pagar',
  '/contas-receber',
  '/financeiro',
  '/relatorio-financeiro'
])

function navItemVisivel(path: string, user: ReturnType<typeof useAuth>['user']): boolean {
  if (!user) return false
  if (path === '/usuarios' || path === '/configuracoes') return isAdmin(user)
  if (FINANCE_PATHS.has(path)) return podeAcessarFinanceiro(user)
  return true
}

const PATH_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/produtos': 'Produtos',
  '/categorias': 'Categorias',
  '/estoque': 'Estoque',
  '/relatorio-estoque': 'Relatório de estoque',
  '/fornecedores': 'Fornecedores',
  '/clientes': 'Clientes',
  '/compras': 'Compras',
  '/vendas': 'Vendas',
  '/contas-pagar': 'Contas a pagar',
  '/contas-receber': 'Contas a receber',
  '/financeiro': 'Dashboard financeiro',
  '/relatorio-financeiro': 'Relatório financeiro',
  '/usuarios': 'Usuários',
  '/configuracoes': 'Configurações',
  '/acesso-negado': 'Acesso negado'
}

function getHeaderTitle(pathname: string): string {
  return PATH_TITLES[pathname] ?? 'ERP'
}

export function MainLayout() {
  const { pathname } = useLocation()
  const { user } = useAuth()

  const itensVisiveis = NAV_ITEMS.filter(({ to }) => navItemVisivel(to, user))

  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar" aria-label="Menu principal">
        <div className="app-shell__brand">
          <p className="app-shell__brand-title">ERP</p>
          <p className="app-shell__brand-sub">Gestão</p>
        </div>
        <nav className="app-shell__nav">
          {itensVisiveis.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                isActive
                  ? 'app-shell__nav-link app-shell__nav-link--active'
                  : 'app-shell__nav-link'
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="app-shell__main">
        <header className="app-shell__header">
          <h1 className="app-shell__header-title">{getHeaderTitle(pathname)}</h1>
          <div className="app-shell__header-actions">
            {user ? (
              <div className="app-shell__user" aria-label="Usuário logado">
                <span className="app-shell__user-name">{user.nome}</span>
                <span className="app-shell__user-role">{rotuloPerfilPrincipal(user)}</span>
              </div>
            ) : null}
            <span className="app-shell__header-meta">Ambiente local</span>
            <button
              type="button"
              className="btn btn--secondary btn--small app-shell__logout"
              onClick={() => logout()}
            >
              Sair
            </button>
          </div>
        </header>
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
