package br.com.erp.fornecedor.service;

import br.com.erp.fornecedor.dto.FornecedorRequest;
import br.com.erp.fornecedor.dto.FornecedorResponse;
import br.com.erp.fornecedor.entity.Fornecedor;
import br.com.erp.fornecedor.repository.FornecedorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class FornecedorService {

    private final FornecedorRepository fornecedorRepository;

    public FornecedorService(FornecedorRepository fornecedorRepository) {
        this.fornecedorRepository = fornecedorRepository;
    }

    @Transactional(readOnly = true)
    public List<FornecedorResponse> listarTodos() {
        return fornecedorRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public FornecedorResponse buscarPorId(Long id) {
        Fornecedor fornecedor = fornecedorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fornecedor não encontrado"));
        return toResponse(fornecedor);
    }

    public FornecedorResponse salvar(FornecedorRequest request) {
        Fornecedor fornecedor = new Fornecedor();
        aplicarRequest(fornecedor, request);
        return toResponse(fornecedorRepository.save(fornecedor));
    }

    public FornecedorResponse atualizar(Long id, FornecedorRequest request) {
        Fornecedor fornecedor = fornecedorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fornecedor não encontrado"));
        aplicarRequest(fornecedor, request);
        return toResponse(fornecedorRepository.save(fornecedor));
    }

    public void excluir(Long id) {
        if (!fornecedorRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Fornecedor não encontrado");
        }
        fornecedorRepository.deleteById(id);
    }

    private void aplicarRequest(Fornecedor fornecedor, FornecedorRequest request) {
        fornecedor.setNome(trimToNull(request.nome()));
        fornecedor.setDocumento(trimToNull(request.documento()));
        fornecedor.setEmail(trimToNull(request.email()));
        fornecedor.setTelefone(trimToNull(request.telefone()));
        fornecedor.setNomeContato(trimToNull(request.nomeContato()));
        fornecedor.setAtivo(request.ativo());
        fornecedor.setObservacoes(trimToNull(request.observacoes()));
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isBlank() ? null : trimmed;
    }

    private FornecedorResponse toResponse(Fornecedor fornecedor) {
        return new FornecedorResponse(
                fornecedor.getId(),
                fornecedor.getNome(),
                fornecedor.getDocumento(),
                fornecedor.getEmail(),
                fornecedor.getTelefone(),
                fornecedor.getNomeContato(),
                fornecedor.getAtivo(),
                fornecedor.getObservacoes()
        );
    }
}

