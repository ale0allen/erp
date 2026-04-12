package br.com.erp.auth.service;

import br.com.erp.auth.dto.*;
import br.com.erp.auth.entity.Perfil;
import br.com.erp.auth.entity.Usuario;
import br.com.erp.auth.repository.PerfilRepository;
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

import java.util.Comparator;
import java.util.List;

@Service
public class AuthService {

    private static final String PERFIL_ADMIN = "ADMIN";

    private final UsuarioRepository usuarioRepository;
    private final PerfilRepository perfilRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PerfilRepository perfilRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            JwtProperties jwtProperties
    ) {
        this.usuarioRepository = usuarioRepository;
        this.perfilRepository = perfilRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.jwtProperties = jwtProperties;
    }

    public LoginResponse login(LoginRequest request) {
        String login = request.login().trim();
        Usuario usuario = usuarioRepository.findByEmailIgnoreCaseWithPerfis(login)
                .or(() -> usuarioRepository.findByUsernameIgnoreCaseWithPerfis(login))
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
        return toUsuarioResponse(u);
    }

    /**
     * Setup inicial único: cria o primeiro usuário somente se a tabela estiver vazia.
     * Recebe perfil ADMIN. Bloqueado após o primeiro cadastro — use {@link #login(LoginRequest)}.
     */
    @Transactional
    public UsuarioResponse bootstrap(BootstrapRequest request) {
        if (usuarioRepository.count() > 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Setup inicial já foi concluído. O primeiro usuário existe; use POST /auth/login."
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

        Perfil admin = perfilRepository.findByNome(PERFIL_ADMIN)
                .orElseThrow(() -> new IllegalStateException("Perfil ADMIN não encontrado na base"));
        usuario.getPerfis().add(admin);

        usuario = usuarioRepository.save(usuario);
        usuario = usuarioRepository.findByIdWithPerfis(usuario.getId()).orElse(usuario);
        return toUsuarioResponse(usuario);
    }

    public BootstrapStatusResponse bootstrapStatus() {
        boolean disponivel = usuarioRepository.count() == 0;
        String instrucao = disponivel
                ? "Nenhum usuário cadastrado. Envie POST /auth/bootstrap com corpo JSON: "
                + "{ \"nome\", \"email\", \"username\" (opcional), \"password\" (mín. 6 caracteres) } "
                + "ou defina BOOTSTRAP_ADMIN_PASSWORD e BOOTSTRAP_AUTO_CREATE=true para criar na inicialização. "
                + "O primeiro usuário recebe o perfil ADMIN."
                : "Já existe pelo menos um usuário. Autentique-se com POST /auth/login.";
        return new BootstrapStatusResponse(disponivel, instrucao);
    }

    private UsuarioResponse toUsuarioResponse(Usuario u) {
        List<String> nomesPerfis = u.getPerfis() == null || u.getPerfis().isEmpty()
                ? List.of()
                : u.getPerfis().stream()
                .map(Perfil::getNome)
                .sorted(Comparator.naturalOrder())
                .toList();
        return new UsuarioResponse(
                u.getId(),
                u.getNome(),
                u.getEmail(),
                u.getUsername(),
                Boolean.TRUE.equals(u.getAtivo()),
                nomesPerfis
        );
    }
}
