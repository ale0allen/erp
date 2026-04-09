CREATE TABLE conta_receber (
    id BIGSERIAL PRIMARY KEY,
    descricao VARCHAR(300) NOT NULL,
    cliente_id BIGINT REFERENCES cliente (id),
    data_vencimento DATE NOT NULL,
    valor NUMERIC(15,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    observacoes VARCHAR(1000),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conta_receber_cliente ON conta_receber (cliente_id);
CREATE INDEX idx_conta_receber_data_vencimento ON conta_receber (data_vencimento);
CREATE INDEX idx_conta_receber_status ON conta_receber (status);
