package br.com.erp.produto.spec;

import br.com.erp.produto.entity.Produto;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public final class ProdutoSpecifications {

    private ProdutoSpecifications() {
    }

    public static Specification<Produto> comFiltros(String q, Long categoriaId, Boolean ativo) {
        return (root, query, cb) -> {
            List<Predicate> p = new ArrayList<>();
            if (q != null && !q.isBlank()) {
                String pattern = "%" + q.trim().toLowerCase(Locale.ROOT) + "%";
                p.add(cb.or(
                        cb.like(cb.lower(root.get("codigo")), pattern),
                        cb.like(cb.lower(root.get("nome")), pattern)
                ));
            }
            if (categoriaId != null) {
                p.add(cb.equal(root.get("categoria").get("id"), categoriaId));
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
