CREATE TABLE conta_pagar (
    id BIGSERIAL PRIMARY KEY,
    descricao VARCHAR(300) NOT NULL,
    fornecedor_id BIGINT REFERENCES fornecedor (id),
    data_vencimento DATE NOT NULL,
    valor NUMERIC(15,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    observacoes VARCHAR(1000),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conta_pagar_fornecedor ON conta_pagar (fornecedor_id);
CREATE INDEX idx_conta_pagar_data_vencimento ON conta_pagar (data_vencimento);
CREATE INDEX idx_conta_pagar_status ON conta_pagar (status);

