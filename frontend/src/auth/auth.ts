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

export function hasAuthToken(): boolean {
  const t = getToken()
  return t != null && t.length > 0
}

/** Remove o token e envia o usuário para a tela de login (recarrega a SPA). */
export function logout(): void {
  clearToken()
  window.location.assign('/login')
}
