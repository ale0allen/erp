package br.com.erp.categoria.spec;

import br.com.erp.categoria.entity.Categoria;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public final class CategoriaSpecifications {

    private CategoriaSpecifications() {
    }

    public static Specification<Categoria> comFiltros(String q, Boolean ativo) {
        return (root, query, cb) -> {
            List<Predicate> p = new ArrayList<>();
            if (q != null && !q.isBlank()) {
                String pattern = "%" + q.trim().toLowerCase(Locale.ROOT) + "%";
                p.add(cb.like(cb.lower(root.get("nome")), pattern));
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
