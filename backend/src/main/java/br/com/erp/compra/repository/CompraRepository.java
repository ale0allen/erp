package br.com.erp.compra.repository;

import br.com.erp.compra.entity.Compra;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CompraRepository extends JpaRepository<Compra, Long>, JpaSpecificationExecutor<Compra> {

    @EntityGraph(attributePaths = "fornecedor")
    @Override
    Page<Compra> findAll(Specification<Compra> spec, Pageable pageable);

    @Query("SELECT c FROM Compra c JOIN FETCH c.fornecedor ORDER BY c.dataCompra DESC, c.id DESC")
    List<Compra> findAllWithFornecedor();

    @Query("SELECT c FROM Compra c JOIN FETCH c.fornecedor LEFT JOIN FETCH c.itens i LEFT JOIN FETCH i.produto WHERE c.id = :id")
    Optional<Compra> findByIdWithItens(Long id);
}

