package br.com.erp.auth.spec;

import br.com.erp.auth.entity.Usuario;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public final class UsuarioSpecifications {

    private UsuarioSpecifications() {
    }

    public static Specification<Usuario> comFiltros(String q, Boolean ativo) {
        return (root, query, cb) -> {
            List<Predicate> p = new ArrayList<>();
            if (q != null && !q.isBlank()) {
                String pattern = "%" + q.trim().toLowerCase(Locale.ROOT) + "%";
                Predicate nome = cb.like(cb.lower(root.get("nome")), pattern);
                Predicate email = cb.like(cb.lower(root.get("email")), pattern);
                Predicate username = cb.and(
                        cb.isNotNull(root.get("username")),
                        cb.like(cb.lower(root.get("username")), pattern)
                );
                p.add(cb.or(nome, email, username));
            }
            if (ativo != null) {
                p.add(cb.equal(root.get("ativo"), ativo));
            }
            if (p.isEmpty()) {
                return cb.conjunction();
            }
            return cb.and(p.toArray(Predicate[]::new));
        };
    }
}
