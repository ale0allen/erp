package br.com.erp.produto.dto;

public record ProdutoResumoResponse(
        long totalProducts,
        long activeProducts,
        long inactiveProducts,
        long totalStockQuantity,
        long productsOutOfStock,
        long productsWithLowStock,
        long productsWithNormalStock
) {}
