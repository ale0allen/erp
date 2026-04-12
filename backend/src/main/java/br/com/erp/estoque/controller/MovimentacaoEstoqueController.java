package br.com.erp.estoque.controller;

import br.com.erp.estoque.dto.MovimentacaoEstoqueRequest;
import br.com.erp.estoque.dto.MovimentacaoEstoqueResponse;
import br.com.erp.estoque.service.MovimentacaoEstoqueService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movimentacoes-estoque")
public class MovimentacaoEstoqueController {

    private final MovimentacaoEstoqueService movimentacaoEstoqueService;

    public MovimentacaoEstoqueController(MovimentacaoEstoqueService movimentacaoEstoqueService) {
        this.movimentacaoEstoqueService = movimentacaoEstoqueService;
    }

    @GetMapping
    public List<MovimentacaoEstoqueResponse> listar() {
        return movimentacaoEstoqueService.listarTodos();
    }

    @PostMapping
    public MovimentacaoEstoqueResponse registrar(@RequestBody @Valid MovimentacaoEstoqueRequest request) {
        return movimentacaoEstoqueService.registrar(request);
    }
}
