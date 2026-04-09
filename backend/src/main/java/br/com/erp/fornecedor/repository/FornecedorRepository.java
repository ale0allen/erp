package br.com.erp.fornecedor.repository;

import br.com.erp.fornecedor.entity.Fornecedor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FornecedorRepository extends JpaRepository<Fornecedor, Long> {}

