package br.com.erp.financeiro.spec;

import br.com.erp.financeiro.StatusContaPagar;
import br.com.erp.financeiro.entity.ContaPagar;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public final class ContaPagarSpecifications {

    private ContaPagarSpecifications() {
    }

    public static Specification<ContaPagar> comFiltros(
            Long fornecedorId,
            StatusContaPagar status,
            LocalDate startDueDate,
            LocalDate endDueDate,
            String description,
            LocalDate hoje
    ) {
        return (root, query, cb) -> {
            List<Predicate> p = new ArrayList<>();
            if (fornecedorId != null) {
                p.add(cb.equal(root.get("fornecedor").get("id"), fornecedorId));
            }
            if (startDueDate != null) {
                p.add(cb.greaterThanOrEqualTo(root.get("dataVencimento"), startDueDate));
            }
            if (endDueDate != null) {
                p.add(cb.lessThanOrEqualTo(root.get("dataVencimento"), endDueDate));
            }
            if (description != null && !description.isBlank()) {
                String pattern = "%" + description.trim().toLowerCase(Locale.ROOT) + "%";
                p.add(cb.like(cb.lower(root.get("descricao")), pattern));
            }
            if (status != null) {
                switch (status) {
                    case PAID -> p.add(cb.equal(root.get("status"), StatusContaPagar.PAID));
                    case CANCELLED -> p.add(cb.equal(root.get("status"), StatusContaPagar.CANCELLED));
                    case PENDING -> p.add(cb.and(
                            cb.equal(root.get("status"), StatusContaPagar.PENDING),
                            cb.greaterThanOrEqualTo(root.get("dataVencimento"), hoje)
                    ));
                    case OVERDUE -> p.add(cb.and(
                            cb.equal(root.get("status"), StatusContaPagar.PENDING),
                            cb.lessThan(root.get("dataVencimento"), hoje)
                    ));
                }
            }
            if (p.isEmpty()) {
                return cb.conjunction();
            }
            return cb.and(p.toArray(Predicate[]::new));
        };
    }
}
