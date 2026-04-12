package br.com.erp.auth.service;

import br.com.erp.auth.dto.*;
import br.com.erp.auth.entity.Usuario;
import br.com.erp.auth.repository.UsuarioRepository;
import br.com.erp.auth.security.AuthUsuarioDetails;
import br.com.erp.auth.security.JwtService;
import br.com.erp.config.JwtProperties;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            JwtProperties jwtProperties
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.jwtProperties = jwtProperties;
    }

    public LoginResponse login(LoginRequest request) {
        String login = request.login().trim();
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(login)
                .or(() -> usuarioRepository.findByUsernameIgnoreCase(login))
                .orElseThrow(() -> new BadCredentialsException("Credenciais inválidas"));

        if (!passwordEncoder.matches(request.password(), usuario.getSenhaHash())) {
            throw new BadCredentialsException("Credenciais inválidas");
        }
        if (!Boolean.TRUE.equals(usuario.getAtivo())) {
            throw new DisabledException("Usuário inativo");
        }

        String token = jwtService.generateToken(usuario);
        return new LoginResponse(token, "Bearer", jwtProperties.expirationMs());
    }

    public UsuarioResponse usuarioAtual(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthUsuarioDetails details)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Não autenticado");
        }
        Usuario u = details.getUsuario();
        return new UsuarioResponse(
                u.getId(),
                u.getNome(),
                u.getEmail(),
                u.getUsername(),
                Boolean.TRUE.equals(u.getAtivo())
        );
    }

    @Transactional
    public UsuarioResponse bootstrap(BootstrapRequest request) {
        if (usuarioRepository.count() > 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "O primeiro usuário já foi criado. Use o login."
            );
        }

        if (request.username() != null && !request.username().isBlank()) {
            String un = request.username().trim();
            usuarioRepository.findByUsernameIgnoreCase(un).ifPresent(u -> {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Nome de usuário já em uso");
            });
        }

        usuarioRepository.findByEmailIgnoreCase(request.email().trim()).ifPresent(u -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já em uso");
        });

        Usuario usuario = new Usuario();
        usuario.setNome(request.nome().trim());
        usuario.setEmail(request.email().trim().toLowerCase());
        if (request.username() != null && !request.username().isBlank()) {
            usuario.setUsername(request.username().trim());
        }
        usuario.setSenhaHash(passwordEncoder.encode(request.password()));
        usuario.setAtivo(true);
        usuario = usuarioRepository.save(usuario);

        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getUsername(),
                true
        );
    }

    public BootstrapStatusResponse bootstrapStatus() {
        return new BootstrapStatusResponse(usuarioRepository.count() == 0);
    }
}
