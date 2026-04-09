package br.com.erp.produto.entity;

import br.com.erp.categoria.entity.Categoria;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "produto")
@Getter
@Setter
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @Column(nullable = false, unique = true, length = 50)
    private String codigo;

    @Column(nullable = false, length = 200)
    private String nome;

    @Column(name = "preco_custo", precision = 15, scale = 2)
    private BigDecimal precoCusto;

    @Column(name = "preco_venda", precision = 15, scale = 2)
    private BigDecimal precoVenda;

    @Column(nullable = false)
    private Boolean ativo;

    @Column(name = "saldo_estoque", nullable = false)
    private Integer saldoEstoque = 0;

    @Column(name = "estoque_minimo", nullable = false)
    private Integer estoqueMinimo = 0;
}
