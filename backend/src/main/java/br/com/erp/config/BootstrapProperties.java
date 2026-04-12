package br.com.erp.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuração opcional para criar o primeiro usuário administrador na subida da aplicação.
 * Só tem efeito se {@link #autoCreateOnStartup()} for true, a senha estiver definida e não houver usuários.
 */
@ConfigurationProperties(prefix = "app.bootstrap")
public record BootstrapProperties(
        boolean autoCreateOnStartup,
        String adminEmail,
        String adminUsername,
        String adminName,
        String adminPassword
) {
}
