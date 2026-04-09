package br.com.erp.financeiro.dto;

import br.com.erp.financeiro.StatusContaReceber;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record ContaReceberDetailResponse(
        Long id,
        String descricao,
        Long clienteId,
        String clienteNome,
        LocalDate dataVencimento,
        BigDecimal valor,
        StatusContaReceber status,
        String observacoes,
        Instant criadoEm
) {}
