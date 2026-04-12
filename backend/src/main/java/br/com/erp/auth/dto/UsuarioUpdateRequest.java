package br.com.erp.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record UsuarioUpdateRequest(
        @NotBlank(message = "Informe o nome.")
        @Size(max = 200)
        String nome,

        @NotBlank(message = "Informe o e-mail.")
        @Email(message = "E-mail inválido.")
        @Size(max = 255)
        String email,

        @Size(max = 100)
        String username,

        boolean ativo,

        @NotEmpty(message = "Selecione ao menos um perfil.")
        List<@NotBlank @Size(max = 50) String> perfis,

        /** Se preenchida, substitui a senha (mín. 6 caracteres). */
        String password
) {
}
