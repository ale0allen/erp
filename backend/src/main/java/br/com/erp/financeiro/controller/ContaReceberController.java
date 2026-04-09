package br.com.erp.financeiro.controller;

import br.com.erp.financeiro.StatusContaReceber;
import br.com.erp.financeiro.dto.ContaReceberDetailResponse;
import br.com.erp.financeiro.dto.ContaReceberListItemResponse;
import br.com.erp.financeiro.dto.ContaReceberRequest;
import br.com.erp.financeiro.service.ContaReceberService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/contas-receber")
public class ContaReceberController {

    private final ContaReceberService contaReceberService;

    public ContaReceberController(ContaReceberService contaReceberService) {
        this.contaReceberService = contaReceberService;
    }

    @GetMapping
    public List<ContaReceberListItemResponse> listar(
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) StatusContaReceber status,
            @RequestParam(required = false) LocalDate startDueDate,
            @RequestParam(required = false) LocalDate endDueDate,
            @RequestParam(required = false) String description
    ) {
        return contaReceberService.listar(customerId, status, startDueDate, endDueDate, description);
    }

    @GetMapping("/{id}")
    public ContaReceberDetailResponse buscar(@PathVariable Long id) {
        return contaReceberService.buscarPorId(id);
    }

    @PostMapping
    public ContaReceberDetailResponse criar(@RequestBody @Valid ContaReceberRequest request) {
        return contaReceberService.criar(request);
    }

    @PutMapping("/{id}")
    public ContaReceberDetailResponse atualizar(@PathVariable Long id, @RequestBody @Valid ContaReceberRequest request) {
        return contaReceberService.atualizar(id, request);
    }

    @PostMapping("/{id}/receber")
    public ContaReceberDetailResponse receber(@PathVariable Long id) {
        return contaReceberService.marcarRecebido(id);
    }

    @PostMapping("/{id}/cancelar")
    public ContaReceberDetailResponse cancelar(@PathVariable Long id) {
        return contaReceberService.cancelar(id);
    }
}
