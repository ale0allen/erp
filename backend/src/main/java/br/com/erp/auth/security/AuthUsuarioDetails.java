package br.com.erp.auth.security;

import br.com.erp.auth.entity.Perfil;
import br.com.erp.auth.entity.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
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
                .map(nome -> new SimpleGrantedAuthority("ROLE_" + nome))
                .collect(Collectors.toList());
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
