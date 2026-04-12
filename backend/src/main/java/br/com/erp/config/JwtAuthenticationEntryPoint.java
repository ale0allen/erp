package br.com.erp.config;

import br.com.erp.error.ApiErrorJsonWriter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ApiErrorJsonWriter apiErrorJsonWriter;

    public JwtAuthenticationEntryPoint(ApiErrorJsonWriter apiErrorJsonWriter) {
        this.apiErrorJsonWriter = apiErrorJsonWriter;
    }

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException {
        apiErrorJsonWriter.writeJson(
                request,
                response,
                HttpStatus.UNAUTHORIZED,
                "UNAUTHORIZED",
                "Não autenticado"
        );
    }
}
