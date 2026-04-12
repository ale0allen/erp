package br.com.erp.auth.service;

import br.com.erp.audit.AuditoriaService;
import br.com.erp.audit.dto.AuditoriaResponse;
import br.com.erp.auditoria.AuditoriaHistoricoAcoes;
import br.com.erp.auditoria.AuditoriaHistoricoModulos;
import br.com.erp.auditoria.service.AuditoriaHistoricoService;
import br.com.erp.auth.dto.UsuarioAdminResponse;
import br.com.erp.auth.dto.UsuarioCreateRequest;
import br.com.erp.auth.dto.UsuarioUpdateRequest;
import br.com.erp.auth.entity.Perfil;
import br.com.erp.auth.entity.Usuario;
import br.com.erp.auth.repository.PerfilRepository;
import br.com.erp.auth.repository.UsuarioRepository;
import br.com.erp.auth.spec.UsuarioSpecifications;
import br.com.erp.common.dto.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UsuarioManagementService {

    private static final String PERFIL_ADMIN = "ADMIN";

    private final UsuarioRepository usuarioRepository;
    private final PerfilRepository perfilRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditoriaService auditoriaService;
    private final AuditoriaHistoricoService auditoriaHistoricoService;

    public UsuarioManagementService(
            UsuarioRepository usuarioRepository,
            PerfilRepository perfilRepository,
            PasswordEncoder passwordEncoder,
            AuditoriaService auditoriaService,
            AuditoriaHistoricoService auditoriaHistoricoService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.perfilRepository = perfilRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditoriaService = auditoriaService;
        this.auditoriaHistoricoService = auditoriaHistoricoService;
    }

    @Transactional(readOnly = true)
    public PageResponse<UsuarioAdminResponse> listarPaginado(Pageable pageable, String q, Boolean ativo) {
        Page<Usuario> page = usuarioRepository.findAll(
                UsuarioSpecifications.comFiltros(q, ativo),
                pageable
        );
        Map<Long, String> nomes = auditoriaService.carregarNomesParaEntidades(page.getContent());
        return PageResponse.from(page.map(u -> toAdminResponse(u, nomes)));
    }

    @Transactional(readOnly = true)
    public UsuarioAdminResponse buscarPorId(Long id) {
        Usuario u = usuarioRepository.findByIdWithPerfis(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));
        return toAdminResponse(u);
    }

    @Transactional
    public UsuarioAdminResponse criar(UsuarioCreateRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        usuarioRepository.findByEmailIgnoreCase(email).ifPresent(u -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado.");
        });

        if (request.username() != null && !request.username().isBlank()) {
            String un = request.username().trim();
            usuarioRepository.findByUsernameIgnoreCase(un).ifPresent(u -> {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Nome de usuário já em uso.");
            });
        }

        Set<Perfil> perfis = resolverPerfis(request.perfis());

        Usuario u = new Usuario();
        u.setNome(request.nome().trim());
        u.setEmail(email);
        if (request.username() != null && !request.username().isBlank()) {
            u.setUsername(request.username().trim());
        }
        u.setSenhaHash(passwordEncoder.encode(request.password()));
        u.setAtivo(request.ativo() != null ? request.ativo() : true);
        u.getPerfis().addAll(perfis);

        u = usuarioRepository.save(u);
        u = usuarioRepository.findByIdWithPerfis(u.getId()).orElse(u);
        auditoriaHistoricoService.registrar(
                AuditoriaHistoricoAcoes.USER_CREATED,
                AuditoriaHistoricoModulos.USER,
                u.getId(),
                "Usuário criado: " + u.getEmail()
        );
        return toAdminResponse(u);
    }

    @Transactional
    public UsuarioAdminResponse atualizar(Long id, UsuarioUpdateRequest request) {
        Usuario u = usuarioRepository.findByIdWithPerfis(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));

        boolean ativoAntes = Boolean.TRUE.equals(u.getAtivo());
        Set<String> perfisAntes = u.getPerfis() == null || u.getPerfis().isEmpty()
                ? Set.of()
                : u.getPerfis().stream()
                .map(Perfil::getNome)
                .collect(Collectors.toCollection(TreeSet::new));

        String novoEmail = request.email().trim().toLowerCase(Locale.ROOT);
        if (!novoEmail.equalsIgnoreCase(u.getEmail())) {
            if (usuarioRepository.existsByEmailIgnoreCaseAndIdNot(novoEmail, u.getId())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado para outro usuário.");
            }
            u.setEmail(novoEmail);
        }

        if (request.username() != null && !request.username().isBlank()) {
            String un = request.username().trim();
            if (u.getUsername() == null || !un.equalsIgnoreCase(u.getUsername())) {
                if (usuarioRepository.existsByUsernameIgnoreCaseAndIdNot(un, u.getId())) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Nome de usuário já em uso.");
                }
            }
            u.setUsername(un);
        } else {
            u.setUsername(null);
        }

        Set<Perfil> novosPerfis = resolverPerfis(request.perfis());
        assertUltimoAdminPreservado(u, request.ativo(), novosPerfis);

        u.setNome(request.nome().trim());
        u.setAtivo(request.ativo());
        u.getPerfis().clear();
        u.getPerfis().addAll(novosPerfis);

        if (request.password() != null && !request.password().isBlank()) {
            if (request.password().length() < 6 || request.password().length() > 128) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "A nova senha deve ter entre 6 e 128 caracteres."
                );
            }
            u.setSenhaHash(passwordEncoder.encode(request.password()));
        }

        u = usuarioRepository.save(u);
        u = usuarioRepository.findByIdWithPerfis(u.getId()).orElse(u);

        Set<String> perfisDepois = u.getPerfis() == null || u.getPerfis().isEmpty()
                ? Set.of()
                : u.getPerfis().stream()
                .map(Perfil::getNome)
                .collect(Collectors.toCollection(TreeSet::new));
        boolean ativoDepois = Boolean.TRUE.equals(u.getAtivo());

        if (ativoAntes && !ativoDepois) {
            auditoriaHistoricoService.registrar(
                    AuditoriaHistoricoAcoes.USER_INACTIVATED,
                    AuditoriaHistoricoModulos.USER,
                    u.getId(),
                    "Usuário inativado: " + u.getEmail()
            );
        } else if (!perfisAntes.equals(perfisDepois)) {
            auditoriaHistoricoService.registrar(
                    AuditoriaHistoricoAcoes.USER_ROLE_CHANGED,
                    AuditoriaHistoricoModulos.USER,
                    u.getId(),
                    "Perfis atualizados (" + String.join(", ", perfisDepois) + "): " + u.getEmail()
            );
        } else {
            auditoriaHistoricoService.registrar(
                    AuditoriaHistoricoAcoes.USER_UPDATED,
                    AuditoriaHistoricoModulos.USER,
                    u.getId(),
                    "Usuário atualizado: " + u.getEmail()
            );
        }

        return toAdminResponse(u);
    }

    private void assertUltimoAdminPreservado(Usuario existente, boolean novoAtivo, Set<Perfil> novosPerfis) {
        boolean tinhaAdminAtivo = isAdminAtivo(existente);
        boolean teraAdminAtivo = novoAtivo && novosPerfis.stream()
                .anyMatch(p -> PERFIL_ADMIN.equals(p.getNome()));

        if (tinhaAdminAtivo && !teraAdminAtivo) {
            long adminsAtivos = usuarioRepository.countUsuariosAtivosComPerfil(PERFIL_ADMIN);
            if (adminsAtivos <= 1) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Não é possível alterar perfil ou situação do último administrador ativo."
                );
            }
        }
    }

    private static boolean isAdminAtivo(Usuario u) {
        return Boolean.TRUE.equals(u.getAtivo())
                && u.getPerfis() != null
                && u.getPerfis().stream().anyMatch(p -> PERFIL_ADMIN.equals(p.getNome()));
    }

    private Set<Perfil> resolverPerfis(List<String> nomes) {
        Set<String> unicos = nomes.stream()
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toCollection(LinkedHashSet::new));
        if (unicos.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe ao menos um perfil válido.");
        }
        Set<Perfil> resultado = new HashSet<>();
        for (String nome : unicos) {
            Perfil p = perfilRepository.findByNome(nome)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Perfil inválido: " + nome
                    ));
            resultado.add(p);
        }
        return resultado;
    }

    private UsuarioAdminResponse toAdminResponse(Usuario u) {
        return toAdminResponse(u, auditoriaService.carregarNomesParaEntidades(List.of(u)));
    }

    private UsuarioAdminResponse toAdminResponse(Usuario u, Map<Long, String> nomesAuditoria) {
        List<String> nomesPerfis = u.getPerfis() == null || u.getPerfis().isEmpty()
                ? List.of()
                : u.getPerfis().stream()
                .map(Perfil::getNome)
                .sorted(Comparator.naturalOrder())
                .toList();
        AuditoriaResponse auditoria = auditoriaService.toResponse(u, nomesAuditoria);
        return new UsuarioAdminResponse(
                u.getId(),
                u.getNome(),
                u.getEmail(),
                u.getUsername(),
                Boolean.TRUE.equals(u.getAtivo()),
                nomesPerfis,
                auditoria
        );
    }
}
