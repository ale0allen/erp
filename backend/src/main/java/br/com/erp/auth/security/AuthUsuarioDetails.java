package br.com.erp.auth.security;

import br.com.erp.auth.entity.Perfil;
import br.com.erp.auth.entity.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;

public class AuthUsuarioDetails implements UserDetails {

    private final Usuario usuario;

    public AuthUsuarioDetails(Usuario usuario) {
        this.usuario = usuario;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (usuario.getPerfis() == null || usuario.getPerfis().isEmpty()) {
            return List.of();
        }
        return usuario.getPerfis().stream()
                .map(Perfil::getNome)
                .map(AuthUsuarioDetails::toSpringRoleAuthority)
                .filter(Objects::nonNull)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    /**
     * Converte o nome do perfil (ex.: coluna {@code perfil.nome}) na authority esperada pelo Spring Security.
     * <ul>
     *   <li>{@code hasRole("ADMIN")} compara com a authority {@code ROLE_ADMIN} (prefixo único).</li>
     *   <li>Nomes gravados com casing misto (ex.: {@code Admin}) ou com prefixo duplicado ({@code ROLE_ADMIN}
     *       na base) geravam authorities que não batiam com {@code hasRole}/{@code hasAnyRole} do {@code SecurityConfig}.</li>
     * </ul>
     */
    static String toSpringRoleAuthority(String nomePerfil) {
        if (nomePerfil == null) {
            return null;
        }
        String n = nomePerfil.trim();
        if (n.isEmpty()) {
            return null;
        }
        if (n.length() >= 5 && n.regionMatches(true, 0, "ROLE_", 0, 5)) {
            n = n.substring(5).trim();
        }
        if (n.isEmpty()) {
            return null;
        }
        return "ROLE_" + n.toUpperCase(Locale.ROOT);
    }

    @Override
    public String getPassword() {
        return usuario.getSenhaHash();
    }

    @Override
    public String getUsername() {
        return usuario.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return Boolean.TRUE.equals(usuario.getAtivo());
    }
}
