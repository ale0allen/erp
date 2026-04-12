package br.com.erp.auditoria.controller;

import br.com.erp.auditoria.dto.HistoricoAuditoriaResponse;
import br.com.erp.auditoria.service.AuditoriaHistoricoService;
import br.com.erp.common.dto.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/auditoria-historico")
public class AuditoriaHistoricoController {

    private final AuditoriaHistoricoService auditoriaHistoricoService;

    public AuditoriaHistoricoController(AuditoriaHistoricoService auditoriaHistoricoService) {
        this.auditoriaHistoricoService = auditoriaHistoricoService;
    }

    @GetMapping
    public PageResponse<HistoricoAuditoriaResponse> listar(
            @PageableDefault(size = 50, sort = "realizadoEm", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) Long usuarioId,
            @RequestParam(required = false) String modulo,
            @RequestParam(required = false) String acao,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant fim
    ) {
        return PageResponse.from(
                auditoriaHistoricoService.listar(pageable, usuarioId, modulo, acao, inicio, fim)
        );
    }

    @GetMapping("/{id}")
    public HistoricoAuditoriaResponse buscar(@PathVariable Long id) {
        return auditoriaHistoricoService.buscarPorId(id);
    }
}
