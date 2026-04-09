package br.com.erp.produto.repository;

import br.com.erp.produto.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    @Query("SELECT p FROM Produto p JOIN FETCH p.categoria ORDER BY p.codigo ASC")
    List<Produto> findAllWithCategoria();

    long countByAtivoTrue();

    long countByAtivoFalse();

    long countByCategoria_Id(Long categoriaId);

    long countBySaldoEstoque(int saldoEstoque);

    long countBySaldoEstoqueGreaterThanAndSaldoEstoqueLessThanEqual(int minExclusive, int maxInclusive);

    @Query("SELECT COALESCE(SUM(p.saldoEstoque), 0) FROM Produto p")
    long somaSaldoEstoque();
}