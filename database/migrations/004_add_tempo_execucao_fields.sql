-- Migration: Adicionar campos de tempo de execução
-- Data: 2025-12-22
-- Descrição: Adiciona campos para registrar data/hora de início e fim da execução do serviço

-- Adicionar colunas à tabela ordens_servico
ALTER TABLE ordens_servico
ADD COLUMN IF NOT EXISTS data_inicio DATE,
ADD COLUMN IF NOT EXISTS tempo_inicio TIME,
ADD COLUMN IF NOT EXISTS data_fim DATE,
ADD COLUMN IF NOT EXISTS tempo_fim TIME;

-- Comentários nas colunas
COMMENT ON COLUMN ordens_servico.data_inicio IS 'Data de início da execução do serviço';
COMMENT ON COLUMN ordens_servico.tempo_inicio IS 'Hora de início da execução do serviço';
COMMENT ON COLUMN ordens_servico.data_fim IS 'Data de término da execução do serviço';
COMMENT ON COLUMN ordens_servico.tempo_fim IS 'Hora de término da execução do serviço';
