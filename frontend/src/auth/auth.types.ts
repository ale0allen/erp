export type LoginRequestBody = {
  login: string
  password: string
}

export type LoginResponseBody = {
  accessToken: string
  tokenType: string
  expiresInMs: number
}
