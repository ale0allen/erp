-- Auditoria simples: preenchimento retroativo com instante atual; usuários nulos em dados legados

ALTER TABLE produto
    ADD COLUMN criado_em TIMESTAMPTZ,
    ADD COLUMN atualizado_em TIMESTAMPTZ,
    ADD COLUMN criado_por_id BIGINT REFERENCES usuario (id),
    ADD COLUMN atualizado_por_id BIGINT REFERENCES usuario (id);

UPDATE produto SET criado_em = NOW(), atualizado_em = NOW() WHERE criado_em IS NULL;
ALTER TABLE produto ALTER COLUMN criado_em SET NOT NULL;
ALTER TABLE produto ALTER COLUMN atualizado_em SET NOT NULL;

ALTER TABLE categoria
    ADD COLUMN criado_em TIMESTAMPTZ,
    ADD COLUMN atualizado_em TIMESTAMPTZ,
    ADD COLUMN criado_por_id BIGINT REFERENCES usuario (id),
    ADD COLUMN atualizado_por_id BIGINT REFERENCES usuario (id);

UPDATE categoria SET criado_em = NOW(), atualizado_em = NOW() WHERE criado_em IS NULL;
ALTER TABLE categoria ALTER COLUMN criado_em SET NOT NULL;
ALTER TABLE categoria ALTER COLUMN atualizado_em SET NOT NULL;

ALTER TABLE fornecedor
    ADD COLUMN criado_em TIMESTAMPTZ,
    ADD COLUMN atualizado_em TIMESTAMPTZ,
    ADD COLUMN criado_por_id BIGINT REFERENCES usuario (id),
    ADD COLUMN atualizado_por_id BIGINT REFERENCES usuario (id);

UPDATE fornecedor SET criado_em = NOW(), atualizado_em = NOW() WHERE criado_em IS NULL;
ALTER TABLE fornecedor ALTER COLUMN criado_em SET NOT NULL;
ALTER TABLE fornecedor ALTER COLUMN atualizado_em SET NOT NULL;

ALTER TABLE cliente
    ADD COLUMN criado_em TIMESTAMPTZ,
    ADD COLUMN atualizado_em TIMESTAMPTZ,
    ADD COLUMN criado_por_id BIGINT REFERENCES usuario (id),
    ADD COLUMN atualizado_por_id BIGINT REFERENCES usuario (id);

UPDATE cliente SET criado_em = NOW(), atualizado_em = NOW() WHERE criado_em IS NULL;
ALTER TABLE cliente ALTER COLUMN criado_em SET NOT NULL;
ALTER TABLE cliente ALTER COLUMN atualizado_em SET NOT NULL;

ALTER TABLE compra
    ADD COLUMN criado_em TIMESTAMPTZ,
    ADD COLUMN atualizado_em TIMESTAMPTZ,
    ADD COLUMN criado_por_id BIGINT REFERENCES usuario (id),
    ADD COLUMN atualizado_por_id BIGINT REFERENCES usuario (id);

UPDATE compra SET criado_em = NOW(), atualizado_em = NOW() WHERE criado_em IS NULL;
ALTER TABLE compra ALTER COLUMN criado_em SET NOT NULL;
ALTER TABLE compra ALTER COLUMN atualizado_em SET NOT NULL;

ALTER TABLE venda
    ADD COLUMN criado_em TIMESTAMPTZ,
    ADD COLUMN atualizado_em TIMESTAMPTZ,
    ADD COLUMN criado_por_id BIGINT REFERENCES usuario (id),
    ADD COLUMN atualizado_por_id BIGINT REFERENCES usuario (id);

UPDATE venda SET criado_em = NOW(), atualizado_em = NOW() WHERE criado_em IS NULL;
ALTER TABLE venda ALTER COLUMN criado_em SET NOT NULL;
ALTER TABLE venda ALTER COLUMN atualizado_em SET NOT NULL;
