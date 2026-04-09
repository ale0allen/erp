package br.com.erp.estoque.service;

import br.com.erp.estoque.TipoMovimentacaoEstoque;
import br.com.erp.estoque.dto.MovimentacaoEstoqueRequest;
import br.com.erp.estoque.dto.MovimentacaoEstoqueResponse;
import br.com.erp.estoque.entity.MovimentacaoEstoque;
import br.com.erp.estoque.repository.MovimentacaoEstoqueRepository;
import br.com.erp.produto.entity.Produto;
import br.com.erp.produto.repository.ProdutoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
public class MovimentacaoEstoqueService {

    private final MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;
    private final ProdutoRepository produtoRepository;

    public MovimentacaoEstoqueService(
            MovimentacaoEstoqueRepository movimentacaoEstoqueRepository,
            ProdutoRepository produtoRepository) {
        this.movimentacaoEstoqueRepository = movimentacaoEstoqueRepository;
        this.produtoRepository = produtoRepository;
    }

    @Transactional(readOnly = true)
    public List<MovimentacaoEstoqueResponse> listarTodos() {
        return movimentacaoEstoqueRepository.findAllByOrderByDataMovimentacaoDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public MovimentacaoEstoqueResponse registrar(MovimentacaoEstoqueRequest request) {
        Produto produto = produtoRepository.findById(request.produtoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));

        int quantidade = request.quantidade();
        int saldoAtual = produto.getSaldoEstoque();

        if (request.tipo() == TipoMovimentacaoEstoque.ENTRADA) {
            long novoSaldo = (long) saldoAtual + quantidade;
            if (novoSaldo > Integer.MAX_VALUE) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Saldo resultante excede o limite numérico.");
            }
            produto.setSaldoEstoque((int) novoSaldo);
        } else {
            if (quantidade > saldoAtual) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Saldo insuficiente. Não é permitido deixar o estoque negativo. Saldo atual: " + saldoAtual
                );
            }
            produto.setSaldoEstoque(saldoAtual - quantidade);
        }

        if (produto.getSaldoEstoque() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O saldo de estoque não pode ser negativo.");
        }

        produtoRepository.save(produto);

        MovimentacaoEstoque mov = new MovimentacaoEstoque();
        mov.setProduto(produto);
        mov.setTipo(request.tipo());
        mov.setQuantidade(quantidade);
        mov.setObservacao(request.observacao());
        mov.setDataMovimentacao(Instant.now());

        MovimentacaoEstoque salva = movimentacaoEstoqueRepository.save(mov);

        return toResponse(salva);
    }

    private MovimentacaoEstoqueResponse toResponse(MovimentacaoEstoque m) {
        Produto p = m.getProduto();
        return new MovimentacaoEstoqueResponse(
                m.getId(),
                p.getId(),
                p.getCodigo(),
                p.getNome(),
                m.getTipo(),
                m.getQuantidade(),
                m.getObservacao(),
                m.getDataMovimentacao()
        );
    }
}
