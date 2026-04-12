package br.com.erp.fornecedor.dto;

import br.com.erp.audit.dto.AuditoriaResponse;

public record FornecedorResponse(
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

