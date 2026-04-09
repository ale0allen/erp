package br.com.erp.financeiro.dto;

import br.com.erp.financeiro.StatusContaPagar;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ContaPagarRelatorioRow(
        Long id,
        String description,
        String supplierName,
        LocalDate dueDate,
        BigDecimal amount,
        StatusContaPagar status,
        String notes
) {}
