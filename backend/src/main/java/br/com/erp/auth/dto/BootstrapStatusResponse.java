package br.com.erp.auth.dto;

/**
 * Indica se o setup inicial (primeiro usuário) ainda está disponível e orienta o próximo passo.
 */
public record BootstrapStatusResponse(
        boolean bootstrapDisponivel,
        String instrucao
) {
}
