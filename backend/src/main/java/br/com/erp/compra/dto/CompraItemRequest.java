package br.com.erp.compra.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CompraItemRequest(
        @NotNull
        Long produtoId,
        @NotNull
        @Min(1)
        Integer quantidade,
        @NotNull
        @DecimalMin(value = "0", inclusive = true)
        BigDecimal custoUnitario
) {}

