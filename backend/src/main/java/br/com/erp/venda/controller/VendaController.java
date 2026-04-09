package br.com.erp.venda.controller;

import br.com.erp.venda.StatusVenda;
import br.com.erp.venda.dto.VendaDetailResponse;
import br.com.erp.venda.dto.VendaListItemResponse;
import br.com.erp.venda.dto.VendaRequest;
import br.com.erp.venda.service.VendaService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/vendas")
public class VendaController {

    private final VendaService vendaService;

    public VendaController(VendaService vendaService) {
        this.vendaService = vendaService;
    }

    @GetMapping
    public List<VendaListItemResponse> listar(
            @RequestParam(required = false) Long clienteId,
            @RequestParam(required = false) StatusVenda status,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate
    ) {
        return vendaService.listar(clienteId, status, startDate, endDate);
    }

    @GetMapping("/{id}")
    public VendaDetailResponse buscar(@PathVariable Long id) {
        return vendaService.buscarDetalhe(id);
    }

    @PostMapping
    public VendaDetailResponse criar(@RequestBody @Valid VendaRequest request) {
        return vendaService.criar(request);
    }

    @PutMapping("/{id}")
    public VendaDetailResponse atualizar(@PathVariable Long id, @RequestBody @Valid VendaRequest request) {
        return vendaService.atualizar(id, request);
    }

    @PostMapping("/{id}/cancelar")
    public VendaDetailResponse cancelar(@PathVariable Long id) {
        return vendaService.cancelar(id);
    }

    @PostMapping("/{id}/finalizar")
    public VendaDetailResponse finalizar(@PathVariable Long id) {
        return vendaService.finalizar(id);
    }
}

