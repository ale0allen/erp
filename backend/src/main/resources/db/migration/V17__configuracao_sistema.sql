-- Configurações globais do ERP (registro único id = 1)

CREATE TABLE configuracao_sistema (
    id BIGINT PRIMARY KEY,
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    email_empresa VARCHAR(255),
    telefone_empresa VARCHAR(50),
    codigo_moeda VARCHAR(10) NOT NULL,
    fuso_horario VARCHAR(100) NOT NULL,
    tamanho_pagina_padrao INTEGER NOT NULL,
    limite_estoque_baixo_padraio INTEGER NOT NULL,
    observacoes TEXT,
    criado_em TIMESTAMPTZ NOT NULL,
    atualizado_em TIMESTAMPTZ NOT NULL,
    criado_por_id BIGINT REFERENCES usuario (id),
    atualizado_por_id BIGINT REFERENCES usuario (id)
);

INSERT INTO configuracao_sistema (
    id,
    razao_social,
    nome_fantasia,
    email_empresa,
    telefone_empresa,
    codigo_moeda,
    fuso_horario,
    tamanho_pagina_padrao,
    limite_estoque_baixo_padraio,
    observacoes,
    criado_em,
    atualizado_em
)
VALUES (
    1,
    'Minha empresa',
    NULL,
    NULL,
    NULL,
    'BRL',
    'America/Sao_Paulo',
    20,
    0,
    NULL,
    NOW(),
    NOW()
);
