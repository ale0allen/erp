package br.com.erp.auditoria.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "historico_auditoria")
@Getter
@Setter
public class HistoricoAuditoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String acao;

    @Column(nullable = false, length = 80)
    private String modulo;

    @Column(name = "entidade_id")
    private Long entidadeId;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "usuario_id")
    private Long usuarioId;

    @Column(name = "realizado_em", nullable = false)
    private Instant realizadoEm;
}
