package br.com.erp.produto.dto;

import java.math.BigDecimal;

public record ProdutoResponse(

        Long id,
        String codigo,
        String nome,
        BigDecimal precoCusto,
        BigDecimal precoVenda,
        Boolean ativo,
        Long categoriaId,
        String categoriaNome,
        Integer saldoEstoque,
        Integer estoqueMinimo,
        StatusEstoque statusEstoque

) {}
