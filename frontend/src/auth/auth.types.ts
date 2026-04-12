export type LoginRequestBody = {
  login: string
  password: string
}

export type LoginResponseBody = {
  accessToken: string
  tokenType: string
  expiresInMs: number
}

/** Perfis alinhados ao backend (tabela perfil). */
export type Perfil = 'ADMIN' | 'MANAGER' | 'OPERATOR'

export type AuthUser = {
  id: number
  nome: string
  email: string
  username: string | null
  ativo: boolean
  perfis: string[]
}
