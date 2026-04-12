package br.com.erp.compra.dto;

import br.com.erp.audit.dto.AuditoriaResponse;
import br.com.erp.compra.StatusCompra;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record CompraDetailResponse(
        Long id,
        Long fornecedorId,
        String fornecedorNome,
        Instant dataCompra,
        StatusCompra status,
        String observacoes,
        BigDecimal valorTotal,
        List<CompraItemResponse> itens,
        Long contaPagarId,
        AuditoriaResponse auditoria
) {}

