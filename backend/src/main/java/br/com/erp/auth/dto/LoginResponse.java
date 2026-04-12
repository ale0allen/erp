package br.com.erp.auth.dto;

public record LoginResponse(
        String accessToken,
        String tokenType,
        long expiresInMs
) {
}
