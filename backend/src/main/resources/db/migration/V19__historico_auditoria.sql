-- Registros de auditoria administrativa (ações relevantes do sistema)

CREATE TABLE historico_auditoria (
    id BIGSERIAL PRIMARY KEY,
    acao VARCHAR(80) NOT NULL,
    modulo VARCHAR(80) NOT NULL,
    entidade_id BIGINT,
    descricao TEXT,
    usuario_id BIGINT REFERENCES usuario (id),
    realizado_em TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_historico_auditoria_realizado_em ON historico_auditoria (realizado_em DESC);
CREATE INDEX idx_historico_auditoria_usuario ON historico_auditoria (usuario_id);
CREATE INDEX idx_historico_auditoria_modulo_acao ON historico_auditoria (modulo, acao);
