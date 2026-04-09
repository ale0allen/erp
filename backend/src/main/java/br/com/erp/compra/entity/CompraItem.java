package br.com.erp.compra.entity;

import br.com.erp.produto.entity.Produto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "compra_item")
@Getter
@Setter
public class CompraItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "compra_id", nullable = false)
    private Compra compra;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(name = "custo_unitario", precision = 15, scale = 2, nullable = false)
    private BigDecimal custoUnitario;

    @Column(precision = 15, scale = 2, nullable = false)
    private BigDecimal subtotal;
}

