package br.com.erp.config;

import br.com.erp.error.ApiErrorJsonWriter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    private final ApiErrorJsonWriter apiErrorJsonWriter;

    public JwtAccessDeniedHandler(ApiErrorJsonWriter apiErrorJsonWriter) {
        this.apiErrorJsonWriter = apiErrorJsonWriter;
    }

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException
    ) throws IOException {
        apiErrorJsonWriter.writeJson(
                request,
                response,
                HttpStatus.FORBIDDEN,
                "FORBIDDEN",
                "Acesso negado"
        );
    }
}
