package br.com.erp.auth.repository;

import br.com.erp.auth.entity.Perfil;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PerfilRepository extends JpaRepository<Perfil, Long> {

    Optional<Perfil> findByNome(String nome);

    List<Perfil> findAllByOrderByNomeAsc();
}
