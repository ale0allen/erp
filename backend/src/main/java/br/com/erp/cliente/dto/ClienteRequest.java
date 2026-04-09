package br.com.erp.cliente.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ClienteRequest(
        @NotBlank
        String nome,
        String documento,
        @Email
        String email,
        String telefone,
        String nomeContato,
        @NotNull
        Boolean ativo,
        String observacoes
) {}

