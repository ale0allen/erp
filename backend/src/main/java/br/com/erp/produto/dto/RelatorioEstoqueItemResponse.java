package br.com.erp.produto.dto;

public record RelatorioEstoqueItemResponse(
        Long productId,
        String productCode,
        String productName,
        String categoryName,
        Boolean active,
        Integer stockBalance,
        Integer minimumStock,
        StatusEstoque stockStatus
) {}
