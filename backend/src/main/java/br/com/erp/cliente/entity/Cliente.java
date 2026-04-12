package br.com.erp.cliente.entity;

import br.com.erp.audit.EntidadeAuditavel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "cliente")
@Getter
@Setter
public class Cliente extends EntidadeAuditavel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String nome;

    @Column(length = 60)
    private String documento;

    @Column(length = 200)
    private String email;

    @Column(length = 60)
    private String telefone;

    @Column(name = "nome_contato", length = 200)
    private String nomeContato;

    @Column(nullable = false)
    private Boolean ativo = true;

    @Column(length = 1000)
    private String observacoes;
}

