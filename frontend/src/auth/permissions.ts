import type { AuthUser, Perfil } from './auth.types'

export function hasAlgumPerfil(user: AuthUser | null, ...perfis: Perfil[]): boolean {
  if (!user?.perfis?.length) return false
  return perfis.some((p) => user.perfis.includes(p))
}

/** Escrita em produtos, categorias, fornecedores e clientes (ADMIN e MANAGER). */
export function podeGerenciarCadastros(user: AuthUser | null): boolean {
  return hasAlgumPerfil(user, 'ADMIN', 'MANAGER')
}

/** Contas a pagar/receber, dashboard e relatórios financeiros. */
export function podeAcessarFinanceiro(user: AuthUser | null): boolean {
  return hasAlgumPerfil(user, 'ADMIN', 'MANAGER')
}

export function isAdmin(user: AuthUser | null): boolean {
  return hasAlgumPerfil(user, 'ADMIN')
}

/** Rótulo curto para o cabeçalho (prioridade ADMIN > MANAGER > OPERATOR). */
export function rotuloPerfilPrincipal(user: AuthUser | null): string {
  if (!user?.perfis?.length) return '—'
  const order: Perfil[] = ['ADMIN', 'MANAGER', 'OPERATOR']
  for (const p of order) {
    if (user.perfis.includes(p)) {
      return p === 'ADMIN' ? 'Administrador' : p === 'MANAGER' ? 'Gestor' : 'Operador'
    }
  }
  return user.perfis[0] ?? '—'
}
