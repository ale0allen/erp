package br.com.erp.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Informe e-mail ou nome de usuário")
        String login,
        @NotBlank(message = "Informe a senha")
        String password
) {
}
