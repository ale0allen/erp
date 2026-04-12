package br.com.erp.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.stream.Collectors;

@RestControllerAdvice
public class RestExceptionHandler {

    public record ErrorBody(String message) {
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorBody> badCredentials(BadCredentialsException ex) {
        String msg = ex.getMessage() != null && !ex.getMessage().isBlank()
                ? ex.getMessage()
                : "Credenciais inválidas";
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorBody(msg));
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ErrorBody> disabled(DisabledException ex) {
        String msg = ex.getMessage() != null && !ex.getMessage().isBlank()
                ? ex.getMessage()
                : "Usuário inativo";
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorBody(msg));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorBody> responseStatus(ResponseStatusException ex) {
        String msg = ex.getReason() != null && !ex.getReason().isBlank()
                ? ex.getReason()
                : ex.getStatusCode().toString();
        return ResponseEntity.status(ex.getStatusCode()).body(new ErrorBody(msg));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorBody> validation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(" "));
        if (msg.isBlank()) {
            msg = "Dados inválidos";
        }
        return ResponseEntity.badRequest().body(new ErrorBody(msg));
    }
}
