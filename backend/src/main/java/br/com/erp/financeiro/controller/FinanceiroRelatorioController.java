package br.com.erp.financeiro.controller;

import br.com.erp.financeiro.StatusContaPagar;
import br.com.erp.financeiro.StatusContaReceber;
import br.com.erp.financeiro.dto.RelatorioContasPagarResponse;
import br.com.erp.financeiro.dto.RelatorioContasReceberResponse;
import br.com.erp.financeiro.service.ContaPagarService;
import br.com.erp.financeiro.service.ContaReceberService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/financeiro/relatorios")
public class FinanceiroRelatorioController {

    private final ContaPagarService contaPagarService;
    private final ContaReceberService contaReceberService;

    public FinanceiroRelatorioController(
            ContaPagarService contaPagarService,
            ContaReceberService contaReceberService
    ) {
        this.contaPagarService = contaPagarService;
        this.contaReceberService = contaReceberService;
    }

    @GetMapping("/contas-pagar")
    public RelatorioContasPagarResponse relatorioContasPagar(
            @RequestParam(required = false) Long supplierId,
            @RequestParam(required = false) StatusContaPagar status,
            @RequestParam(required = false) LocalDate startDueDate,
            @RequestParam(required = false) LocalDate endDueDate,
            @RequestParam(required = false) String description
    ) {
        return contaPagarService.relatorioContasPagar(supplierId, status, startDueDate, endDueDate, description);
    }

    @GetMapping("/contas-receber")
    public RelatorioContasReceberResponse relatorioContasReceber(
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) StatusContaReceber status,
            @RequestParam(required = false) LocalDate startDueDate,
            @RequestParam(required = false) LocalDate endDueDate,
            @RequestParam(required = false) String description
    ) {
        return contaReceberService.relatorioContasReceber(customerId, status, startDueDate, endDueDate, description);
    }
}
