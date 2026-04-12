package br.com.erp.compra.spec;

import br.com.erp.compra.StatusCompra;
import br.com.erp.compra.entity.Compra;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

public final class CompraSpecifications {

    private CompraSpecifications() {
    }

    public static Specification<Compra> comFiltros(
            Long fornecedorId,
            StatusCompra status,
            LocalDate startDate,
            LocalDate endDate
    ) {
        return (root, query, cb) -> {
            List<Predicate> p = new ArrayList<>();
            if (fornecedorId != null) {
                p.add(cb.equal(root.get("fornecedor").get("id"), fornecedorId));
            }
            if (status != null) {
                p.add(cb.equal(root.get("status"), status));
            }
            if (startDate != null) {
                Instant start = startDate.atStartOfDay(ZoneOffset.UTC).toInstant();
                p.add(cb.greaterThanOrEqualTo(root.get("dataCompra"), start));
            }
            if (endDate != null) {
                Instant endExclusive = endDate.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();
                p.add(cb.lessThan(root.get("dataCompra"), endExclusive));
            }
            if (p.isEmpty()) {
                return cb.conjunction();
            }
            return cb.and(p.toArray(Predicate[]::new));
        };
    }
}
