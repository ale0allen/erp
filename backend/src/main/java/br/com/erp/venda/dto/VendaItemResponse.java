package br.com.erp.venda.dto;

import java.math.BigDecimal;

public record VendaItemResponse(
        Long id,
        Long produtoId,
        String produtoNome,
        Integer quantidade,
        BigDecimal precoUnitario,
        BigDecimal subtotal
) {}

