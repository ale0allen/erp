package br.com.erp.venda.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.List;

public record VendaRequest(
        @NotNull
        Long clienteId,
        @NotNull
        Instant dataVenda,
        String observacoes,
        @NotNull
        List<@Valid VendaItemRequest> itens
) {}

