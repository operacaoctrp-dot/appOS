-- Desabilitar RLS temporariamente para desenvolvimento
-- IMPORTANTE: Em produção, use políticas adequadas ao invés de desabilitar

-- Opção 1: Desabilitar RLS completamente (apenas para desenvolvimento)
ALTER TABLE public.ordens_servico DISABLE ROW LEVEL SECURITY;

-- OU Opção 2: Criar política permissiva (mais seguro)
-- Descomente as linhas abaixo se preferir usar políticas ao invés de desabilitar

-- DROP POLICY IF EXISTS "Enable all for ordens_servico" ON public.ordens_servico;
-- CREATE POLICY "Enable all for ordens_servico" ON public.ordens_servico
--   FOR ALL
--   USING (true)
--   WITH CHECK (true);
