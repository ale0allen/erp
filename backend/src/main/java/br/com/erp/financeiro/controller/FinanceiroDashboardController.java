package br.com.erp.financeiro.controller;

import br.com.erp.financeiro.dto.FinanceiroDashboardResponse;
import br.com.erp.financeiro.service.FinanceiroDashboardService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/financeiro")
public class FinanceiroDashboardController {

    private final FinanceiroDashboardService financeiroDashboardService;

    public FinanceiroDashboardController(FinanceiroDashboardService financeiroDashboardService) {
        this.financeiroDashboardService = financeiroDashboardService;
    }

    @GetMapping("/dashboard")
    public FinanceiroDashboardResponse dashboard(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate
    ) {
        return financeiroDashboardService.resumo(startDate, endDate);
    }
}
