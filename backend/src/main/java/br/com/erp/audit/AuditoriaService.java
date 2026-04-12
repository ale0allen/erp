package br.com.erp.audit;

import br.com.erp.audit.dto.AuditoriaResponse;
import br.com.erp.auth.entity.Usuario;
import br.com.erp.auth.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AuditoriaService {

    private final UsuarioRepository usuarioRepository;

    public AuditoriaService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Map<Long, String> carregarNomesPorIds(Collection<Long> ids) {
        Set<Long> uniq = ids.stream().filter(Objects::nonNull).collect(Collectors.toSet());
        if (uniq.isEmpty()) {
            return Map.of();
        }
        Map<Long, String> map = new HashMap<>();
        for (Usuario u : usuarioRepository.findAllById(uniq)) {
            map.put(u.getId(), u.getNome());
        }
        return map;
    }

    public Map<Long, String> carregarNomesParaEntidades(Collection<? extends EntidadeAuditavel> entidades) {
        Set<Long> ids = new HashSet<>();
        for (EntidadeAuditavel e : entidades) {
            if (e.getCriadoPorId() != null) {
                ids.add(e.getCriadoPorId());
            }
            if (e.getAtualizadoPorId() != null) {
                ids.add(e.getAtualizadoPorId());
            }
        }
        return carregarNomesPorIds(ids);
    }

    public AuditoriaResponse toResponse(EntidadeAuditavel e, Map<Long, String> nomesPorId) {
        if (e == null || e.getCriadoEm() == null) {
            return new AuditoriaResponse(null, null, null, null, null, null);
        }
        return new AuditoriaResponse(
                e.getCriadoEm(),
                e.getAtualizadoEm(),
                e.getCriadoPorId(),
                e.getAtualizadoPorId(),
                lookup(nomesPorId, e.getCriadoPorId()),
                lookup(nomesPorId, e.getAtualizadoPorId())
        );
    }

    public AuditoriaResponse toResponse(EntidadeAuditavel e) {
        if (e == null || e.getCriadoEm() == null) {
            return new AuditoriaResponse(null, null, null, null, null, null);
        }
        Set<Long> ids = new HashSet<>();
        if (e.getCriadoPorId() != null) {
            ids.add(e.getCriadoPorId());
        }
        if (e.getAtualizadoPorId() != null) {
            ids.add(e.getAtualizadoPorId());
        }
        Map<Long, String> nomes = carregarNomesPorIds(ids);
        return toResponse(e, nomes);
    }

    private static String lookup(Map<Long, String> nomes, Long id) {
        if (id == null) {
            return null;
        }
        return nomes.get(id);
    }
}
