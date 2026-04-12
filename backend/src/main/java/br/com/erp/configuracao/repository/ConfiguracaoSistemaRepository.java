package br.com.erp.configuracao.repository;

import br.com.erp.configuracao.entity.ConfiguracaoSistema;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfiguracaoSistemaRepository extends JpaRepository<ConfiguracaoSistema, Long> {
}
