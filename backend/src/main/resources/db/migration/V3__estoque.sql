ALTER TABLE produto ADD COLUMN saldo_estoque INTEGER NOT NULL DEFAULT 0;

CREATE TABLE movimentacao_estoque (
    id BIGSERIAL PRIMARY KEY,
    produto_id BIGINT NOT NULL REFERENCES produto (id),
    tipo VARCHAR(20) NOT NULL,
    quantidade INTEGER NOT NULL,
    observacao VARCHAR(500),
    data_hora TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_movimentacao_estoque_produto ON movimentacao_estoque (produto_id);
CREATE INDEX idx_movimentacao_estoque_data ON movimentacao_estoque (data_hora DESC);
