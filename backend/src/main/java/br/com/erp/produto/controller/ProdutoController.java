package br.com.erp.produto.controller;

import br.com.erp.produto.dto.ProdutoRequest;
import br.com.erp.produto.dto.ProdutoResumoResponse;
import br.com.erp.produto.dto.ProdutoResponse;
import br.com.erp.produto.dto.RelatorioEstoqueItemResponse;
import br.com.erp.produto.dto.StatusEstoque;
import br.com.erp.produto.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @GetMapping
    public List<ProdutoResponse> listar() {
        return produtoService.listarTodos();
    }

    @GetMapping("/resumo")
    public ProdutoResumoResponse resumo() {
        return produtoService.resumo();
    }

    @GetMapping("/relatorio-estoque")
    public List<RelatorioEstoqueItemResponse> relatorioEstoque(
            @RequestParam(required = false) String productName,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) StatusEstoque stockStatus,
            @RequestParam(required = false) Boolean active
    ) {
        return produtoService.relatorioEstoque(productName, categoryId, stockStatus, active);
    }

    @PostMapping
    public ProdutoResponse salvar(@RequestBody @Valid ProdutoRequest request) {
        return produtoService.salvar(request);
    }

    @PutMapping("/{id}")
    public ProdutoResponse atualizar(@PathVariable Long id, @RequestBody @Valid ProdutoRequest request) {
        return produtoService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        produtoService.excluir(id);
    }
}