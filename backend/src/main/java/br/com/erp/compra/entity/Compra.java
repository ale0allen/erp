package br.com.erp.compra.entity;

import br.com.erp.compra.StatusCompra;
import br.com.erp.fornecedor.entity.Fornecedor;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "compra")
@Getter
@Setter
public class Compra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "fornecedor_id", nullable = false)
    private Fornecedor fornecedor;

    @Column(name = "data_compra", nullable = false)
    private Instant dataCompra;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusCompra status = StatusCompra.DRAFT;

    @Column(length = 1000)
    private String observacoes;

    @Column(name = "valor_total", precision = 15, scale = 2, nullable = false)
    private BigDecimal valorTotal = BigDecimal.ZERO;

    @OneToMany(mappedBy = "compra", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CompraItem> itens = new ArrayList<>();
}

