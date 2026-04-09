CREATE TABLE venda (
    id BIGSERIAL PRIMARY KEY,
    cliente_id BIGINT NOT NULL REFERENCES cliente (id),
    data_venda TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL,
    observacoes VARCHAR(1000),
    valor_total NUMERIC(15,2) NOT NULL DEFAULT 0
);

CREATE INDEX idx_venda_cliente ON venda (cliente_id);
CREATE INDEX idx_venda_data ON venda (data_venda DESC);
CREATE INDEX idx_venda_status ON venda (status);

CREATE TABLE venda_item (
    id BIGSERIAL PRIMARY KEY,
    venda_id BIGINT NOT NULL REFERENCES venda (id) ON DELETE CASCADE,
    produto_id BIGINT NOT NULL REFERENCES produto (id),
    quantidade INTEGER NOT NULL,
    preco_unitario NUMERIC(15,2) NOT NULL,
    subtotal NUMERIC(15,2) NOT NULL
);

CREATE INDEX idx_venda_item_venda ON venda_item (venda_id);
CREATE INDEX idx_venda_item_produto ON venda_item (produto_id);

