/** Chave do token no localStorage (alinhada ao backend / fluxo de deploy). */
export const TOKEN_KEY = 'token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * Remove token e dados de sessão do navegador (aba atual).
 * Use antes de redirecionar ao login ou após 401.
 */
export function clearAuthStorage(): void {
  clearToken()
  try {
    sessionStorage.clear()
  } catch {
    /* ignore */
  }
}

export function hasAuthToken(): boolean {
  const t = getToken()
  return t != null && t.length > 0
}

/**
 * Encerra a sessão: limpa armazenamento e substitui a rota por `/login`
 * (evita manter a página protegida no histórico “Voltar”).
 */
export function logout(): void {
  clearAuthStorage()
  window.location.replace('/login')
}
