package br.com.erp.fornecedor.spec;

import br.com.erp.fornecedor.entity.Fornecedor;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public final class FornecedorSpecifications {

    private FornecedorSpecifications() {
    }

    public static Specification<Fornecedor> comFiltros(String q, Boolean ativo) {
        return (root, query, cb) -> {
            List<Predicate> p = new ArrayList<>();
            if (q != null && !q.isBlank()) {
                String pattern = "%" + q.trim().toLowerCase(Locale.ROOT) + "%";
                Predicate nome = cb.like(cb.lower(root.get("nome")), pattern);
                Predicate email = cb.and(
                        cb.isNotNull(root.get("email")),
                        cb.like(cb.lower(root.get("email")), pattern)
                );
                Predicate doc = cb.and(
                        cb.isNotNull(root.get("documento")),
                        cb.like(cb.lower(root.get("documento")), pattern)
                );
                p.add(cb.or(nome, email, doc));
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
