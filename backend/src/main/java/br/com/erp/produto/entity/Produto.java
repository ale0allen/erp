package br.com.erp.produto.entity;

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
}