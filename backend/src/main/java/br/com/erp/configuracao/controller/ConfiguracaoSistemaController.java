package br.com.erp.configuracao.controller;

import br.com.erp.configuracao.dto.ConfiguracaoSistemaRequest;
import br.com.erp.configuracao.dto.ConfiguracaoSistemaResponse;
import br.com.erp.configuracao.service.ConfiguracaoSistemaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/configuracao-sistema")
public class ConfiguracaoSistemaController {

    private final ConfiguracaoSistemaService configuracaoSistemaService;

    public ConfiguracaoSistemaController(ConfiguracaoSistemaService configuracaoSistemaService) {
        this.configuracaoSistemaService = configuracaoSistemaService;
    }

    @GetMapping
    public ConfiguracaoSistemaResponse obter() {
        return configuracaoSistemaService.obterAtual();
    }

    @PostMapping("/inicializar")
    @ResponseStatus(HttpStatus.CREATED)
    public ConfiguracaoSistemaResponse inicializar() {
        return configuracaoSistemaService.inicializarSeAusente();
    }

    @PutMapping
    public ConfiguracaoSistemaResponse atualizar(@RequestBody @Valid ConfiguracaoSistemaRequest request) {
        return configuracaoSistemaService.atualizar(request);
    }
}
