package br.com.erp.auth.dto;

import java.util.List;

public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        String username,
        boolean ativo,
        List<String> perfis
) {
}
