package br.com.erp.financeiro.dto;

import java.util.List;

public record RelatorioContasReceberResponse(
        List<ContaReceberRelatorioRow> rows,
        RelatorioTotaisReceber totals
) {}
