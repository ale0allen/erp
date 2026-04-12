package br.com.erp.configuracao.dto;

import br.com.erp.audit.dto.AuditoriaResponse;

public record ConfiguracaoSistemaResponse(
        String companyName,
        String tradeName,
        String companyEmail,
        String companyPhone,
        String currencyCode,
        String timezone,
        Integer defaultPageSize,
        Integer lowStockDefaultThreshold,
        String additionalInfo,
        AuditoriaResponse auditoria
) {
}
