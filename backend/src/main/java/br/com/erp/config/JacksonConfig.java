package br.com.erp.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Garante um {@link ObjectMapper} no contexto (ex.: {@link br.com.erp.error.ApiErrorJsonWriter}).
 * Em alguns ambientes o auto-config do Jackson pode não expor o bean; este fallback evita falha na injeção.
 */
@Configuration
public class JacksonConfig {

    @Bean
    @ConditionalOnMissingBean(ObjectMapper.class)
    public ObjectMapper objectMapper() {
        return new ObjectMapper().findAndRegisterModules();
    }
}
