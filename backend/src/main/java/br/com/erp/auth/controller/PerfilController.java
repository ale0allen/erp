package br.com.erp.auth.controller;

import br.com.erp.auth.dto.PerfilOptionResponse;
import br.com.erp.auth.repository.PerfilRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/perfis")
public class PerfilController {

    private final PerfilRepository perfilRepository;

    public PerfilController(PerfilRepository perfilRepository) {
        this.perfilRepository = perfilRepository;
    }

    @GetMapping
    public List<PerfilOptionResponse> listar() {
        return perfilRepository.findAllByOrderByNomeAsc().stream()
                .map(p -> new PerfilOptionResponse(p.getId(), p.getNome()))
                .toList();
    }
}
