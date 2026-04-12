package br.com.erp.auth.controller;

import br.com.erp.auth.dto.*;
import br.com.erp.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

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

    @PostMapping("/bootstrap")
    public UsuarioResponse bootstrap(@Valid @RequestBody BootstrapRequest request) {
        return authService.bootstrap(request);
    }

    @GetMapping("/bootstrap-status")
    public BootstrapStatusResponse bootstrapStatus() {
        return authService.bootstrapStatus();
    }
}
