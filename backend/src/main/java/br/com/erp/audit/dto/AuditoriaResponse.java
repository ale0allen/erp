package br.com.erp.audit.dto;

import java.time.Instant;

public record AuditoriaResponse(
        Instant criadoEm,
        Instant atualizadoEm,
        Long criadoPorId,
        Long atualizadoPorId,
        String criadoPorNome,
        String atualizadoPorNome
) {
}
