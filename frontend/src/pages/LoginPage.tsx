import { FormEvent, useState } from 'react'
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
      <div className="login-page__panel card">
        <h1 className="login-page__title">Entrar no ERP</h1>
        <p className="login-page__subtitle">Use seu e-mail ou nome de usuário e a senha.</p>

        <form className="login-page__form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label" htmlFor="login-login">
              E-mail ou usuário
            </label>
            <input
              id="login-login"
              className="form-input"
              type="text"
              autoComplete="username"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="login-password">
              Senha
            </label>
            <input
              id="login-password"
              className="form-input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error ? (
            <p className="status-message status-message--error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="form-actions">
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
