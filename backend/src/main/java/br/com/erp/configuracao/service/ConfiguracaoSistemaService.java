package br.com.erp.configuracao.service;

import br.com.erp.audit.AuditoriaService;
import br.com.erp.audit.dto.AuditoriaResponse;
import br.com.erp.configuracao.dto.ConfiguracaoSistemaRequest;
import br.com.erp.configuracao.dto.ConfiguracaoSistemaResponse;
import br.com.erp.configuracao.entity.ConfiguracaoSistema;
import br.com.erp.configuracao.repository.ConfiguracaoSistemaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ConfiguracaoSistemaService {

    private final ConfiguracaoSistemaRepository repository;
    private final AuditoriaService auditoriaService;

    public ConfiguracaoSistemaService(
            ConfiguracaoSistemaRepository repository,
            AuditoriaService auditoriaService
    ) {
        this.repository = repository;
        this.auditoriaService = auditoriaService;
    }

    public ConfiguracaoSistemaResponse obterAtual() {
        ConfiguracaoSistema e = repository.findById(ConfiguracaoSistema.ID_UNICO)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Configuração não encontrada. Use inicializar se ainda não existir registro."
                ));
        return toResponse(e);
    }

    @Transactional
    public ConfiguracaoSistemaResponse inicializarSeAusente() {
        if (repository.existsById(ConfiguracaoSistema.ID_UNICO)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Configuração do sistema já existe.");
        }
        ConfiguracaoSistema e = novaEntidadePadrao();
        return toResponse(repository.save(e));
    }

    @Transactional
    public ConfiguracaoSistemaResponse atualizar(ConfiguracaoSistemaRequest request) {
        ConfiguracaoSistema e = repository.findById(ConfiguracaoSistema.ID_UNICO)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Configuração não encontrada."
                ));
        aplicar(request, e);
        return toResponse(repository.save(e));
    }

    private static ConfiguracaoSistema novaEntidadePadrao() {
        ConfiguracaoSistema e = new ConfiguracaoSistema();
        e.setId(ConfiguracaoSistema.ID_UNICO);
        e.setRazaoSocial("Minha empresa");
        e.setNomeFantasia(null);
        e.setEmailEmpresa(null);
        e.setTelefoneEmpresa(null);
        e.setCodigoMoeda("BRL");
        e.setFusoHorario("America/Sao_Paulo");
        e.setTamanhoPaginaPadrao(20);
        e.setLimiteEstoqueBaixoPadraio(0);
        e.setObservacoes(null);
        return e;
    }

    private static void aplicar(ConfiguracaoSistemaRequest req, ConfiguracaoSistema e) {
        e.setRazaoSocial(req.companyName().trim());
        e.setNomeFantasia(blankToNull(req.tradeName()));
        e.setEmailEmpresa(blankToNull(req.companyEmail()));
        e.setTelefoneEmpresa(blankToNull(req.companyPhone()));
        e.setCodigoMoeda(req.currencyCode().trim());
        e.setFusoHorario(req.timezone().trim());
        e.setTamanhoPaginaPadrao(req.defaultPageSize());
        e.setLimiteEstoqueBaixoPadraio(req.lowStockDefaultThreshold());
        e.setObservacoes(blankToNull(req.additionalInfo()));
    }

    private static String blankToNull(String s) {
        if (s == null || s.isBlank()) {
            return null;
        }
        return s.trim();
    }

    private ConfiguracaoSistemaResponse toResponse(ConfiguracaoSistema e) {
        AuditoriaResponse auditoria = auditoriaService.toResponse(e);
        return new ConfiguracaoSistemaResponse(
                e.getRazaoSocial(),
                e.getNomeFantasia(),
                e.getEmailEmpresa(),
                e.getTelefoneEmpresa(),
                e.getCodigoMoeda(),
                e.getFusoHorario(),
                e.getTamanhoPaginaPadrao(),
                e.getLimiteEstoqueBaixoPadraio(),
                e.getObservacoes(),
                auditoria
        );
    }
}
