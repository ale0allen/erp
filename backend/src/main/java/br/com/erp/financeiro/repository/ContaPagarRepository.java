package br.com.erp.financeiro.repository;

import br.com.erp.financeiro.entity.ContaPagar;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ContaPagarRepository extends JpaRepository<ContaPagar, Long>, JpaSpecificationExecutor<ContaPagar> {

    @EntityGraph(attributePaths = "fornecedor")
    @Override
    Page<ContaPagar> findAll(Specification<ContaPagar> spec, Pageable pageable);

    boolean existsByCompra_Id(Long compraId);

    Optional<ContaPagar> findByCompra_Id(Long compraId);

    @Query("SELECT c FROM ContaPagar c LEFT JOIN FETCH c.fornecedor ORDER BY c.dataVencimento ASC, c.id DESC")
    List<ContaPagar> findAllWithFornecedor();

    @Query("SELECT c FROM ContaPagar c LEFT JOIN FETCH c.fornecedor WHERE c.id = :id")
    Optional<ContaPagar> findByIdWithFornecedor(Long id);
}

