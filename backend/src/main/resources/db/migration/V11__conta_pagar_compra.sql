ALTER TABLE conta_pagar
    ADD COLUMN compra_id BIGINT REFERENCES compra (id);

CREATE UNIQUE INDEX uq_conta_pagar_compra_id ON conta_pagar (compra_id);
