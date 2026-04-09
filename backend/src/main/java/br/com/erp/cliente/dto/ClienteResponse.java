package br.com.erp.cliente.dto;

public record ClienteResponse(
        Long id,
        String nome,
        String documento,
        String email,
        String telefone,
        String nomeContato,
        Boolean ativo,
        String observacoes
) {}

