package br.com.erp.fornecedor.dto;

public record FornecedorResponse(
        Long id,
        String nome,
        String documento,
        String email,
        String telefone,
        String nomeContato,
        Boolean ativo,
        String observacoes
) {}

