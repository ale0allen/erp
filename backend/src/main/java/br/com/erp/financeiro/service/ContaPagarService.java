package br.com.erp.financeiro.service;

import br.com.erp.compra.entity.Compra;
import br.com.erp.financeiro.StatusContaPagar;
import br.com.erp.financeiro.dto.ContaPagarDetailResponse;
import br.com.erp.financeiro.dto.ContaPagarListItemResponse;
import br.com.erp.financeiro.dto.ContaPagarRelatorioRow;
import br.com.erp.financeiro.dto.ContaPagarRequest;
import br.com.erp.financeiro.dto.RelatorioContasPagarResponse;
import br.com.erp.financeiro.dto.RelatorioTotaisPagar;
import br.com.erp.financeiro.entity.ContaPagar;
import br.com.erp.financeiro.repository.ContaPagarRepository;
import br.com.erp.fornecedor.entity.Fornecedor;
import br.com.erp.fornecedor.repository.FornecedorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Stream;

@Service
public class ContaPagarService {

    private final ContaPagarRepository contaPagarRepository;
    private final FornecedorRepository fornecedorRepository;

    public ContaPagarService(
            ContaPagarRepository contaPagarRepository,
            FornecedorRepository fornecedorRepository
    ) {
        this.contaPagarRepository = contaPagarRepository;
        this.fornecedorRepository = fornecedorRepository;
    }

    @Transactional(readOnly = true)
    public List<ContaPagarListItemResponse> listar(
            Long fornecedorId,
            StatusContaPagar status,
            LocalDate startDueDate,
            LocalDate endDueDate,
            String description
    ) {
        LocalDate hoje = LocalDate.now();
        Stream<ContaPagar> stream = contaPagarRepository.findAllWithFornecedor().stream();

        if (fornecedorId != null) {
            stream = stream.filter(c -> c.getFornecedor() != null && Objects.equals(c.getFornecedor().getId(), fornecedorId));
        }
        if (startDueDate != null) {
            stream = stream.filter(c -> !c.getDataVencimento().isBefore(startDueDate));
        }
        if (endDueDate != null) {
            stream = stream.filter(c -> !c.getDataVencimento().isAfter(endDueDate));
        }
        if (description != null && !description.isBlank()) {
            String needle = description.trim().toLowerCase(Locale.ROOT);
            stream = stream.filter(c -> c.getDescricao() != null && c.getDescricao().toLowerCase(Locale.ROOT).contains(needle));
        }

        Stream<ContaPagarListItemResponse> rows = stream.map(c -> toListItem(c, hoje));

        if (status != null) {
            rows = rows.filter(r -> r.status() == status);
        }

        return rows.toList();
    }

    @Transactional(readOnly = true)
    public RelatorioContasPagarResponse relatorioContasPagar(
            Long fornecedorId,
            StatusContaPagar status,
            LocalDate startDueDate,
            LocalDate endDueDate,
            String description
    ) {
        LocalDate hoje = LocalDate.now();
        Stream<ContaPagar> stream = contaPagarRepository.findAllWithFornecedor().stream();

        if (fornecedorId != null) {
            stream = stream.filter(c -> c.getFornecedor() != null && Objects.equals(c.getFornecedor().getId(), fornecedorId));
        }
        if (startDueDate != null) {
            stream = stream.filter(c -> !c.getDataVencimento().isBefore(startDueDate));
        }
        if (endDueDate != null) {
            stream = stream.filter(c -> !c.getDataVencimento().isAfter(endDueDate));
        }
        if (description != null && !description.isBlank()) {
            String needle = description.trim().toLowerCase(Locale.ROOT);
            stream = stream.filter(c -> c.getDescricao() != null && c.getDescricao().toLowerCase(Locale.ROOT).contains(needle));
        }

        Stream<ContaPagarRelatorioRow> rows = stream.map(c -> toRelatorioRow(c, hoje));

        if (status != null) {
            rows = rows.filter(r -> r.status() == status);
        }

        List<ContaPagarRelatorioRow> list = rows.toList();
        return new RelatorioContasPagarResponse(list, calcularTotaisPagar(list));
    }

    @Transactional(readOnly = true)
    public ContaPagarDetailResponse buscarPorId(Long id) {
        ContaPagar conta = contaPagarRepository.findByIdWithFornecedor(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta a pagar não encontrada"));
        return toDetail(conta, LocalDate.now());
    }

    public ContaPagarDetailResponse criar(ContaPagarRequest request) {
        ContaPagar conta = new ContaPagar();
        conta.setStatus(StatusContaPagar.PENDING);
        aplicarRequest(conta, request);
        return toDetail(contaPagarRepository.save(conta), LocalDate.now());
    }

    /**
     * Cria uma conta a pagar vinculada à compra finalizada (uma por compra).
     * Idempotente: não duplica se já existir registro para a compra.
     */
    @Transactional
    public void criarAutomaticaParaCompraFinalizada(Compra compra) {
        if (compra.getId() == null) {
            throw new IllegalStateException("Compra deve estar persistida");
        }
        if (contaPagarRepository.existsByCompra_Id(compra.getId())) {
            return;
        }

        ContaPagar conta = new ContaPagar();
        conta.setStatus(StatusContaPagar.PENDING);
        conta.setCompra(compra);
        conta.setFornecedor(compra.getFornecedor());

        String nomeFornecedor = compra.getFornecedor() != null ? compra.getFornecedor().getNome() : "—";
        conta.setDescricao("Compra #" + compra.getId() + " — " + nomeFornecedor);

        LocalDate vencimento = LocalDate.ofInstant(compra.getDataCompra(), ZoneOffset.UTC);
        conta.setDataVencimento(vencimento);

        BigDecimal valor = compra.getValorTotal() != null ? compra.getValorTotal() : BigDecimal.ZERO;
        conta.setValor(valor);

        conta.setObservacoes("Gerada automaticamente ao finalizar a compra #" + compra.getId() + ".");

        contaPagarRepository.save(conta);
    }

    @Transactional(readOnly = true)
    public Optional<Long> buscarIdContaPagarPorCompraId(Long compraId) {
        return contaPagarRepository.findByCompra_Id(compraId).map(ContaPagar::getId);
    }

    public ContaPagarDetailResponse atualizar(Long id, ContaPagarRequest request) {
        ContaPagar conta = contaPagarRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta a pagar não encontrada"));

        validarEditavel(conta);
        aplicarRequest(conta, request);
        return toDetail(contaPagarRepository.save(conta), LocalDate.now());
    }

    public ContaPagarDetailResponse marcarPago(Long id) {
        ContaPagar conta = contaPagarRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta a pagar não encontrada"));

        if (conta.getStatus() == StatusContaPagar.PAID) {
            return buscarPorId(id);
        }
        if (conta.getStatus() != StatusContaPagar.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Somente contas pendentes podem ser marcadas como pagas");
        }

        conta.setStatus(StatusContaPagar.PAID);
        return toDetail(contaPagarRepository.save(conta), LocalDate.now());
    }

    public ContaPagarDetailResponse cancelar(Long id) {
        ContaPagar conta = contaPagarRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta a pagar não encontrada"));

        if (conta.getStatus() == StatusContaPagar.CANCELLED) {
            return buscarPorId(id);
        }
        if (conta.getStatus() != StatusContaPagar.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Somente contas pendentes podem ser canceladas");
        }

        conta.setStatus(StatusContaPagar.CANCELLED);
        return toDetail(contaPagarRepository.save(conta), LocalDate.now());
    }

    private void validarEditavel(ContaPagar conta) {
        if (conta.getStatus() != StatusContaPagar.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Somente contas pendentes podem ser editadas");
        }
    }

    private void aplicarRequest(ContaPagar conta, ContaPagarRequest request) {
        conta.setDescricao(trimToNull(request.descricao()));
        conta.setDataVencimento(request.dataVencimento());
        conta.setValor(request.valor());
        conta.setObservacoes(trimToNull(request.observacoes()));

        if (request.fornecedorId() == null) {
            conta.setFornecedor(null);
        } else {
            Fornecedor fornecedor = fornecedorRepository.findById(request.fornecedorId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fornecedor não encontrado"));
            conta.setFornecedor(fornecedor);
        }
    }

    private StatusContaPagar statusEfetivo(ContaPagar conta, LocalDate hoje) {
        if (conta.getStatus() == StatusContaPagar.PENDING && conta.getDataVencimento().isBefore(hoje)) {
            return StatusContaPagar.OVERDUE;
        }
        return conta.getStatus();
    }

    private ContaPagarRelatorioRow toRelatorioRow(ContaPagar conta, LocalDate hoje) {
        Fornecedor f = conta.getFornecedor();
        BigDecimal v = conta.getValor() != null ? conta.getValor() : BigDecimal.ZERO;
        return new ContaPagarRelatorioRow(
                conta.getId(),
                conta.getDescricao(),
                f != null ? f.getNome() : null,
                conta.getDataVencimento(),
                v,
                statusEfetivo(conta, hoje),
                conta.getObservacoes()
        );
    }

    private RelatorioTotaisPagar calcularTotaisPagar(List<ContaPagarRelatorioRow> rows) {
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalPending = BigDecimal.ZERO;
        BigDecimal totalOverdue = BigDecimal.ZERO;
        BigDecimal totalPaid = BigDecimal.ZERO;
        for (ContaPagarRelatorioRow r : rows) {
            BigDecimal a = r.amount() != null ? r.amount() : BigDecimal.ZERO;
            totalAmount = totalAmount.add(a);
            StatusContaPagar s = r.status();
            if (s == StatusContaPagar.PENDING) {
                totalPending = totalPending.add(a);
            } else if (s == StatusContaPagar.OVERDUE) {
                totalOverdue = totalOverdue.add(a);
            } else if (s == StatusContaPagar.PAID) {
                totalPaid = totalPaid.add(a);
            }
        }
        return new RelatorioTotaisPagar(rows.size(), totalAmount, totalPending, totalOverdue, totalPaid);
    }

    private ContaPagarListItemResponse toListItem(ContaPagar conta, LocalDate hoje) {
        Fornecedor f = conta.getFornecedor();
        return new ContaPagarListItemResponse(
                conta.getId(),
                conta.getDescricao(),
                f != null ? f.getId() : null,
                f != null ? f.getNome() : null,
                conta.getDataVencimento(),
                conta.getValor(),
                statusEfetivo(conta, hoje)
        );
    }

    private ContaPagarDetailResponse toDetail(ContaPagar conta, LocalDate hoje) {
        Fornecedor f = conta.getFornecedor();
        return new ContaPagarDetailResponse(
                conta.getId(),
                conta.getDescricao(),
                f != null ? f.getId() : null,
                f != null ? f.getNome() : null,
                conta.getDataVencimento(),
                conta.getValor(),
                statusEfetivo(conta, hoje),
                conta.getObservacoes(),
                conta.getCriadoEm()
        );
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isBlank() ? null : trimmed;
    }
}

