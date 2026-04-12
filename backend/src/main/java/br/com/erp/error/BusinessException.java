package br.com.erp.error;

import org.springframework.http.HttpStatus;

/**
 * Regra de negócio ou validação de domínio (HTTP configurável, padrão 400).
 */
public class BusinessException extends RuntimeException {

    private final HttpStatus status;

    public BusinessException(String message) {
        this(message, HttpStatus.BAD_REQUEST);
    }

    public BusinessException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
