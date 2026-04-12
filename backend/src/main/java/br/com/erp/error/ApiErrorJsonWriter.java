package br.com.erp.error;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

/**
 * Escreve {@link ApiErrorResponse} em respostas servlet (ex.: filtros de segurança).
 */
@Component
public class ApiErrorJsonWriter {

    private final ObjectMapper objectMapper;

    public ApiErrorJsonWriter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public void writeJson(
            HttpServletRequest request,
            HttpServletResponse response,
            HttpStatus httpStatus,
            String error,
            String message
    ) throws IOException {
        writeJson(request, response, httpStatus, error, message, null);
    }

    public void writeJson(
            HttpServletRequest request,
            HttpServletResponse response,
            HttpStatus httpStatus,
            String error,
            String message,
            Map<String, String> fieldErrors
    ) throws IOException {
        response.setStatus(httpStatus.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        String path = request != null ? request.getRequestURI() : "";
        ApiErrorResponse body = ApiErrorResponse.of(httpStatus, error, message, path, fieldErrors);
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
