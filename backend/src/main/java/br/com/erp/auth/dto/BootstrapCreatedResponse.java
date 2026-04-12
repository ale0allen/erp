package br.com.erp.auth.dto;

/**
 * Resposta de {@code POST /auth/bootstrap} após criar o primeiro usuário (setup inicial único).
 */
public record BootstrapCreatedResponse(
        UsuarioResponse usuario,
        String mensagem
) {
}
