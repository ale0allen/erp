package br.com.erp.compra.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.List;

public record CompraRequest(
        @NotNull
        Long fornecedorId,
        @NotNull
        Instant dataCompra,
        String observacoes,
        @NotNull
        List<@Valid CompraItemRequest> itens
) {}

