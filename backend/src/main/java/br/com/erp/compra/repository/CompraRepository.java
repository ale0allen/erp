package br.com.erp.compra.repository;

import br.com.erp.compra.entity.Compra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CompraRepository extends JpaRepository<Compra, Long> {

    @Query("SELECT c FROM Compra c JOIN FETCH c.fornecedor ORDER BY c.dataCompra DESC, c.id DESC")
    List<Compra> findAllWithFornecedor();

    @Query("SELECT c FROM Compra c JOIN FETCH c.fornecedor LEFT JOIN FETCH c.itens i LEFT JOIN FETCH i.produto WHERE c.id = :id")
    Optional<Compra> findByIdWithItens(Long id);
}

