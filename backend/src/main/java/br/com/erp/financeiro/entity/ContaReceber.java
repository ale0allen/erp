package br.com.erp.financeiro.entity;

import br.com.erp.cliente.entity.Cliente;
import br.com.erp.financeiro.StatusContaReceber;
import br.com.erp.venda.entity.Venda;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "conta_receber")
@Getter
@Setter
public class ContaReceber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 300)
    private String descricao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venda_id")
    private Venda venda;

    @Column(name = "data_vencimento", nullable = false)
    private LocalDate dataVencimento;

    @Column(precision = 15, scale = 2, nullable = false)
    private BigDecimal valor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusContaReceber status = StatusContaReceber.PENDING;

    @Column(length = 1000)
    private String observacoes;

    @Column(name = "criado_em", nullable = false)
    private Instant criadoEm = Instant.now();
}
