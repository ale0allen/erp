package br.com.erp.compra.dto;

import java.math.BigDecimal;

public record CompraItemResponse(
        Long id,
        Long produtoId,
        String produtoNome,
        Integer quantidade,
        BigDecimal custoUnitario,
        BigDecimal subtotal
) {}

