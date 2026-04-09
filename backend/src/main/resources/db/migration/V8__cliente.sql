CREATE TABLE cliente (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    documento VARCHAR(60),
    email VARCHAR(200),
    telefone VARCHAR(60),
    nome_contato VARCHAR(200),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    observacoes VARCHAR(1000)
);

CREATE INDEX idx_cliente_nome ON cliente (nome);

