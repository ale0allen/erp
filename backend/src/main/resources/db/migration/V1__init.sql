CREATE TABLE produto (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(200) NOT NULL,
    preco_custo NUMERIC(15,2),
    preco_venda NUMERIC(15,2),
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);
