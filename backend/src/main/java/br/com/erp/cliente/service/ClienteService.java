package br.com.erp.cliente.service;

import br.com.erp.audit.AuditoriaService;
import br.com.erp.cliente.dto.ClienteRequest;
import br.com.erp.cliente.dto.ClienteResponse;
import br.com.erp.cliente.entity.Cliente;
import br.com.erp.cliente.repository.ClienteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final AuditoriaService auditoriaService;

    public ClienteService(ClienteRepository clienteRepository, AuditoriaService auditoriaService) {
        this.clienteRepository = clienteRepository;
        this.auditoriaService = auditoriaService;
    }

    @Transactional(readOnly = true)
    public List<ClienteResponse> listarTodos() {
        List<Cliente> lista = clienteRepository.findAll();
        Map<Long, String> nomes = auditoriaService.carregarNomesParaEntidades(lista);
        return lista.stream()
                .map(c -> toResponse(c, nomes))
                .toList();
    }

    @Transactional(readOnly = true)
    public ClienteResponse buscarPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado"));
        return toResponse(cliente);
    }

    public ClienteResponse salvar(ClienteRequest request) {
        Cliente cliente = new Cliente();
        aplicarRequest(cliente, request);
        return toResponse(clienteRepository.save(cliente));
    }

    public ClienteResponse atualizar(Long id, ClienteRequest request) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado"));
        aplicarRequest(cliente, request);
        return toResponse(clienteRepository.save(cliente));
    }

    public void excluir(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado");
        }
        clienteRepository.deleteById(id);
    }

    private void aplicarRequest(Cliente cliente, ClienteRequest request) {
        cliente.setNome(trimToNull(request.nome()));
        cliente.setDocumento(trimToNull(request.documento()));
        cliente.setEmail(trimToNull(request.email()));
        cliente.setTelefone(trimToNull(request.telefone()));
        cliente.setNomeContato(trimToNull(request.nomeContato()));
        cliente.setAtivo(request.ativo());
        cliente.setObservacoes(trimToNull(request.observacoes()));
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isBlank() ? null : trimmed;
    }

    private ClienteResponse toResponse(Cliente cliente) {
        return toResponse(cliente, auditoriaService.carregarNomesParaEntidades(List.of(cliente)));
    }

    private ClienteResponse toResponse(Cliente cliente, Map<Long, String> nomesPorId) {
        return new ClienteResponse(
                cliente.getId(),
                cliente.getNome(),
                cliente.getDocumento(),
                cliente.getEmail(),
                cliente.getTelefone(),
                cliente.getNomeContato(),
                cliente.getAtivo(),
                cliente.getObservacoes(),
                auditoriaService.toResponse(cliente, nomesPorId)
        );
    }
}

