-- TEMPORÁRIO: Desabilitar RLS para debug
-- Execute este script no Supabase SQL Editor para debugar

-- Desabilitar RLS temporariamente
ALTER TABLE ordens_servico DISABLE ROW LEVEL SECURITY;

-- Para re-habilitar depois:
-- ALTER TABLE ordens_servico ENABLE ROW LEVEL SECURITY;
