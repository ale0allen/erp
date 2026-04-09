import { NavLink, Outlet, useLocation } from 'react-router-dom'

import './MainLayout.css'

const NAV_ITEMS: { to: string; label: string; end?: boolean }[] = [
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
  { to: '/configuracoes', label: 'Configurações' }
]

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
  '/configuracoes': 'Configurações'
}

function getHeaderTitle(pathname: string): string {
  return PATH_TITLES[pathname] ?? 'ERP'
}

export function MainLayout() {
  const { pathname } = useLocation()

  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar" aria-label="Menu principal">
        <div className="app-shell__brand">
          <p className="app-shell__brand-title">ERP</p>
          <p className="app-shell__brand-sub">Gestão</p>
        </div>
        <nav className="app-shell__nav">
          {NAV_ITEMS.map(({ to, label, end }) => (
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
          <span className="app-shell__header-meta">Ambiente local</span>
        </header>
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
