package br.com.erp.error;

/**
 * Operação não permitida ao usuário autenticado (HTTP 403).
 */
public class UnauthorizedOperationException extends RuntimeException {

    public UnauthorizedOperationException(String message) {
        super(message);
    }
}
