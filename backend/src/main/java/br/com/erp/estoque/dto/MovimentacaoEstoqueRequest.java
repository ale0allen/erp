package br.com.erp.estoque.dto;

import br.com.erp.estoque.TipoMovimentacaoEstoque;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record MovimentacaoEstoqueRequest(

        @NotNull
        Long produtoId,

        @NotNull
        TipoMovimentacaoEstoque tipo,

        @NotNull
        @Min(1)
        Integer quantidade,

        String observacao

) {}
