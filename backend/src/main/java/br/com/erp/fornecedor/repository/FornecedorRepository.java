package br.com.erp.fornecedor.repository;

import br.com.erp.fornecedor.entity.Fornecedor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface FornecedorRepository extends JpaRepository<Fornecedor, Long>, JpaSpecificationExecutor<Fornecedor> {

    @Override
    Page<Fornecedor> findAll(Specification<Fornecedor> spec, Pageable pageable);
}

