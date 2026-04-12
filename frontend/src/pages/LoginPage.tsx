import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { setToken, hasAuthToken } from '../auth/auth'
import { loginApi } from '../auth/authService'

import './LoginPage.css'

type LocationState = {
  from?: { pathname: string }
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as LocationState | null)?.from?.pathname ?? '/'

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (hasAuthToken()) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await loginApi(login, password)
      setToken(data.accessToken)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page erp-page">
      <div className="login-page__bg" aria-hidden="true" />
      <div className="login-page__content">
        <div className="login-page__card card">
          <header className="login-page__header">
            <p className="login-page__brand">ERP</p>
            <h1 className="login-page__title">Bem-vindo de volta</h1>
            <p className="login-page__lead">
              Entre com seu e-mail ou nome de usuário para acessar o painel de gestão.
            </p>
          </header>

          <form className="login-page__form" onSubmit={handleSubmit} aria-busy={loading}>
            <div className="form-field login-page__field">
              <label className="form-label" htmlFor="login-login">
                E-mail ou usuário
              </label>
              <input
                id="login-login"
                className="form-input login-page__input"
                type="text"
                autoComplete="username"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                disabled={loading}
                placeholder="nome@empresa.com ou seu usuário"
              />
            </div>
            <div className="form-field login-page__field">
              <label className="form-label" htmlFor="login-password">
                Senha
              </label>
              <input
                id="login-password"
                className="form-input login-page__input"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="••••••••"
              />
            </div>

            {error ? (
              <div className="login-page__alert" role="alert">
                <span className="login-page__alert-title">Não foi possível entrar</span>
                <p className="login-page__alert-text">{error}</p>
              </div>
            ) : null}

            <div className="login-page__actions">
              <button
                type="submit"
                className="btn btn--primary login-page__submit"
                disabled={loading}
                aria-disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="login-page__spinner" aria-hidden="true" />
                    Entrando…
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
            </div>
          </form>
        </div>
        <p className="login-page__footer">Ambiente seguro · acesso restrito a usuários autorizados</p>
      </div>
    </div>
  )
}
