package br.com.erp.venda.dto;

import br.com.erp.venda.StatusVenda;

import java.math.BigDecimal;
import java.time.Instant;

public record VendaListItemResponse(
        Long id,
        String clienteNome,
        Instant dataVenda,
        StatusVenda status,
        BigDecimal valorTotal
) {}

