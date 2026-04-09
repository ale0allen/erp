package br.com.erp.financeiro.dto;

import java.math.BigDecimal;

public record RelatorioTotaisPagar(
        long totalCount,
        BigDecimal totalAmount,
        BigDecimal totalPendingAmount,
        BigDecimal totalOverdueAmount,
        BigDecimal totalPaidAmount
) {}
