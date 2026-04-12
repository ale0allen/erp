package br.com.erp.configuracao.entity;

import br.com.erp.audit.EntidadeAuditavel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "configuracao_sistema")
@Getter
@Setter
public class ConfiguracaoSistema extends EntidadeAuditavel {

    public static final long ID_UNICO = 1L;

    @Id
    @Column(name = "id")
    private Long id = ID_UNICO;

    @Column(name = "razao_social", nullable = false, length = 255)
    private String razaoSocial;

    @Column(name = "nome_fantasia", length = 255)
    private String nomeFantasia;

    @Column(name = "email_empresa", length = 255)
    private String emailEmpresa;

    @Column(name = "telefone_empresa", length = 50)
    private String telefoneEmpresa;

    @Column(name = "codigo_moeda", nullable = false, length = 10)
    private String codigoMoeda;

    @Column(name = "fuso_horario", nullable = false, length = 100)
    private String fusoHorario;

    @Column(name = "tamanho_pagina_padrao", nullable = false)
    private Integer tamanhoPaginaPadrao;

    @Column(name = "limite_estoque_baixo_padraio", nullable = false)
    private Integer limiteEstoqueBaixoPadraio;

    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;
}
