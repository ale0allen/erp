package br.com.erp.financeiro.service;

import br.com.erp.cliente.entity.Cliente;
import br.com.erp.cliente.repository.ClienteRepository;
import br.com.erp.common.dto.PageResponse;
import br.com.erp.financeiro.StatusContaReceber;
import br.com.erp.venda.entity.Venda;
import br.com.erp.financeiro.dto.ContaReceberDetailResponse;
import br.com.erp.financeiro.dto.ContaReceberListItemResponse;
import br.com.erp.financeiro.dto.ContaReceberRelatorioRow;
import br.com.erp.financeiro.dto.ContaReceberRequest;
import br.com.erp.financeiro.dto.RelatorioContasReceberResponse;
import br.com.erp.financeiro.dto.RelatorioTotaisReceber;
import br.com.erp.financeiro.entity.ContaReceber;
import br.com.erp.financeiro.repository.ContaReceberRepository;
import br.com.erp.financeiro.spec.ContaReceberSpecifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
public class ContaReceberService {

    private final ContaReceberRepository contaReceberRepository;
    private final ClienteRepository clienteRepository;

    public ContaReceberService(
            ContaReceberRepository contaReceberRepository,
            ClienteRepository clienteRepository
    ) {
        this.contaReceberRepository = contaReceberRepository;
        this.clienteRepository = clienteRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<ContaReceberListItemResponse> listarPaginado(
            Pageable pageable,
            Long clienteId,
            StatusContaReceber status,
            LocalDate startDueDate,
            LocalDate endDueDate,
            String description
    ) {
        LocalDate hoje = LocalDate.now();
        Page<ContaReceber> page = contaReceberRepository.findAll(
                ContaReceberSpecifications.comFiltros(
                        clienteId,
                        status,
                        startDueDate,
                        endDueDate,
                        description,
                        hoje
                ),
                pageable
        );
        return PageResponse.from(page.map(c -> toListItem(c, hoje)));
    }

    @Transactional(readOnly = true)
    public RelatorioContasReceberResponse relatorioContasReceber(
            Long clienteId,
            StatusContaReceber status,
            LocalDate startDueDate,
            LocalDate endDueDate,
            String description
    ) {
        LocalDate hoje = LocalDate.now();
        Stream<ContaReceber> stream = contaReceberRepository.findAllWithCliente().stream();

        if (clienteId != null) {
            stream = stream.filter(c -> c.getCliente() != null && Objects.equals(c.getCliente().getId(), clienteId));
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

        Stream<ContaReceberRelatorioRow> rows = stream.map(c -> toRelatorioRow(c, hoje));

        if (status != null) {
            rows = rows.filter(r -> r.status() == status);
        }

        List<ContaReceberRelatorioRow> list = rows.toList();
        return new RelatorioContasReceberResponse(list, calcularTotaisReceber(list));
    }

    @Transactional(readOnly = true)
    public ContaReceberDetailResponse buscarPorId(Long id) {
        ContaReceber conta = contaReceberRepository.findByIdWithCliente(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta a receber não encontrada"));
        return toDetail(conta, LocalDate.now());
    }

    public ContaReceberDetailResponse criar(ContaReceberRequest request) {
        ContaReceber conta = new ContaReceber();
        conta.setStatus(StatusContaReceber.PENDING);
        aplicarRequest(conta, request);
        return toDetail(contaReceberRepository.save(conta), LocalDate.now());
    }

    /**
     * Cria uma conta a receber vinculada à venda finalizada (uma por venda).
     * Idempotente: não duplica se já existir registro para a venda.
     */
    @Transactional
    public void criarAutomaticaParaVendaFinalizada(Venda venda) {
        if (venda.getId() == null) {
            throw new IllegalStateException("Venda deve estar persistida");
        }
        if (contaReceberRepository.existsByVenda_Id(venda.getId())) {
            return;
        }

        ContaReceber conta = new ContaReceber();
        conta.setStatus(StatusContaReceber.PENDING);
        conta.setVenda(venda);
        conta.setCliente(venda.getCliente());

        String nomeCliente = venda.getCliente() != null ? venda.getCliente().getNome() : "—";
        conta.setDescricao("Venda #" + venda.getId() + " — " + nomeCliente);

        LocalDate vencimento = LocalDate.ofInstant(venda.getDataVenda(), ZoneOffset.UTC);
        conta.setDataVencimento(vencimento);

        BigDecimal valor = venda.getValorTotal() != null ? venda.getValorTotal() : BigDecimal.ZERO;
        conta.setValor(valor);

        conta.setObservacoes("Gerada automaticamente ao finalizar a venda #" + venda.getId() + ".");

        contaReceberRepository.save(conta);
    }

    @Transactional(readOnly = true)
    public Optional<Long> buscarIdContaReceberPorVendaId(Long vendaId) {
        return contaReceberRepository.findByVenda_Id(vendaId).map(ContaReceber::getId);
    }

    public ContaReceberDetailResponse atualizar(Long id, ContaReceberRequest request) {
        ContaReceber conta = contaReceberRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta a receber não encontrada"));

        validarEditavel(conta);
        aplicarRequest(conta, request);
        return toDetail(contaReceberRepository.save(conta), LocalDate.now());
    }

    public ContaReceberDetailResponse marcarRecebido(Long id) {
        ContaReceber conta = contaReceberRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta a receber não encontrada"));

        if (conta.getStatus() == StatusContaReceber.RECEIVED) {
            return buscarPorId(id);
        }
        if (conta.getStatus() != StatusContaReceber.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Somente contas pendentes podem ser marcadas como recebidas");
        }

        conta.setStatus(StatusContaReceber.RECEIVED);
        return toDetail(contaReceberRepository.save(conta), LocalDate.now());
    }

    public ContaReceberDetailResponse cancelar(Long id) {
        ContaReceber conta = contaReceberRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta a receber não encontrada"));

        if (conta.getStatus() == StatusContaReceber.CANCELLED) {
            return buscarPorId(id);
        }
        if (conta.getStatus() != StatusContaReceber.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Somente contas pendentes podem ser canceladas");
        }

        conta.setStatus(StatusContaReceber.CANCELLED);
        return toDetail(contaReceberRepository.save(conta), LocalDate.now());
    }

    private void validarEditavel(ContaReceber conta) {
        if (conta.getStatus() != StatusContaReceber.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Somente contas pendentes podem ser editadas");
        }
    }

    private void aplicarRequest(ContaReceber conta, ContaReceberRequest request) {
        conta.setDescricao(trimToNull(request.descricao()));
        conta.setDataVencimento(request.dataVencimento());
        conta.setValor(request.valor());
        conta.setObservacoes(trimToNull(request.observacoes()));

        if (request.clienteId() == null) {
            conta.setCliente(null);
        } else {
            Cliente cliente = clienteRepository.findById(request.clienteId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cliente não encontrado"));
            conta.setCliente(cliente);
        }
    }

    private StatusContaReceber statusEfetivo(ContaReceber conta, LocalDate hoje) {
        if (conta.getStatus() == StatusContaReceber.PENDING && conta.getDataVencimento().isBefore(hoje)) {
            return StatusContaReceber.OVERDUE;
        }
        return conta.getStatus();
    }

    private ContaReceberRelatorioRow toRelatorioRow(ContaReceber conta, LocalDate hoje) {
        Cliente cl = conta.getCliente();
        BigDecimal v = conta.getValor() != null ? conta.getValor() : BigDecimal.ZERO;
        return new ContaReceberRelatorioRow(
                conta.getId(),
                conta.getDescricao(),
                cl != null ? cl.getNome() : null,
                conta.getDataVencimento(),
                v,
                statusEfetivo(conta, hoje),
                conta.getObservacoes()
        );
    }

    private RelatorioTotaisReceber calcularTotaisReceber(List<ContaReceberRelatorioRow> rows) {
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalPending = BigDecimal.ZERO;
        BigDecimal totalOverdue = BigDecimal.ZERO;
        BigDecimal totalReceived = BigDecimal.ZERO;
        for (ContaReceberRelatorioRow r : rows) {
            BigDecimal a = r.amount() != null ? r.amount() : BigDecimal.ZERO;
            totalAmount = totalAmount.add(a);
            StatusContaReceber s = r.status();
            if (s == StatusContaReceber.PENDING) {
                totalPending = totalPending.add(a);
            } else if (s == StatusContaReceber.OVERDUE) {
                totalOverdue = totalOverdue.add(a);
            } else if (s == StatusContaReceber.RECEIVED) {
                totalReceived = totalReceived.add(a);
            }
        }
        return new RelatorioTotaisReceber(rows.size(), totalAmount, totalPending, totalOverdue, totalReceived);
    }

    private ContaReceberListItemResponse toListItem(ContaReceber conta, LocalDate hoje) {
        Cliente cl = conta.getCliente();
        return new ContaReceberListItemResponse(
                conta.getId(),
                conta.getDescricao(),
                cl != null ? cl.getId() : null,
                cl != null ? cl.getNome() : null,
                conta.getDataVencimento(),
                conta.getValor(),
                statusEfetivo(conta, hoje)
        );
    }

    private ContaReceberDetailResponse toDetail(ContaReceber conta, LocalDate hoje) {
        Cliente cl = conta.getCliente();
        return new ContaReceberDetailResponse(
                conta.getId(),
                conta.getDescricao(),
                cl != null ? cl.getId() : null,
                cl != null ? cl.getNome() : null,
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
