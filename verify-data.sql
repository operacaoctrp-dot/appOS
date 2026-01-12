-- ============================================
-- Script para verificar se há dados nas tabelas
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- Contar familias
SELECT COUNT(*) as total_familias FROM public.familias;

-- Listar todas as familias
SELECT id, codigo, nome FROM public.familias ORDER BY codigo;

-- Contar ativos
SELECT COUNT(*) as total_ativos FROM public.ativos;

-- Listar todos os ativos (primeiros 10)
SELECT id, codigo, nome, familia_id FROM public.ativos ORDER BY codigo LIMIT 10;

-- Ativos por família
SELECT 
  f.id as familia_id,
  f.codigo as familia_codigo,
  f.nome as familia_nome,
  COUNT(a.id) as total_ativos
FROM public.familias f
LEFT JOIN public.ativos a ON a.familia_id = f.id
GROUP BY f.id, f.codigo, f.nome
ORDER BY f.codigo;

-- Verificar RLS habilitado
SELECT tablename, (select count(*) from pg_policies where pg_policies.tablename = pg_tables.tablename) as policy_count
FROM pg_tables
WHERE schemaname = 'public' AND tablename IN ('familias', 'ativos', 'solicitantes', 'funcionarios', 'ordens_servico')
ORDER BY tablename;

-- Listar políticas de ativos (importante para debugging)
SELECT policy_name, definition FROM pg_policies WHERE tablename = 'ativos';

-- Contar solicitantes e funcionarios
SELECT COUNT(*) as total_solicitantes FROM public.solicitantes;
SELECT COUNT(*) as total_funcionarios FROM public.funcionarios;
