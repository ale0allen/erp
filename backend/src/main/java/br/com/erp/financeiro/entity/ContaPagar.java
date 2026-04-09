package br.com.erp.financeiro.entity;

import br.com.erp.compra.entity.Compra;
import br.com.erp.financeiro.StatusContaPagar;
import br.com.erp.fornecedor.entity.Fornecedor;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "conta_pagar")
@Getter
@Setter
public class ContaPagar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 300)
    private String descricao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fornecedor_id")
    private Fornecedor fornecedor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "compra_id")
    private Compra compra;

    @Column(name = "data_vencimento", nullable = false)
    private LocalDate dataVencimento;

    @Column(precision = 15, scale = 2, nullable = false)
    private BigDecimal valor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusContaPagar status = StatusContaPagar.PENDING;

    @Column(length = 1000)
    private String observacoes;

    @Column(name = "criado_em", nullable = false)
    private Instant criadoEm = Instant.now();
}

