package br.com.erp.cliente.controller;

import br.com.erp.cliente.dto.ClienteRequest;
import br.com.erp.cliente.dto.ClienteResponse;
import br.com.erp.cliente.service.ClienteService;
import br.com.erp.common.dto.PageResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping
    public PageResponse<ClienteResponse> listar(
            @PageableDefault(size = 20, sort = "nome", direction = Sort.Direction.ASC) Pageable pageable,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Boolean ativo
    ) {
        return clienteService.listarPaginado(pageable, q, ativo);
    }

    @GetMapping("/todas")
    public List<ClienteResponse> listarTodas() {
        return clienteService.listarTodas();
    }

    @GetMapping("/{id}")
    public ClienteResponse buscar(@PathVariable Long id) {
        return clienteService.buscarPorId(id);
    }

    @PostMapping
    public ClienteResponse salvar(@RequestBody @Valid ClienteRequest request) {
        return clienteService.salvar(request);
    }

    @PutMapping("/{id}")
    public ClienteResponse atualizar(@PathVariable Long id, @RequestBody @Valid ClienteRequest request) {
        return clienteService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        clienteService.excluir(id);
    }
}

