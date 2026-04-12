package br.com.erp.auth.dto;

public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        String username,
        boolean ativo
) {
}
