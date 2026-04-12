package br.com.erp.auditoria.service;

import br.com.erp.auditoria.dto.HistoricoAuditoriaResponse;
import br.com.erp.auditoria.entity.HistoricoAuditoria;
import br.com.erp.auditoria.repository.HistoricoAuditoriaRepository;
import br.com.erp.auth.entity.Usuario;
import br.com.erp.auth.repository.UsuarioRepository;
import br.com.erp.auth.security.AuthUsuarioDetails;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AuditoriaHistoricoService {

    private final HistoricoAuditoriaRepository historicoAuditoriaRepository;
    private final UsuarioRepository usuarioRepository;

    public AuditoriaHistoricoService(
            HistoricoAuditoriaRepository historicoAuditoriaRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.historicoAuditoriaRepository = historicoAuditoriaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Registra um evento no histórico. Usuário obtido do contexto de segurança (pode ser nulo fora de requisição autenticada).
     */
    @Transactional
    public void registrar(String acao, String modulo, Long entidadeId, String descricao) {
        HistoricoAuditoria h = new HistoricoAuditoria();
        h.setAcao(acao);
        h.setModulo(modulo);
        h.setEntidadeId(entidadeId);
        h.setDescricao(descricao);
        h.setUsuarioId(resolveUsuarioIdAtual());
        h.setRealizadoEm(Instant.now());
        historicoAuditoriaRepository.save(h);
    }

    @Transactional(readOnly = true)
    public Page<HistoricoAuditoriaResponse> listar(
            Pageable pageable,
            Long usuarioId,
            String modulo,
            String acao,
            Instant inicio,
            Instant fim
    ) {
        Specification<HistoricoAuditoria> spec = montarEspecificacao(usuarioId, modulo, acao, inicio, fim);
        Page<HistoricoAuditoria> page = historicoAuditoriaRepository.findAll(spec, pageable);
        Map<Long, String> nomesPorId = carregarNomesUsuarios(page.getContent());
        return page.map(h -> toResponse(h, nomesPorId));
    }

    @Transactional(readOnly = true)
    public HistoricoAuditoriaResponse buscarPorId(Long id) {
        HistoricoAuditoria h = historicoAuditoriaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registro não encontrado."));
        Long uid = h.getUsuarioId();
        Map<Long, String> nomes = uid == null
                ? Map.of()
                : usuarioRepository.findById(uid)
                .map(u -> Map.of(u.getId(), u.getNome()))
                .orElse(Map.of());
        return toResponse(h, nomes);
    }

    private static Long resolveUsuarioIdAtual() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }
        if (auth.getPrincipal() instanceof AuthUsuarioDetails details) {
            return details.getUsuario().getId();
        }
        return null;
    }

    private Map<Long, String> carregarNomesUsuarios(List<HistoricoAuditoria> linhas) {
        Set<Long> ids = linhas.stream()
                .map(HistoricoAuditoria::getUsuarioId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        if (ids.isEmpty()) {
            return Map.of();
        }
        Map<Long, String> map = new HashMap<>();
        for (Usuario u : usuarioRepository.findAllById(ids)) {
            map.put(u.getId(), u.getNome());
        }
        return map;
    }

    private static Specification<HistoricoAuditoria> montarEspecificacao(
            Long usuarioId,
            String modulo,
            String acao,
            Instant inicio,
            Instant fim
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (usuarioId != null) {
                predicates.add(cb.equal(root.get("usuarioId"), usuarioId));
            }
            if (modulo != null && !modulo.isBlank()) {
                predicates.add(cb.equal(root.get("modulo"), modulo.trim()));
            }
            if (acao != null && !acao.isBlank()) {
                predicates.add(cb.equal(root.get("acao"), acao.trim()));
            }
            if (inicio != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("realizadoEm"), inicio));
            }
            if (fim != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("realizadoEm"), fim));
            }
            if (predicates.isEmpty()) {
                return cb.conjunction();
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }

    private static HistoricoAuditoriaResponse toResponse(HistoricoAuditoria h, Map<Long, String> nomesPorId) {
        Long uid = h.getUsuarioId();
        String nome = uid != null ? nomesPorId.get(uid) : null;
        return new HistoricoAuditoriaResponse(
                h.getId(),
                h.getAcao(),
                h.getModulo(),
                h.getEntidadeId(),
                h.getDescricao(),
                uid,
                nome,
                h.getRealizadoEm()
        );
    }
}
