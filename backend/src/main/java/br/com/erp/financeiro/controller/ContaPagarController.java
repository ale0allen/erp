package br.com.erp.financeiro.controller;

import br.com.erp.financeiro.StatusContaPagar;
import br.com.erp.financeiro.dto.ContaPagarDetailResponse;
import br.com.erp.financeiro.dto.ContaPagarListItemResponse;
import br.com.erp.financeiro.dto.ContaPagarRequest;
import br.com.erp.financeiro.service.ContaPagarService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/contas-pagar")
public class ContaPagarController {

    private final ContaPagarService contaPagarService;

    public ContaPagarController(ContaPagarService contaPagarService) {
        this.contaPagarService = contaPagarService;
    }

    @GetMapping
    public List<ContaPagarListItemResponse> listar(
            @RequestParam(required = false) Long fornecedorId,
            @RequestParam(required = false) StatusContaPagar status,
            @RequestParam(required = false) LocalDate startDueDate,
            @RequestParam(required = false) LocalDate endDueDate,
            @RequestParam(required = false) String description
    ) {
        return contaPagarService.listar(fornecedorId, status, startDueDate, endDueDate, description);
    }

    @GetMapping("/{id}")
    public ContaPagarDetailResponse buscar(@PathVariable Long id) {
        return contaPagarService.buscarPorId(id);
    }

    @PostMapping
    public ContaPagarDetailResponse criar(@RequestBody @Valid ContaPagarRequest request) {
        return contaPagarService.criar(request);
    }

    @PutMapping("/{id}")
    public ContaPagarDetailResponse atualizar(@PathVariable Long id, @RequestBody @Valid ContaPagarRequest request) {
        return contaPagarService.atualizar(id, request);
    }

    @PostMapping("/{id}/pagar")
    public ContaPagarDetailResponse pagar(@PathVariable Long id) {
        return contaPagarService.marcarPago(id);
    }

    @PostMapping("/{id}/cancelar")
    public ContaPagarDetailResponse cancelar(@PathVariable Long id) {
        return contaPagarService.cancelar(id);
    }
}

