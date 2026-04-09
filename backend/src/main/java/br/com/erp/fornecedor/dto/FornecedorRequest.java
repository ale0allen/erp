package br.com.erp.fornecedor.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record FornecedorRequest(
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

