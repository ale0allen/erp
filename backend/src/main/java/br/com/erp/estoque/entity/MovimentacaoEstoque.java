package br.com.erp.estoque.entity;

import br.com.erp.estoque.TipoMovimentacaoEstoque;
import br.com.erp.produto.entity.Produto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "movimentacao_estoque")
@Getter
@Setter
public class MovimentacaoEstoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoMovimentacaoEstoque tipo;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(length = 500)
    private String observacao;

    @Column(name = "data_movimentacao", nullable = false)
    private Instant dataMovimentacao;
}
