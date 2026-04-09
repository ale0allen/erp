package br.com.erp.financeiro.dto;

import br.com.erp.financeiro.StatusContaPagar;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ContaPagarListItemResponse(
        Long id,
        String descricao,
        Long fornecedorId,
        String fornecedorNome,
        LocalDate dataVencimento,
        BigDecimal valor,
        StatusContaPagar status
) {}

