package br.com.erp.financeiro.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ContaPagarRequest(
        @NotBlank
        String descricao,
        Long fornecedorId,
        @NotNull
        LocalDate dataVencimento,
        @NotNull
        @DecimalMin(value = "0.01", inclusive = true)
        BigDecimal valor,
        String observacoes
) {}

