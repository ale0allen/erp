import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../auth/AuthContext'
import { isAdmin, podeAcessarFinanceiro, rotuloPerfilPrincipal } from '../auth/permissions'

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
  { to: '/auditoria-historico', label: 'Auditoria' },
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
  if (path === '/usuarios' || path === '/auditoria-historico' || path === '/configuracoes')
    return isAdmin(user)
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
  '/auditoria-historico': 'Histórico de auditoria',
  '/configuracoes': 'Configurações',
  '/acesso-negado': 'Acesso negado'
}

function getHeaderTitle(pathname: string): string {
  return PATH_TITLES[pathname] ?? 'ERP'
}

export function MainLayout() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const [navAberto, setNavAberto] = useState(false)

  const itensVisiveis = NAV_ITEMS.filter(({ to }) => navItemVisivel(to, user))

  useEffect(() => {
    setNavAberto(false)
  }, [pathname])

  useEffect(() => {
    if (!navAberto) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNavAberto(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navAberto])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const mq = window.matchMedia('(max-width: 1024px)')
    const aplicarOverflow = () => {
      if (mq.matches && navAberto) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
    aplicarOverflow()
    mq.addEventListener('change', aplicarOverflow)
    return () => {
      mq.removeEventListener('change', aplicarOverflow)
      document.body.style.overflow = ''
    }
  }, [navAberto])

  return (
    <div className={navAberto ? 'app-shell app-shell--nav-open' : 'app-shell'}>
      <button
        type="button"
        className="app-shell__backdrop"
        aria-label="Fechar menu"
        aria-hidden={!navAberto}
        tabIndex={navAberto ? 0 : -1}
        onClick={() => setNavAberto(false)}
      />

      <aside
        id="app-main-nav"
        className="app-shell__sidebar"
        aria-label="Menu principal"
      >
        <div className="app-shell__brand">
          <p className="app-shell__brand-title">ERP</p>
          <p className="app-shell__brand-sub">Gestão</p>
        </div>
        <nav className="app-shell__nav" aria-labelledby="app-main-nav-heading">
          <span id="app-main-nav-heading" className="app-shell__nav-sr-title">
            Navegação
          </span>
          {itensVisiveis.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setNavAberto(false)}
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
          <button
            type="button"
            className="app-shell__menu-toggle"
            aria-expanded={navAberto}
            aria-controls="app-main-nav"
            onClick={() => setNavAberto(v => !v)}
            aria-label={navAberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
          >
            <svg
              className="app-shell__menu-icon"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              {navAberto ? (
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
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
