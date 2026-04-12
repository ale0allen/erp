package br.com.erp.auth.controller;

import br.com.erp.auth.dto.UsuarioAdminResponse;
import br.com.erp.auth.dto.UsuarioCreateRequest;
import br.com.erp.auth.dto.UsuarioUpdateRequest;
import br.com.erp.auth.service.UsuarioManagementService;
import br.com.erp.common.dto.PageResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioManagementService usuarioManagementService;

    public UsuarioController(UsuarioManagementService usuarioManagementService) {
        this.usuarioManagementService = usuarioManagementService;
    }

    @GetMapping
    public PageResponse<UsuarioAdminResponse> listar(
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.ASC) Pageable pageable,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Boolean ativo
    ) {
        return usuarioManagementService.listarPaginado(pageable, q, ativo);
    }

    @GetMapping("/{id}")
    public UsuarioAdminResponse buscar(@PathVariable Long id) {
        return usuarioManagementService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioAdminResponse criar(@RequestBody @Valid UsuarioCreateRequest request) {
        return usuarioManagementService.criar(request);
    }

    @PutMapping("/{id}")
    public UsuarioAdminResponse atualizar(
            @PathVariable Long id,
            @RequestBody @Valid UsuarioUpdateRequest request
    ) {
        return usuarioManagementService.atualizar(id, request);
    }
}
