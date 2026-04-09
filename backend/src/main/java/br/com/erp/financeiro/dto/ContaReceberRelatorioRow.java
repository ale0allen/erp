package br.com.erp.financeiro.dto;

import br.com.erp.financeiro.StatusContaReceber;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ContaReceberRelatorioRow(
        Long id,
        String description,
        String customerName,
        LocalDate dueDate,
        BigDecimal amount,
        StatusContaReceber status,
        String notes
) {}
