CREATE TABLE categoria (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO categoria (nome, ativo) VALUES ('Geral', TRUE);

ALTER TABLE produto ADD COLUMN categoria_id BIGINT;

UPDATE produto SET categoria_id = 1 WHERE categoria_id IS NULL;

ALTER TABLE produto
    ALTER COLUMN categoria_id SET NOT NULL,
    ADD CONSTRAINT fk_produto_categoria FOREIGN KEY (categoria_id) REFERENCES categoria (id);
