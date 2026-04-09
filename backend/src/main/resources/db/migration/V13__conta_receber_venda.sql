ALTER TABLE conta_receber
    ADD COLUMN venda_id BIGINT REFERENCES venda (id);

CREATE UNIQUE INDEX uq_conta_receber_venda_id ON conta_receber (venda_id);
