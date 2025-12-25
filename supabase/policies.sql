-- ============================================
-- POLÍTICAS RLS PARA ORDENS DE SERVIÇO
-- ============================================

-- Ativar RLS em todas as tabelas
ALTER TABLE ordens_servico ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE familias ENABLE ROW LEVEL SECURITY;
ALTER TABLE ativos ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS: ordens_servico
-- ============================================

-- Permitir leitura para todos os usuários autenticados
CREATE POLICY "Permitir leitura de OS para autenticados"
ON ordens_servico
FOR SELECT
TO authenticated
USING (true);

-- Permitir inserção para todos os usuários autenticados
CREATE POLICY "Permitir criação de OS para autenticados"
ON ordens_servico
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Permitir atualização para todos os usuários autenticados
CREATE POLICY "Permitir atualização de OS para autenticados"
ON ordens_servico
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Permitir exclusão para todos os usuários autenticados
CREATE POLICY "Permitir exclusão de OS para autenticados"
ON ordens_servico
FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- POLÍTICAS: solicitantes
-- ============================================

-- Permitir leitura para todos os usuários autenticados
CREATE POLICY "Permitir leitura de solicitantes para autenticados"
ON solicitantes
FOR SELECT
TO authenticated
USING (true);

-- Permitir inserção para todos os usuários autenticados
CREATE POLICY "Permitir criação de solicitantes para autenticados"
ON solicitantes
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Permitir atualização para todos os usuários autenticados
CREATE POLICY "Permitir atualização de solicitantes para autenticados"
ON solicitantes
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- POLÍTICAS: funcionarios
-- ============================================

-- Permitir leitura para todos os usuários autenticados
CREATE POLICY "Permitir leitura de funcionarios para autenticados"
ON funcionarios
FOR SELECT
TO authenticated
USING (true);

-- Permitir inserção para todos os usuários autenticados
CREATE POLICY "Permitir criação de funcionarios para autenticados"
ON funcionarios
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Permitir atualização para todos os usuários autenticados
CREATE POLICY "Permitir atualização de funcionarios para autenticados"
ON funcionarios
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- POLÍTICAS: familias
-- ============================================

-- Permitir leitura para todos os usuários autenticados
CREATE POLICY "Permitir leitura de familias para autenticados"
ON familias
FOR SELECT
TO authenticated
USING (true);

-- Permitir inserção para todos os usuários autenticados
CREATE POLICY "Permitir criação de familias para autenticados"
ON familias
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Permitir atualização para todos os usuários autenticados
CREATE POLICY "Permitir atualização de familias para autenticados"
ON familias
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- POLÍTICAS: ativos
-- ============================================

-- Permitir leitura para todos os usuários autenticados
CREATE POLICY "Permitir leitura de ativos para autenticados"
ON ativos
FOR SELECT
TO authenticated
USING (true);

-- Permitir inserção para todos os usuários autenticados
CREATE POLICY "Permitir criação de ativos para autenticados"
ON ativos
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Permitir atualização para todos os usuários autenticados
CREATE POLICY "Permitir atualização de ativos para autenticados"
ON ativos
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- POLÍTICAS PARA DESENVOLVIMENTO (OPCIONAL)
-- Para desabilitar RLS temporariamente em ambiente dev
-- ============================================

-- DESCOMENTAR APENAS EM DESENVOLVIMENTO:
-- ALTER TABLE ordens_servico DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE solicitantes DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE funcionarios DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE familias DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE ativos DISABLE ROW LEVEL SECURITY;
