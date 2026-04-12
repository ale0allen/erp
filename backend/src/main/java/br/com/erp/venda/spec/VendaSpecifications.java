package br.com.erp.venda.spec;

import br.com.erp.venda.StatusVenda;
import br.com.erp.venda.entity.Venda;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

public final class VendaSpecifications {

    private VendaSpecifications() {
    }

    public static Specification<Venda> comFiltros(
            Long clienteId,
            StatusVenda status,
            LocalDate startDate,
            LocalDate endDate
    ) {
        return (root, query, cb) -> {
            List<Predicate> p = new ArrayList<>();
            if (clienteId != null) {
                p.add(cb.equal(root.get("cliente").get("id"), clienteId));
            }
            if (status != null) {
                p.add(cb.equal(root.get("status"), status));
            }
            if (startDate != null) {
                Instant start = startDate.atStartOfDay(ZoneOffset.UTC).toInstant();
                p.add(cb.greaterThanOrEqualTo(root.get("dataVenda"), start));
            }
            if (endDate != null) {
                Instant endExclusive = endDate.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();
                p.add(cb.lessThan(root.get("dataVenda"), endExclusive));
            }
            if (p.isEmpty()) {
                return cb.conjunction();
            }
            return cb.and(p.toArray(Predicate[]::new));
        };
    }
}
