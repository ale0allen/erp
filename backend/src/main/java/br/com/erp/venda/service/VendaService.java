package br.com.erp.venda.service;

import br.com.erp.audit.AuditoriaService;
import br.com.erp.cliente.entity.Cliente;
import br.com.erp.cliente.repository.ClienteRepository;
import br.com.erp.estoque.TipoMovimentacaoEstoque;
import br.com.erp.estoque.dto.MovimentacaoEstoqueRequest;
import br.com.erp.estoque.service.MovimentacaoEstoqueService;
import br.com.erp.financeiro.service.ContaReceberService;
import br.com.erp.produto.entity.Produto;
import br.com.erp.produto.repository.ProdutoRepository;
import br.com.erp.venda.StatusVenda;
import br.com.erp.venda.dto.*;
import br.com.erp.venda.entity.Venda;
import br.com.erp.venda.entity.VendaItem;
import br.com.erp.venda.repository.VendaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Stream;

@Service
public class VendaService {

    private final VendaRepository vendaRepository;
    private final ClienteRepository clienteRepository;
    private final ProdutoRepository produtoRepository;
    private final MovimentacaoEstoqueService movimentacaoEstoqueService;
    private final ContaReceberService contaReceberService;
    private final AuditoriaService auditoriaService;

    public VendaService(
            VendaRepository vendaRepository,
            ClienteRepository clienteRepository,
            ProdutoRepository produtoRepository,
            MovimentacaoEstoqueService movimentacaoEstoqueService,
            ContaReceberService contaReceberService,
            AuditoriaService auditoriaService
    ) {
        this.vendaRepository = vendaRepository;
        this.clienteRepository = clienteRepository;
        this.produtoRepository = produtoRepository;
        this.movimentacaoEstoqueService = movimentacaoEstoqueService;
        this.contaReceberService = contaReceberService;
        this.auditoriaService = auditoriaService;
    }

    @Transactional(readOnly = true)
    public List<VendaListItemResponse> listar(
            Long clienteId,
            StatusVenda status,
            LocalDate startDate,
            LocalDate endDate
    ) {
        Stream<Venda> stream = vendaRepository.findAllWithCliente().stream();

        if (clienteId != null) {
            stream = stream.filter(v -> Objects.equals(v.getCliente().getId(), clienteId));
        }
        if (status != null) {
            stream = stream.filter(v -> v.getStatus() == status);
        }

        if (startDate != null) {
            Instant start = startDate.atStartOfDay(ZoneOffset.UTC).toInstant();
            stream = stream.filter(v -> !v.getDataVenda().isBefore(start));
        }
        if (endDate != null) {
            Instant endExclusive = endDate.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();
            stream = stream.filter(v -> v.getDataVenda().isBefore(endExclusive));
        }

        return stream.map(this::toListItem).toList();
    }

    @Transactional(readOnly = true)
    public VendaDetailResponse buscarDetalhe(Long id) {
        Venda venda = vendaRepository.findByIdWithItens(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Venda não encontrada"));
        return toDetail(venda);
    }

    public VendaDetailResponse criar(VendaRequest request) {
        Venda venda = new Venda();
        venda.setStatus(StatusVenda.DRAFT);
        aplicarDraft(venda, request);
        return toDetail(vendaRepository.save(venda));
    }

    public VendaDetailResponse atualizar(Long id, VendaRequest request) {
        Venda venda = vendaRepository.findByIdWithItens(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Venda não encontrada"));
        validarEditavel(venda);
        aplicarDraft(venda, request);
        return toDetail(vendaRepository.save(venda));
    }

    public VendaDetailResponse cancelar(Long id) {
        Venda venda = vendaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Venda não encontrada"));

        if (venda.getStatus() == StatusVenda.CANCELLED) {
            return buscarDetalhe(id);
        }
        if (venda.getStatus() == StatusVenda.COMPLETED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Venda já finalizada não pode ser cancelada");
        }

        venda.setStatus(StatusVenda.CANCELLED);
        return toDetail(vendaRepository.save(venda));
    }

    @Transactional
    public VendaDetailResponse finalizar(Long id) {
        Venda venda = vendaRepository.findByIdWithItens(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Venda não encontrada"));

        if (venda.getStatus() == StatusVenda.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Venda cancelada não pode ser finalizada");
        }
        if (venda.getStatus() == StatusVenda.COMPLETED) {
            return toDetail(venda);
        }
        if (venda.getItens() == null || venda.getItens().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não é possível finalizar: venda sem itens");
        }
        if (venda.getStatus() != StatusVenda.DRAFT) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Somente vendas em rascunho podem ser finalizadas");
        }

        // Validação prévia: evita finalizar parcialmente por falta de saldo
        for (VendaItem item : venda.getItens()) {
            Produto produto = item.getProduto();
            int saldoAtual = produto.getSaldoEstoque() != null ? produto.getSaldoEstoque() : 0;
            int quantidade = item.getQuantidade() != null ? item.getQuantidade() : 0;
            if (quantidade <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Item com quantidade inválida na venda.");
            }
            if (quantidade > saldoAtual) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Saldo insuficiente para o produto \"" + produto.getNome()
                                + "\". Saldo atual: " + saldoAtual
                                + ", solicitado: " + quantidade
                );
            }
        }

        venda.setStatus(StatusVenda.COMPLETED);
        Venda salva = vendaRepository.save(venda);

        contaReceberService.criarAutomaticaParaVendaFinalizada(salva);

        String baseObs = "Saída automática (Venda #" + salva.getId()
                + " - Cliente: " + salva.getCliente().getNome() + ")";

        for (VendaItem item : salva.getItens()) {
            MovimentacaoEstoqueRequest movReq = new MovimentacaoEstoqueRequest(
                    item.getProduto().getId(),
                    TipoMovimentacaoEstoque.SAIDA,
                    item.getQuantidade(),
                    baseObs
            );
            movimentacaoEstoqueService.registrar(movReq);
        }

        return toDetail(salva);
    }

    private void validarEditavel(Venda venda) {
        if (venda.getStatus() != StatusVenda.DRAFT) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Somente vendas em rascunho podem ser editadas");
        }
    }

    private void aplicarDraft(Venda venda, VendaRequest request) {
        Cliente cliente = clienteRepository.findById(request.clienteId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cliente não encontrado"));

        if (Boolean.FALSE.equals(cliente.getAtivo())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cliente inativo");
        }

        venda.setCliente(cliente);
        venda.setDataVenda(request.dataVenda());
        venda.setObservacoes(trimToNull(request.observacoes()));

        Map<Long, Produto> produtosPorId = carregarProdutosPorId(request.itens());

        venda.getItens().clear();

        BigDecimal total = BigDecimal.ZERO;
        for (VendaItemRequest itemReq : request.itens()) {
            Produto produto = produtosPorId.get(itemReq.produtoId());
            if (produto == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Produto não encontrado: " + itemReq.produtoId());
            }

            BigDecimal subtotal = calcularSubtotal(itemReq.quantidade(), itemReq.precoUnitario());

            VendaItem item = new VendaItem();
            item.setVenda(venda);
            item.setProduto(produto);
            item.setQuantidade(itemReq.quantidade());
            item.setPrecoUnitario(itemReq.precoUnitario());
            item.setSubtotal(subtotal);

            venda.getItens().add(item);
            total = total.add(subtotal);
        }

        venda.setValorTotal(total);
    }

    private Map<Long, Produto> carregarProdutosPorId(List<VendaItemRequest> itens) {
        Set<Long> ids = new HashSet<>();
        for (VendaItemRequest i : itens) {
            ids.add(i.produtoId());
        }
        Map<Long, Produto> map = new HashMap<>();
        for (Produto p : produtoRepository.findAllById(ids)) {
            map.put(p.getId(), p);
        }
        return map;
    }

    private BigDecimal calcularSubtotal(Integer quantidade, BigDecimal precoUnitario) {
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade.longValue()));
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isBlank() ? null : trimmed;
    }

    private VendaListItemResponse toListItem(Venda venda) {
        return new VendaListItemResponse(
                venda.getId(),
                venda.getCliente().getNome(),
                venda.getDataVenda(),
                venda.getStatus(),
                venda.getValorTotal()
        );
    }

    private VendaDetailResponse toDetail(Venda venda) {
        List<VendaItemResponse> itens = venda.getItens() == null
                ? List.of()
                : venda.getItens().stream().map(i -> new VendaItemResponse(
                i.getId(),
                i.getProduto().getId(),
                i.getProduto().getNome(),
                i.getQuantidade(),
                i.getPrecoUnitario(),
                i.getSubtotal()
        )).toList();

        Long contaReceberId = contaReceberService.buscarIdContaReceberPorVendaId(venda.getId()).orElse(null);

        return new VendaDetailResponse(
                venda.getId(),
                venda.getCliente().getId(),
                venda.getCliente().getNome(),
                venda.getDataVenda(),
                venda.getStatus(),
                venda.getObservacoes(),
                venda.getValorTotal(),
                itens,
                contaReceberId,
                auditoriaService.toResponse(venda)
        );
    }
}

