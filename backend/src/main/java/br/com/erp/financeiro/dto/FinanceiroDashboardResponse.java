package br.com.erp.financeiro.dto;

import java.math.BigDecimal;

public record FinanceiroDashboardResponse(
        long totalPayablesPending,
        long totalPayablesOverdue,
        long totalPayablesPaid,
        long totalReceivablesPending,
        long totalReceivablesOverdue,
        long totalReceivablesReceived,
        BigDecimal totalPayablesAmountPending,
        BigDecimal totalPayablesAmountOverdue,
        BigDecimal totalReceivablesAmountPending,
        BigDecimal totalReceivablesAmountOverdue,
        BigDecimal totalReceivablesAmountReceived,
        BigDecimal totalPayablesAmountPaid,
        BigDecimal projectedBalance
) {}
