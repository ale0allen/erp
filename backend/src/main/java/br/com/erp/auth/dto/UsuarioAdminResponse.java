package br.com.erp.auth.dto;

import br.com.erp.audit.dto.AuditoriaResponse;

import java.util.List;

public record UsuarioAdminResponse(
        Long id,
        String nome,
        String email,
        String username,
        boolean ativo,
        List<String> perfis,
        AuditoriaResponse auditoria
) {
}
