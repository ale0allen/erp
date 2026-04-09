ALTER TABLE movimentacao_estoque RENAME COLUMN data_hora TO data_movimentacao;

DROP INDEX IF EXISTS idx_movimentacao_estoque_data;
CREATE INDEX idx_movimentacao_estoque_data ON movimentacao_estoque (data_movimentacao DESC);
