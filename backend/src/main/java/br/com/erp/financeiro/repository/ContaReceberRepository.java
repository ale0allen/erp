package br.com.erp.financeiro.repository;

import br.com.erp.financeiro.entity.ContaReceber;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ContaReceberRepository extends JpaRepository<ContaReceber, Long>, JpaSpecificationExecutor<ContaReceber> {

    @EntityGraph(attributePaths = "cliente")
    @Override
    Page<ContaReceber> findAll(Specification<ContaReceber> spec, Pageable pageable);

    boolean existsByVenda_Id(Long vendaId);

    Optional<ContaReceber> findByVenda_Id(Long vendaId);

    @Query("SELECT c FROM ContaReceber c LEFT JOIN FETCH c.cliente ORDER BY c.dataVencimento ASC, c.id DESC")
    List<ContaReceber> findAllWithCliente();

    @Query("SELECT c FROM ContaReceber c LEFT JOIN FETCH c.cliente WHERE c.id = :id")
    Optional<ContaReceber> findByIdWithCliente(Long id);
}
