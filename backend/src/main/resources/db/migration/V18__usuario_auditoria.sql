-- Auditoria em usuário (FK opcional para quem criou/atualizou)

ALTER TABLE usuario
    ADD COLUMN criado_em TIMESTAMPTZ,
    ADD COLUMN atualizado_em TIMESTAMPTZ,
    ADD COLUMN criado_por_id BIGINT REFERENCES usuario (id),
    ADD COLUMN atualizado_por_id BIGINT REFERENCES usuario (id);

UPDATE usuario SET criado_em = NOW(), atualizado_em = NOW() WHERE criado_em IS NULL;

ALTER TABLE usuario ALTER COLUMN criado_em SET NOT NULL;
ALTER TABLE usuario ALTER COLUMN atualizado_em SET NOT NULL;
