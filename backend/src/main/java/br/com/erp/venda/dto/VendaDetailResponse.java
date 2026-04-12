package br.com.erp.venda.dto;

import br.com.erp.audit.dto.AuditoriaResponse;
import br.com.erp.venda.StatusVenda;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record VendaDetailResponse(
        Long id,
        Long clienteId,
        String clienteNome,
        Instant dataVenda,
        StatusVenda status,
        String observacoes,
        BigDecimal valorTotal,
        List<VendaItemResponse> itens,
        Long contaReceberId,
        AuditoriaResponse auditoria
) {}

