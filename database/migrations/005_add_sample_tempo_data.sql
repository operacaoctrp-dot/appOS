-- Migration: Adicionar dados de exemplo de tempo de execução
-- Data: 2025-12-25
-- Descrição: Popula algumas OS existentes com dados de tempo para testar estatísticas
-- ATENÇÃO: Execute apenas em ambiente de desenvolvimento/teste!

-- Atualizar OS existentes com dados de tempo de exemplo
-- Ajuste os IDs conforme as OS que existem no seu banco

-- OS rápidas (até 30 min)
UPDATE ordens_servico 
SET 
  data_inicio = data_solicitacao,
  tempo_inicio = '08:00',
  data_fim = data_solicitacao,
  tempo_fim = '08:25'
WHERE id IN (SELECT id FROM ordens_servico ORDER BY id LIMIT 2 OFFSET 0)
AND data_inicio IS NULL;

-- OS médias (30 min - 2h)
UPDATE ordens_servico 
SET 
  data_inicio = data_solicitacao,
  tempo_inicio = '09:00',
  data_fim = data_solicitacao,
  tempo_fim = '10:30'
WHERE id IN (SELECT id FROM ordens_servico ORDER BY id LIMIT 2 OFFSET 2)
AND data_inicio IS NULL;

-- OS longas (2h - 8h)
UPDATE ordens_servico 
SET 
  data_inicio = data_solicitacao,
  tempo_inicio = '08:00',
  data_fim = data_solicitacao,
  tempo_fim = '14:00'
WHERE id IN (SELECT id FROM ordens_servico ORDER BY id LIMIT 2 OFFSET 4)
AND data_inicio IS NULL;

-- OS muito longas (mais de 8h - próximo dia)
UPDATE ordens_servico 
SET 
  data_inicio = data_solicitacao,
  tempo_inicio = '08:00',
  data_fim = data_solicitacao + INTERVAL '1 day',
  tempo_fim = '10:00'
WHERE id IN (SELECT id FROM ordens_servico ORDER BY id LIMIT 2 OFFSET 6)
AND data_inicio IS NULL;

-- Verificar resultado
SELECT 
  id, 
  numero, 
  categoria_servico,
  data_inicio, 
  tempo_inicio, 
  data_fim, 
  tempo_fim
FROM ordens_servico 
WHERE data_inicio IS NOT NULL
ORDER BY numero;
