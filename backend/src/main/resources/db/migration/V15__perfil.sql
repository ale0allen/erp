CREATE TABLE perfil (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO perfil (nome) VALUES ('ADMIN'), ('MANAGER'), ('OPERATOR');

CREATE TABLE usuario_perfil (
    usuario_id BIGINT NOT NULL REFERENCES usuario (id) ON DELETE CASCADE,
    perfil_id BIGINT NOT NULL REFERENCES perfil (id) ON DELETE CASCADE,
    PRIMARY KEY (usuario_id, perfil_id)
);

-- Usuários existentes: o de menor id vira ADMIN; os demais MANAGER (se houver mais de um).
INSERT INTO usuario_perfil (usuario_id, perfil_id)
SELECT u.id, p.id
FROM usuario u
JOIN perfil p ON p.nome = 'ADMIN'
WHERE u.id = (SELECT MIN(id) FROM usuario);

INSERT INTO usuario_perfil (usuario_id, perfil_id)
SELECT u.id, p.id
FROM usuario u
JOIN perfil p ON p.nome = 'MANAGER'
WHERE (SELECT COUNT(*) FROM usuario) > 1
  AND u.id > (SELECT MIN(id) FROM usuario);
