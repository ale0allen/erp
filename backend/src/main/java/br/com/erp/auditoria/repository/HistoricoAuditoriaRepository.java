package br.com.erp.auditoria.repository;

import br.com.erp.auditoria.entity.HistoricoAuditoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface HistoricoAuditoriaRepository
        extends JpaRepository<HistoricoAuditoria, Long>, JpaSpecificationExecutor<HistoricoAuditoria> {
}
