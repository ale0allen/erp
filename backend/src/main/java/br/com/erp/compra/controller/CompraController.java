package br.com.erp.compra.controller;

import br.com.erp.compra.StatusCompra;
import br.com.erp.compra.dto.CompraDetailResponse;
import br.com.erp.compra.dto.CompraListItemResponse;
import br.com.erp.compra.dto.CompraRequest;
import br.com.erp.compra.service.CompraService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/compras")
public class CompraController {

    private final CompraService compraService;

    public CompraController(CompraService compraService) {
        this.compraService = compraService;
    }

    @GetMapping
    public List<CompraListItemResponse> listar(
            @RequestParam(required = false) Long fornecedorId,
            @RequestParam(required = false) StatusCompra status,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate
    ) {
        return compraService.listar(fornecedorId, status, startDate, endDate);
    }

    @GetMapping("/{id}")
    public CompraDetailResponse buscar(@PathVariable Long id) {
        return compraService.buscarDetalhe(id);
    }

    @PostMapping
    public CompraDetailResponse criar(@RequestBody @Valid CompraRequest request) {
        return compraService.criar(request);
    }

    @PutMapping("/{id}")
    public CompraDetailResponse atualizar(@PathVariable Long id, @RequestBody @Valid CompraRequest request) {
        return compraService.atualizar(id, request);
    }

    @PostMapping("/{id}/cancelar")
    public CompraDetailResponse cancelar(@PathVariable Long id) {
        return compraService.cancelar(id);
    }

    @PostMapping("/{id}/finalizar")
    public CompraDetailResponse finalizar(@PathVariable Long id) {
        return compraService.finalizar(id);
    }
}

