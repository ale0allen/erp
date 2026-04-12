package br.com.erp.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record UsuarioCreateRequest(
        @NotBlank(message = "Informe o nome.")
        @Size(max = 200)
        String nome,

        @NotBlank(message = "Informe o e-mail.")
        @Email(message = "E-mail inválido.")
        @Size(max = 255)
        String email,

        @Size(max = 100)
        String username,

        @NotBlank(message = "Informe a senha.")
        @Size(min = 6, max = 128, message = "A senha deve ter entre 6 e 128 caracteres.")
        String password,

        @NotEmpty(message = "Selecione ao menos um perfil.")
        List<@NotBlank @Size(max = 50) String> perfis,

        Boolean ativo
) {
}
