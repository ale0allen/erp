package br.com.erp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    public record ErroCampo(String campo, String mensagem) {}

    public record ErroValidacaoResponse(int status, String erro, List<ErroCampo> campos) {}

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroValidacaoResponse> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex) {

        List<ErroCampo> campos = new ArrayList<>();

        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            campos.add(new ErroCampo(fe.getField(), fe.getDefaultMessage()));
        }

        for (ObjectError oe : ex.getBindingResult().getGlobalErrors()) {
            campos.add(new ErroCampo(oe.getObjectName(), oe.getDefaultMessage()));
        }

        ErroValidacaoResponse body = new ErroValidacaoResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Erro de validação",
                campos
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }
}
