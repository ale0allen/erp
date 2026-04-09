package br.com.erp.financeiro.dto;

import java.util.List;

public record RelatorioContasPagarResponse(
        List<ContaPagarRelatorioRow> rows,
        RelatorioTotaisPagar totals
) {}
