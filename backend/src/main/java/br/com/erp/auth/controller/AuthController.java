package br.com.erp.auth.controller;

import br.com.erp.auth.dto.*;
import br.com.erp.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final String MSG_BOOTSTRAP_SUCESSO = "Setup inicial concluído. Este endpoint deixa de aceitar novas solicitações. "
            + "Use POST /auth/login com o e-mail ou nome de usuário e a senha definidos. "
            + "Recomenda-se alterar a senha após o primeiro acesso.";

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public UsuarioResponse me(Authentication authentication) {
        return authService.usuarioAtual(authentication);
    }

    /**
     * Setup inicial (somente se ainda não existir nenhum usuário). Bloqueado após o primeiro cadastro (HTTP 409).
     */
    @PostMapping("/bootstrap")
    public BootstrapCreatedResponse bootstrap(@Valid @RequestBody BootstrapRequest request) {
        UsuarioResponse usuario = authService.bootstrap(request);
        return new BootstrapCreatedResponse(usuario, MSG_BOOTSTRAP_SUCESSO);
    }

    @GetMapping("/bootstrap-status")
    public BootstrapStatusResponse bootstrapStatus() {
        return authService.bootstrapStatus();
    }
}
