package br.com.erp.error;

/**
 * Recurso solicitado não existe (HTTP 404).
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
