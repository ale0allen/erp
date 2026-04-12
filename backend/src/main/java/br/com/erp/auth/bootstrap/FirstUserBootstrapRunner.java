package br.com.erp.auth.bootstrap;

import br.com.erp.auth.dto.BootstrapRequest;
import br.com.erp.auth.repository.UsuarioRepository;
import br.com.erp.auth.service.AuthService;
import br.com.erp.config.BootstrapProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Opcional: cria o primeiro usuário na inicialização se configurado e a tabela estiver vazia.
 * Senha nunca vem de valor fixo no código — use a variável de ambiente {@code BOOTSTRAP_ADMIN_PASSWORD}.
 */
@Component
@Order(100)
public class FirstUserBootstrapRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(FirstUserBootstrapRunner.class);

    private final BootstrapProperties bootstrapProperties;
    private final UsuarioRepository usuarioRepository;
    private final AuthService authService;

    public FirstUserBootstrapRunner(
            BootstrapProperties bootstrapProperties,
            UsuarioRepository usuarioRepository,
            AuthService authService
    ) {
        this.bootstrapProperties = bootstrapProperties;
        this.usuarioRepository = usuarioRepository;
        this.authService = authService;
    }

    @Override
    public void run(String... args) {
        if (!bootstrapProperties.autoCreateOnStartup()) {
            return;
        }

        String password = bootstrapProperties.adminPassword();
        if (password == null || password.isBlank()) {
            log.info(
                    "Bootstrap automático habilitado, mas BOOTSTRAP_ADMIN_PASSWORD não está definida. "
                            + "Defina a variável para criar o primeiro usuário na inicialização."
            );
            return;
        }

        if (password.length() < 6) {
            log.warn("Bootstrap automático: a senha deve ter no mínimo 6 caracteres. Nenhum usuário foi criado.");
            return;
        }

        if (usuarioRepository.count() > 0) {
            log.debug("Bootstrap automático: já existem usuários. Nada a fazer.");
            return;
        }

        try {
            BootstrapRequest request = new BootstrapRequest(
                    bootstrapProperties.adminName().trim(),
                    bootstrapProperties.adminEmail().trim(),
                    bootstrapProperties.adminUsername() != null && !bootstrapProperties.adminUsername().isBlank()
                            ? bootstrapProperties.adminUsername().trim()
                            : null,
                    password
            );
            authService.bootstrap(request);
            log.info(
                    "Bootstrap automático: primeiro usuário criado. email={} username={}. "
                            + "Faça login em POST /auth/login e altere a senha. "
                            + "Credenciais foram definidas apenas pela variável de ambiente (não registramos a senha nos logs).",
                    bootstrapProperties.adminEmail(),
                    bootstrapProperties.adminUsername()
            );
        } catch (Exception e) {
            log.error("Bootstrap automático falhou: {}", e.getMessage());
        }
    }
}
