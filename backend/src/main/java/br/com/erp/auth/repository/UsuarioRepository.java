package br.com.erp.auth.repository;

import br.com.erp.auth.entity.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long>, JpaSpecificationExecutor<Usuario> {

    @EntityGraph(attributePaths = "perfis")
    @Override
    Page<Usuario> findAll(Specification<Usuario> spec, Pageable pageable);

    Optional<Usuario> findByEmailIgnoreCase(String email);

    Optional<Usuario> findByUsernameIgnoreCase(String username);

    boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);

    boolean existsByUsernameIgnoreCaseAndIdNot(String username, Long id);

    @EntityGraph(attributePaths = "perfis")
    List<Usuario> findAllByOrderByIdAsc();

    @Query("SELECT COUNT(DISTINCT u.id) FROM Usuario u JOIN u.perfis p WHERE p.nome = :nome AND u.ativo = true")
    long countUsuariosAtivosComPerfil(@Param("nome") String nome);

    @Query("SELECT DISTINCT u FROM Usuario u LEFT JOIN FETCH u.perfis WHERE u.id = :id")
    Optional<Usuario> findByIdWithPerfis(@Param("id") Long id);

    @Query("SELECT DISTINCT u FROM Usuario u LEFT JOIN FETCH u.perfis WHERE LOWER(u.email) = LOWER(:email)")
    Optional<Usuario> findByEmailIgnoreCaseWithPerfis(@Param("email") String email);

    @Query("SELECT DISTINCT u FROM Usuario u LEFT JOIN FETCH u.perfis WHERE LOWER(u.username) = LOWER(:username)")
    Optional<Usuario> findByUsernameIgnoreCaseWithPerfis(@Param("username") String username);
}
