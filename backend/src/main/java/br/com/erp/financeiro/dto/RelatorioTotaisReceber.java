package br.com.erp.financeiro.dto;

import java.math.BigDecimal;

public record RelatorioTotaisReceber(
        long totalCount,
        BigDecimal totalAmount,
        BigDecimal totalPendingAmount,
        BigDecimal totalOverdueAmount,
        BigDecimal totalReceivedAmount
) {}
