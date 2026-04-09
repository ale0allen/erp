package br.com.erp.produto.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ProdutoRequest(

        @NotBlank
        String codigo,

        @NotBlank
        String nome,

        @NotNull
        @DecimalMin(value = "0", inclusive = true)
        BigDecimal precoCusto,

        @NotNull
        @DecimalMin(value = "0", inclusive = true)
        BigDecimal precoVenda,

        @NotNull
        Boolean ativo,

        @NotNull
        @Min(0)
        Integer estoqueMinimo,

        @NotNull
        Long categoriaId

) {}
