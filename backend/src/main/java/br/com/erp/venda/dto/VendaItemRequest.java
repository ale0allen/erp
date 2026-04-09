package br.com.erp.venda.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record VendaItemRequest(
        @NotNull
        Long produtoId,
        @NotNull
        @Min(1)
        Integer quantidade,
        @NotNull
        @DecimalMin(value = "0", inclusive = true)
        BigDecimal precoUnitario
) {}

