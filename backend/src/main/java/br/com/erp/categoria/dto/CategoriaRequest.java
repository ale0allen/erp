package br.com.erp.categoria.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CategoriaRequest(

        @NotBlank
        String nome,

        @NotNull
        Boolean ativo

) {}
