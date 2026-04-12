package br.com.erp.auditoria.dto;

import java.time.Instant;

public record HistoricoAuditoriaResponse(
        Long id,
        String action,
        String module,
        Long entityId,
        String description,
        Long performedByUserId,
        String performedByUserName,
        Instant performedAt
) {
}
