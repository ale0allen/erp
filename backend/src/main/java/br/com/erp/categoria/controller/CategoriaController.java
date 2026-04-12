package br.com.erp.categoria.controller;

import br.com.erp.categoria.dto.CategoriaRequest;
import br.com.erp.categoria.dto.CategoriaResponse;
import br.com.erp.categoria.service.CategoriaService;
import br.com.erp.common.dto.PageResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping
    public PageResponse<CategoriaResponse> listar(
            @PageableDefault(size = 20, sort = "nome", direction = Sort.Direction.ASC) Pageable pageable,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Boolean ativo
    ) {
        return categoriaService.listarPaginado(pageable, q, ativo);
    }

    @GetMapping("/todas")
    public List<CategoriaResponse> listarTodas() {
        return categoriaService.listarTodas();
    }

    @GetMapping("/{id}")
    public CategoriaResponse buscar(@PathVariable Long id) {
        return categoriaService.buscarPorId(id);
    }

    @PostMapping
    public CategoriaResponse salvar(@RequestBody @Valid CategoriaRequest request) {
        return categoriaService.salvar(request);
    }

    @PutMapping("/{id}")
    public CategoriaResponse atualizar(@PathVariable Long id, @RequestBody @Valid CategoriaRequest request) {
        return categoriaService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        categoriaService.excluir(id);
    }
}
