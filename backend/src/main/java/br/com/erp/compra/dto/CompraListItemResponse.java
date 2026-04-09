package br.com.erp.compra.dto;

import br.com.erp.compra.StatusCompra;

import java.math.BigDecimal;
import java.time.Instant;

public record CompraListItemResponse(
        Long id,
        String fornecedorNome,
        Instant dataCompra,
        StatusCompra status,
        BigDecimal valorTotal
) {}

