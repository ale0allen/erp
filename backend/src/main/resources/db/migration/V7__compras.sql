CREATE TABLE compra (
    id BIGSERIAL PRIMARY KEY,
    fornecedor_id BIGINT NOT NULL REFERENCES fornecedor (id),
    data_compra TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL,
    observacoes VARCHAR(1000),
    valor_total NUMERIC(15,2) NOT NULL DEFAULT 0
);

CREATE INDEX idx_compra_fornecedor ON compra (fornecedor_id);
CREATE INDEX idx_compra_data ON compra (data_compra DESC);
CREATE INDEX idx_compra_status ON compra (status);

CREATE TABLE compra_item (
    id BIGSERIAL PRIMARY KEY,
    compra_id BIGINT NOT NULL REFERENCES compra (id) ON DELETE CASCADE,
    produto_id BIGINT NOT NULL REFERENCES produto (id),
    quantidade INTEGER NOT NULL,
    custo_unitario NUMERIC(15,2) NOT NULL,
    subtotal NUMERIC(15,2) NOT NULL
);

CREATE INDEX idx_compra_item_compra ON compra_item (compra_id);
CREATE INDEX idx_compra_item_produto ON compra_item (produto_id);

