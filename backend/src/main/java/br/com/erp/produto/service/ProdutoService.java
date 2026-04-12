package br.com.erp.produto.service;

import br.com.erp.audit.AuditoriaService;
import br.com.erp.categoria.entity.Categoria;
import br.com.erp.categoria.repository.CategoriaRepository;
import br.com.erp.common.dto.PageResponse;
import br.com.erp.produto.dto.ProdutoRequest;
import br.com.erp.produto.dto.ProdutoResumoResponse;
import br.com.erp.produto.dto.ProdutoResponse;
import br.com.erp.produto.dto.RelatorioEstoqueItemResponse;
import br.com.erp.produto.dto.StatusEstoque;
import br.com.erp.produto.entity.Produto;
import br.com.erp.produto.repository.ProdutoRepository;
import br.com.erp.produto.spec.ProdutoSpecifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Stream;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;
    private final AuditoriaService auditoriaService;

    public ProdutoService(
            ProdutoRepository produtoRepository,
            CategoriaRepository categoriaRepository,
            AuditoriaService auditoriaService
    ) {
        this.produtoRepository = produtoRepository;
        this.categoriaRepository = categoriaRepository;
        this.auditoriaService = auditoriaService;
    }

    @Transactional(readOnly = true)
    public PageResponse<ProdutoResponse> listarPaginado(
            Pageable pageable,
            String q,
            Long categoriaId,
            Boolean ativo
    ) {
        Page<Produto> page = produtoRepository.findAll(
                ProdutoSpecifications.comFiltros(q, categoriaId, ativo),
                pageable
        );
        Map<Long, String> nomes = auditoriaService.carregarNomesParaEntidades(page.getContent());
        return PageResponse.from(page.map(p -> toResponse(p, nomes)));
    }

    public ProdutoResumoResponse resumo() {
        long totalProducts = produtoRepository.count();
        long activeProducts = produtoRepository.countByAtivoTrue();
        long inactiveProducts = produtoRepository.countByAtivoFalse();

        long totalStockQuantity = 0;
        long productsOutOfStock = 0;
        long productsWithLowStock = 0;
        long productsWithNormalStock = 0;

        for (Produto p : produtoRepository.findAll()) {
            int saldo = p.getSaldoEstoque() != null ? p.getSaldoEstoque() : 0;
            int minimo = p.getEstoqueMinimo() != null ? p.getEstoqueMinimo() : 0;
            totalStockQuantity += saldo;

            StatusEstoque status = calcularStatusEstoque(saldo, minimo);
            if (status == StatusEstoque.OUT_OF_STOCK) {
                productsOutOfStock++;
            } else if (status == StatusEstoque.LOW_STOCK) {
                productsWithLowStock++;
            } else {
                productsWithNormalStock++;
            }
        }
        return new ProdutoResumoResponse(
                totalProducts,
                activeProducts,
                inactiveProducts,
                totalStockQuantity,
                productsOutOfStock,
                productsWithLowStock,
                productsWithNormalStock
        );
    }

    public ProdutoResponse salvar(ProdutoRequest request) {

        Produto produto = new Produto();
        produto.setCodigo(request.codigo());
        produto.setNome(request.nome());
        produto.setPrecoCusto(request.precoCusto());
        produto.setPrecoVenda(request.precoVenda());
        produto.setAtivo(request.ativo());
        produto.setEstoqueMinimo(request.estoqueMinimo());
        produto.setCategoria(buscarCategoria(request.categoriaId()));
        produto.setSaldoEstoque(0);

        Produto salvo = produtoRepository.save(produto);

        return toResponse(salvo);
    }

    public ProdutoResponse atualizar(Long id, ProdutoRequest request) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));

        produto.setCodigo(request.codigo());
        produto.setNome(request.nome());
        produto.setPrecoCusto(request.precoCusto());
        produto.setPrecoVenda(request.precoVenda());
        produto.setAtivo(request.ativo());
        produto.setEstoqueMinimo(request.estoqueMinimo());
        produto.setCategoria(buscarCategoria(request.categoriaId()));

        Produto salvo = produtoRepository.save(produto);

        return toResponse(salvo);
    }

    public void excluir(Long id) {
        if (!produtoRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado");
        }
        produtoRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<RelatorioEstoqueItemResponse> relatorioEstoque(
            String productName,
            Long categoryId,
            StatusEstoque stockStatus,
            Boolean active
    ) {
        Stream<Produto> stream = produtoRepository.findAllWithCategoria().stream();

        if (productName != null && !productName.isBlank()) {
            String needle = productName.trim().toLowerCase(Locale.ROOT);
            stream = stream.filter(p -> p.getNome().toLowerCase(Locale.ROOT).contains(needle));
        }
        if (categoryId != null) {
            stream = stream.filter(p -> Objects.equals(p.getCategoria().getId(), categoryId));
        }
        if (active != null) {
            stream = stream.filter(p -> Objects.equals(p.getAtivo(), active));
        }

        Stream<RelatorioEstoqueItemResponse> rows = stream.map(this::toRelatorioEstoqueItem);

        if (stockStatus != null) {
            rows = rows.filter(r -> r.stockStatus() == stockStatus);
        }

        return rows.toList();
    }

    private Categoria buscarCategoria(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Categoria não encontrada"));
    }

    private RelatorioEstoqueItemResponse toRelatorioEstoqueItem(Produto produto) {
        Categoria categoria = produto.getCategoria();
        int saldo = produto.getSaldoEstoque() != null ? produto.getSaldoEstoque() : 0;
        int minimo = produto.getEstoqueMinimo() != null ? produto.getEstoqueMinimo() : 0;
        StatusEstoque status = calcularStatusEstoque(saldo, minimo);
        return new RelatorioEstoqueItemResponse(
                produto.getId(),
                produto.getCodigo(),
                produto.getNome(),
                categoria.getNome(),
                produto.getAtivo(),
                saldo,
                minimo,
                status
        );
    }

    private ProdutoResponse toResponse(Produto produto) {
        return toResponse(produto, auditoriaService.carregarNomesParaEntidades(List.of(produto)));
    }

    private ProdutoResponse toResponse(Produto produto, Map<Long, String> nomesPorId) {
        Categoria categoria = produto.getCategoria();
        int saldo = produto.getSaldoEstoque() != null ? produto.getSaldoEstoque() : 0;
        int minimo = produto.getEstoqueMinimo() != null ? produto.getEstoqueMinimo() : 0;
        StatusEstoque status = calcularStatusEstoque(saldo, minimo);
        return new ProdutoResponse(
                produto.getId(),
                produto.getCodigo(),
                produto.getNome(),
                produto.getPrecoCusto(),
                produto.getPrecoVenda(),
                produto.getAtivo(),
                categoria.getId(),
                categoria.getNome(),
                saldo,
                minimo,
                status,
                auditoriaService.toResponse(produto, nomesPorId)
        );
    }

    private StatusEstoque calcularStatusEstoque(int saldoEstoque, int estoqueMinimo) {
        if (saldoEstoque <= 0) {
            return StatusEstoque.OUT_OF_STOCK;
        }
        if (saldoEstoque <= estoqueMinimo) {
            return StatusEstoque.LOW_STOCK;
        }
        return StatusEstoque.NORMAL;
    }
}
