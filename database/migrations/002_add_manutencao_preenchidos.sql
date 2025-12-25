-- Adicionar coluna para controlar se os dados de manutenção foram preenchidos
ALTER TABLE ordens_servico 
ADD COLUMN IF NOT EXISTS dados_manutencao_preenchidos BOOLEAN DEFAULT FALSE;

-- Adicionar índice para consultas que filtram por dados preenchidos
CREATE INDEX IF NOT EXISTS idx_ordens_servico_manutencao 
ON ordens_servico(dados_manutencao_preenchidos);

-- Comentário para documentação
COMMENT ON COLUMN ordens_servico.dados_manutencao_preenchidos IS 
'Indica se os dados de manutenção (descrição do serviço, executor, insumos, observações e tempo) foram preenchidos pela equipe de manutenção. Necessário para permitir o fechamento da OS.';
