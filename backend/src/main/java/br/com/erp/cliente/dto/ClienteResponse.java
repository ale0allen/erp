package br.com.erp.cliente.dto;

import br.com.erp.audit.dto.AuditoriaResponse;

public record ClienteResponse(
        Long id,
        String nome,
        String documento,
        String email,
        String telefone,
        String nomeContato,
        Boolean ativo,
        String observacoes,
        AuditoriaResponse auditoria
) {}

