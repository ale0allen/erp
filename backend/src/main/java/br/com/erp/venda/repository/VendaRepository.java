package br.com.erp.venda.repository;

import br.com.erp.venda.entity.Venda;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface VendaRepository extends JpaRepository<Venda, Long>, JpaSpecificationExecutor<Venda> {

    @EntityGraph(attributePaths = "cliente")
    @Override
    Page<Venda> findAll(Specification<Venda> spec, Pageable pageable);

    @Query("SELECT v FROM Venda v JOIN FETCH v.cliente ORDER BY v.dataVenda DESC, v.id DESC")
    List<Venda> findAllWithCliente();

    @Query("SELECT v FROM Venda v JOIN FETCH v.cliente LEFT JOIN FETCH v.itens i LEFT JOIN FETCH i.produto WHERE v.id = :id")
    Optional<Venda> findByIdWithItens(Long id);
}

