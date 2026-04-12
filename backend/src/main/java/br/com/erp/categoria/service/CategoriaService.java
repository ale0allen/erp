package br.com.erp.categoria.service;

import br.com.erp.audit.AuditoriaService;
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
import java.util.Map;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final ProdutoRepository produtoRepository;
    private final AuditoriaService auditoriaService;

    public CategoriaService(
            CategoriaRepository categoriaRepository,
            ProdutoRepository produtoRepository,
            AuditoriaService auditoriaService
    ) {
        this.categoriaRepository = categoriaRepository;
        this.produtoRepository = produtoRepository;
        this.auditoriaService = auditoriaService;
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponse> listarTodos() {
        List<Categoria> lista = categoriaRepository.findAll();
        Map<Long, String> nomes = auditoriaService.carregarNomesParaEntidades(lista);
        return lista.stream()
                .map(c -> toResponse(c, nomes))
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
        return toResponse(categoria, auditoriaService.carregarNomesParaEntidades(List.of(categoria)));
    }

    private CategoriaResponse toResponse(Categoria categoria, Map<Long, String> nomesPorId) {
        return new CategoriaResponse(
                categoria.getId(),
                categoria.getNome(),
                categoria.getAtivo(),
                auditoriaService.toResponse(categoria, nomesPorId)
        );
    }
}
