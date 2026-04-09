package br.com.erp.categoria.service;

import br.com.erp.categoria.dto.CategoriaRequest;
import br.com.erp.categoria.dto.CategoriaResponse;
import br.com.erp.categoria.entity.Categoria;
import br.com.erp.categoria.repository.CategoriaRepository;
import br.com.erp.produto.repository.ProdutoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final ProdutoRepository produtoRepository;

    public CategoriaService(CategoriaRepository categoriaRepository, ProdutoRepository produtoRepository) {
        this.categoriaRepository = categoriaRepository;
        this.produtoRepository = produtoRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponse> listarTodos() {
        return categoriaRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoriaResponse buscarPorId(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada"));
        return toResponse(categoria);
    }

    public CategoriaResponse salvar(CategoriaRequest request) {
        Categoria categoria = new Categoria();
        categoria.setNome(request.nome());
        categoria.setAtivo(request.ativo());
        return toResponse(categoriaRepository.save(categoria));
    }

    public CategoriaResponse atualizar(Long id, CategoriaRequest request) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada"));
        categoria.setNome(request.nome());
        categoria.setAtivo(request.ativo());
        return toResponse(categoriaRepository.save(categoria));
    }

    public void excluir(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada");
        }
        if (produtoRepository.countByCategoria_Id(id) > 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Não é possível excluir: existem produtos vinculados a esta categoria."
            );
        }
        categoriaRepository.deleteById(id);
    }

    private CategoriaResponse toResponse(Categoria categoria) {
        return new CategoriaResponse(categoria.getId(), categoria.getNome(), categoria.getAtivo());
    }
}
