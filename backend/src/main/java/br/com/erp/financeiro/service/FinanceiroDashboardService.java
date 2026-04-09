package br.com.erp.financeiro.service;

import br.com.erp.financeiro.StatusContaPagar;
import br.com.erp.financeiro.StatusContaReceber;
import br.com.erp.financeiro.dto.FinanceiroDashboardResponse;
import br.com.erp.financeiro.entity.ContaPagar;
import br.com.erp.financeiro.entity.ContaReceber;
import br.com.erp.financeiro.repository.ContaPagarRepository;
import br.com.erp.financeiro.repository.ContaReceberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class FinanceiroDashboardService {

    private final ContaPagarRepository contaPagarRepository;
    private final ContaReceberRepository contaReceberRepository;

    public FinanceiroDashboardService(
            ContaPagarRepository contaPagarRepository,
            ContaReceberRepository contaReceberRepository
    ) {
        this.contaPagarRepository = contaPagarRepository;
        this.contaReceberRepository = contaReceberRepository;
    }

    @Transactional(readOnly = true)
    public FinanceiroDashboardResponse resumo(LocalDate startDate, LocalDate endDate) {
        LocalDate hoje = LocalDate.now();

        long payPending = 0;
        long payOverdue = 0;
        long payPaid = 0;
        BigDecimal amtPayPending = BigDecimal.ZERO;
        BigDecimal amtPayOverdue = BigDecimal.ZERO;
        BigDecimal amtPayPaid = BigDecimal.ZERO;

        for (ContaPagar c : contaPagarRepository.findAllWithFornecedor()) {
            if (!matchesPeriod(c.getDataVencimento(), startDate, endDate)) {
                continue;
            }
            BigDecimal v = c.getValor() != null ? c.getValor() : BigDecimal.ZERO;
            StatusContaPagar st = c.getStatus();

            if (st == StatusContaPagar.CANCELLED) {
                continue;
            }
            if (st == StatusContaPagar.PAID) {
                payPaid++;
                amtPayPaid = amtPayPaid.add(v);
                continue;
            }
            if (st == StatusContaPagar.PENDING) {
                if (c.getDataVencimento().isBefore(hoje)) {
                    payOverdue++;
                    amtPayOverdue = amtPayOverdue.add(v);
                } else {
                    payPending++;
                    amtPayPending = amtPayPending.add(v);
                }
                continue;
            }
            // OVERDUE persistido (legado): tratar como vencido
            if (st == StatusContaPagar.OVERDUE) {
                payOverdue++;
                amtPayOverdue = amtPayOverdue.add(v);
            }
        }

        long recPending = 0;
        long recOverdue = 0;
        long recReceived = 0;
        BigDecimal amtRecPending = BigDecimal.ZERO;
        BigDecimal amtRecOverdue = BigDecimal.ZERO;
        BigDecimal amtRecReceived = BigDecimal.ZERO;

        for (ContaReceber c : contaReceberRepository.findAllWithCliente()) {
            if (!matchesPeriod(c.getDataVencimento(), startDate, endDate)) {
                continue;
            }
            BigDecimal v = c.getValor() != null ? c.getValor() : BigDecimal.ZERO;
            StatusContaReceber st = c.getStatus();

            if (st == StatusContaReceber.CANCELLED) {
                continue;
            }
            if (st == StatusContaReceber.RECEIVED) {
                recReceived++;
                amtRecReceived = amtRecReceived.add(v);
                continue;
            }
            if (st == StatusContaReceber.PENDING) {
                if (c.getDataVencimento().isBefore(hoje)) {
                    recOverdue++;
                    amtRecOverdue = amtRecOverdue.add(v);
                } else {
                    recPending++;
                    amtRecPending = amtRecPending.add(v);
                }
                continue;
            }
            if (st == StatusContaReceber.OVERDUE) {
                recOverdue++;
                amtRecOverdue = amtRecOverdue.add(v);
            }
        }

        BigDecimal projectedBalance = amtRecPending.subtract(amtPayPending);

        return new FinanceiroDashboardResponse(
                payPending,
                payOverdue,
                payPaid,
                recPending,
                recOverdue,
                recReceived,
                amtPayPending,
                amtPayOverdue,
                amtRecPending,
                amtRecOverdue,
                amtRecReceived,
                amtPayPaid,
                projectedBalance
        );
    }

    private boolean matchesPeriod(LocalDate due, LocalDate startDate, LocalDate endDate) {
        if (startDate != null && due.isBefore(startDate)) {
            return false;
        }
        if (endDate != null && due.isAfter(endDate)) {
            return false;
        }
        return true;
    }
}
