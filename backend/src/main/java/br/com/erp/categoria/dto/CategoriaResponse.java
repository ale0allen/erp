package br.com.erp.categoria.dto;

import br.com.erp.audit.dto.AuditoriaResponse;

public record CategoriaResponse(
        Long id,
        String nome,
        Boolean ativo,
        AuditoriaResponse auditoria
) {}
