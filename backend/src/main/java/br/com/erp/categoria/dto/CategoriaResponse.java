package br.com.erp.categoria.dto;

public record CategoriaResponse(
        Long id,
        String nome,
        Boolean ativo
) {}
