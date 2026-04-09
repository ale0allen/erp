package br.com.erp.estoque.dto;

import br.com.erp.estoque.TipoMovimentacaoEstoque;

import java.time.Instant;

public record MovimentacaoEstoqueResponse(
        Long id,
        Long produtoId,
        String produtoCodigo,
        String produtoNome,
        TipoMovimentacaoEstoque tipo,
        Integer quantidade,
        String observacao,
        Instant dataMovimentacao
) {}
