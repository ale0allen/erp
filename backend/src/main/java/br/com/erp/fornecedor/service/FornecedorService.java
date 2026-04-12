package br.com.erp.fornecedor.service;

import br.com.erp.audit.AuditoriaService;
import br.com.erp.fornecedor.dto.FornecedorRequest;
import br.com.erp.fornecedor.dto.FornecedorResponse;
import br.com.erp.fornecedor.entity.Fornecedor;
import br.com.erp.fornecedor.repository.FornecedorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
public class FornecedorService {

    private final FornecedorRepository fornecedorRepository;
    private final AuditoriaService auditoriaService;

    public FornecedorService(FornecedorRepository fornecedorRepository, AuditoriaService auditoriaService) {
        this.fornecedorRepository = fornecedorRepository;
        this.auditoriaService = auditoriaService;
    }

    @Transactional(readOnly = true)
    public List<FornecedorResponse> listarTodos() {
        List<Fornecedor> lista = fornecedorRepository.findAll();
        Map<Long, String> nomes = auditoriaService.carregarNomesParaEntidades(lista);
        return lista.stream()
                .map(f -> toResponse(f, nomes))
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
        return toResponse(fornecedor, auditoriaService.carregarNomesParaEntidades(List.of(fornecedor)));
    }

    private FornecedorResponse toResponse(Fornecedor fornecedor, Map<Long, String> nomesPorId) {
        return new FornecedorResponse(
                fornecedor.getId(),
                fornecedor.getNome(),
                fornecedor.getDocumento(),
                fornecedor.getEmail(),
                fornecedor.getTelefone(),
                fornecedor.getNomeContato(),
                fornecedor.getAtivo(),
                fornecedor.getObservacoes(),
                auditoriaService.toResponse(fornecedor, nomesPorId)
        );
    }
}

