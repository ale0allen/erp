package br.com.erp.auth.repository;

import br.com.erp.auth.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmailIgnoreCase(String email);

    Optional<Usuario> findByUsernameIgnoreCase(String username);

    @Query("SELECT DISTINCT u FROM Usuario u LEFT JOIN FETCH u.perfis WHERE u.id = :id")
    Optional<Usuario> findByIdWithPerfis(@Param("id") Long id);

    @Query("SELECT DISTINCT u FROM Usuario u LEFT JOIN FETCH u.perfis WHERE LOWER(u.email) = LOWER(:email)")
    Optional<Usuario> findByEmailIgnoreCaseWithPerfis(@Param("email") String email);

    @Query("SELECT DISTINCT u FROM Usuario u LEFT JOIN FETCH u.perfis WHERE LOWER(u.username) = LOWER(:username)")
    Optional<Usuario> findByUsernameIgnoreCaseWithPerfis(@Param("username") String username);
}
