package br.com.erp.compra.service;

import br.com.erp.audit.AuditoriaService;
import br.com.erp.auditoria.AuditoriaHistoricoAcoes;
import br.com.erp.auditoria.AuditoriaHistoricoModulos;
import br.com.erp.auditoria.service.AuditoriaHistoricoService;
import br.com.erp.common.dto.PageResponse;
import br.com.erp.compra.StatusCompra;
import br.com.erp.compra.dto.*;
import br.com.erp.compra.entity.Compra;
import br.com.erp.compra.entity.CompraItem;
import br.com.erp.compra.repository.CompraRepository;
import br.com.erp.compra.spec.CompraSpecifications;
import br.com.erp.estoque.TipoMovimentacaoEstoque;
import br.com.erp.estoque.dto.MovimentacaoEstoqueRequest;
import br.com.erp.estoque.service.MovimentacaoEstoqueService;
import br.com.erp.financeiro.service.ContaPagarService;
import br.com.erp.fornecedor.entity.Fornecedor;
import br.com.erp.fornecedor.repository.FornecedorRepository;
import br.com.erp.produto.entity.Produto;
import br.com.erp.produto.repository.ProdutoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
public class CompraService {

    private final CompraRepository compraRepository;
    private final FornecedorRepository fornecedorRepository;
    private final ProdutoRepository produtoRepository;
    private final MovimentacaoEstoqueService movimentacaoEstoqueService;
    private final ContaPagarService contaPagarService;
    private final AuditoriaService auditoriaService;
    private final AuditoriaHistoricoService auditoriaHistoricoService;

    public CompraService(
            CompraRepository compraRepository,
            FornecedorRepository fornecedorRepository,
            ProdutoRepository produtoRepository,
            MovimentacaoEstoqueService movimentacaoEstoqueService,
            ContaPagarService contaPagarService,
            AuditoriaService auditoriaService,
            AuditoriaHistoricoService auditoriaHistoricoService
    ) {
        this.compraRepository = compraRepository;
        this.fornecedorRepository = fornecedorRepository;
        this.produtoRepository = produtoRepository;
        this.movimentacaoEstoqueService = movimentacaoEstoqueService;
        this.contaPagarService = contaPagarService;
        this.auditoriaService = auditoriaService;
        this.auditoriaHistoricoService = auditoriaHistoricoService;
    }

    @Transactional(readOnly = true)
    public PageResponse<CompraListItemResponse> listarPaginado(
            Pageable pageable,
            Long fornecedorId,
            StatusCompra status,
            LocalDate startDate,
            LocalDate endDate
    ) {
        Page<Compra> page = compraRepository.findAll(
                CompraSpecifications.comFiltros(fornecedorId, status, startDate, endDate),
                pageable
        );
        return PageResponse.from(page.map(this::toListItem));
    }

    @Transactional(readOnly = true)
    public CompraDetailResponse buscarDetalhe(Long id) {
        Compra compra = compraRepository.findByIdWithItens(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Compra não encontrada"));
        return toDetail(compra);
    }

    public CompraDetailResponse criar(CompraRequest request) {
        Compra compra = new Compra();
        compra.setStatus(StatusCompra.DRAFT);
        aplicarDraft(compra, request);
        return toDetail(compraRepository.save(compra));
    }

    public CompraDetailResponse atualizar(Long id, CompraRequest request) {
        Compra compra = compraRepository.findByIdWithItens(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Compra não encontrada"));

        validarEditavel(compra);
        aplicarDraft(compra, request);
        return toDetail(compraRepository.save(compra));
    }

    public CompraDetailResponse cancelar(Long id) {
        Compra compra = compraRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Compra não encontrada"));

        if (compra.getStatus() == StatusCompra.CANCELLED) {
            return buscarDetalhe(id);
        }
        if (compra.getStatus() == StatusCompra.COMPLETED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Compra já finalizada não pode ser cancelada");
        }

        compra.setStatus(StatusCompra.CANCELLED);
        return toDetail(compraRepository.save(compra));
    }

    @Transactional
    public CompraDetailResponse finalizar(Long id) {
        Compra compra = compraRepository.findByIdWithItens(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Compra não encontrada"));

        if (compra.getStatus() == StatusCompra.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Compra cancelada não pode ser finalizada");
        }
        if (compra.getStatus() == StatusCompra.COMPLETED) {
            return toDetail(compra);
        }
        if (compra.getItens() == null || compra.getItens().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não é possível finalizar: compra sem itens");
        }

        if (compra.getStatus() != StatusCompra.DRAFT) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Somente compras em rascunho podem ser finalizadas");
        }

        compra.setStatus(StatusCompra.COMPLETED);
        Compra salva = compraRepository.save(compra);

        contaPagarService.criarAutomaticaParaCompraFinalizada(salva);

        String baseObs = "Entrada automática (Compra #" + salva.getId()
                + " - Fornecedor: " + salva.getFornecedor().getNome() + ")";

        for (CompraItem item : salva.getItens()) {
            MovimentacaoEstoqueRequest movReq = new MovimentacaoEstoqueRequest(
                    item.getProduto().getId(),
                    TipoMovimentacaoEstoque.ENTRADA,
                    item.getQuantidade(),
                    baseObs
            );
            movimentacaoEstoqueService.registrar(movReq);
        }

        auditoriaHistoricoService.registrar(
                AuditoriaHistoricoAcoes.PURCHASE_COMPLETED,
                AuditoriaHistoricoModulos.PURCHASE,
                salva.getId(),
                "Compra #" + salva.getId() + " finalizada. Fornecedor: " + salva.getFornecedor().getNome()
        );

        return toDetail(salva);
    }

    private void validarEditavel(Compra compra) {
        if (compra.getStatus() != StatusCompra.DRAFT) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Somente compras em rascunho podem ser editadas");
        }
    }

    private void aplicarDraft(Compra compra, CompraRequest request) {
        Fornecedor fornecedor = fornecedorRepository.findById(request.fornecedorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fornecedor não encontrado"));

        if (Boolean.FALSE.equals(fornecedor.getAtivo())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fornecedor inativo");
        }

        compra.setFornecedor(fornecedor);
        compra.setDataCompra(request.dataCompra());
        compra.setObservacoes(trimToNull(request.observacoes()));

        Map<Long, Produto> produtosPorId = carregarProdutosPorId(request.itens());

        compra.getItens().clear();

        BigDecimal total = BigDecimal.ZERO;
        for (CompraItemRequest itemReq : request.itens()) {
            Produto produto = produtosPorId.get(itemReq.produtoId());
            if (produto == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Produto não encontrado: " + itemReq.produtoId());
            }

            BigDecimal subtotal = calcularSubtotal(itemReq.quantidade(), itemReq.custoUnitario());

            CompraItem item = new CompraItem();
            item.setCompra(compra);
            item.setProduto(produto);
            item.setQuantidade(itemReq.quantidade());
            item.setCustoUnitario(itemReq.custoUnitario());
            item.setSubtotal(subtotal);

            compra.getItens().add(item);
            total = total.add(subtotal);
        }

        compra.setValorTotal(total);
    }

    private Map<Long, Produto> carregarProdutosPorId(List<CompraItemRequest> itens) {
        Set<Long> ids = new HashSet<>();
        for (CompraItemRequest i : itens) {
            ids.add(i.produtoId());
        }
        Map<Long, Produto> map = new HashMap<>();
        for (Produto p : produtoRepository.findAllById(ids)) {
            map.put(p.getId(), p);
        }
        return map;
    }

    private BigDecimal calcularSubtotal(Integer quantidade, BigDecimal custoUnitario) {
        return custoUnitario.multiply(BigDecimal.valueOf(quantidade.longValue()));
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isBlank() ? null : trimmed;
    }

    private CompraListItemResponse toListItem(Compra compra) {
        return new CompraListItemResponse(
                compra.getId(),
                compra.getFornecedor().getNome(),
                compra.getDataCompra(),
                compra.getStatus(),
                compra.getValorTotal()
        );
    }

    private CompraDetailResponse toDetail(Compra compra) {
        List<CompraItemResponse> itens = compra.getItens() == null
                ? List.of()
                : compra.getItens().stream().map(i -> new CompraItemResponse(
                i.getId(),
                i.getProduto().getId(),
                i.getProduto().getNome(),
                i.getQuantidade(),
                i.getCustoUnitario(),
                i.getSubtotal()
        )).toList();

        Long contaPagarId = contaPagarService.buscarIdContaPagarPorCompraId(compra.getId()).orElse(null);

        return new CompraDetailResponse(
                compra.getId(),
                compra.getFornecedor().getId(),
                compra.getFornecedor().getNome(),
                compra.getDataCompra(),
                compra.getStatus(),
                compra.getObservacoes(),
                compra.getValorTotal(),
                itens,
                contaPagarId,
                auditoriaService.toResponse(compra)
        );
    }
}

