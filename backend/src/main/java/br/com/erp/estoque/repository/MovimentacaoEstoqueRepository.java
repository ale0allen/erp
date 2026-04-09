package br.com.erp.estoque.repository;

import br.com.erp.estoque.entity.MovimentacaoEstoque;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovimentacaoEstoqueRepository extends JpaRepository<MovimentacaoEstoque, Long> {

    List<MovimentacaoEstoque> findAllByOrderByDataMovimentacaoDesc();
}
