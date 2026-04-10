package br.com.erp.fornecedor.controller;

import br.com.erp.fornecedor.dto.FornecedorRequest;
import br.com.erp.fornecedor.dto.FornecedorResponse;
import br.com.erp.fornecedor.service.FornecedorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "https://erp-six-omega.vercel.app")
@RestController
@RequestMapping("/fornecedores")
public class FornecedorController {

    private final FornecedorService fornecedorService;

    public FornecedorController(FornecedorService fornecedorService) {
        this.fornecedorService = fornecedorService;
    }

    @GetMapping
    public List<FornecedorResponse> listar() {
        return fornecedorService.listarTodos();
    }

    @GetMapping("/{id}")
    public FornecedorResponse buscar(@PathVariable Long id) {
        return fornecedorService.buscarPorId(id);
    }

    @PostMapping
    public FornecedorResponse salvar(@RequestBody @Valid FornecedorRequest request) {
        return fornecedorService.salvar(request);
    }

    @PutMapping("/{id}")
    public FornecedorResponse atualizar(@PathVariable Long id, @RequestBody @Valid FornecedorRequest request) {
        return fornecedorService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        fornecedorService.excluir(id);
    }
}

