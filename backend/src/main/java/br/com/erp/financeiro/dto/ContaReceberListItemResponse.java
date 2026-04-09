package br.com.erp.financeiro.dto;

import br.com.erp.financeiro.StatusContaReceber;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ContaReceberListItemResponse(
        Long id,
        String descricao,
        Long clienteId,
        String clienteNome,
        LocalDate dataVencimento,
        BigDecimal valor,
        StatusContaReceber status
) {}
