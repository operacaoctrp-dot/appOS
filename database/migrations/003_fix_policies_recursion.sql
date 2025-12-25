-- CORREÇÃO: Remover policies antigas com recursão infinita
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON user_profiles;
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON user_profiles;
DROP POLICY IF EXISTS "Admins podem atualizar perfis" ON user_profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu nome" ON user_profiles;

-- Criar função para verificar se usuário é admin (sem recursão)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Política: Todos podem ver seu próprio perfil (sem recursão)
CREATE POLICY "users_select_own"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Política: Admins podem ver todos os perfis (usando função SECURITY DEFINER)
CREATE POLICY "admins_select_all"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Política: Admins podem atualizar qualquer perfil
CREATE POLICY "admins_update_all"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Política: Usuários podem atualizar apenas seu nome (não o role)
CREATE POLICY "users_update_own_name"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid() 
    AND role = (SELECT role FROM user_profiles WHERE id = auth.uid() LIMIT 1)
  );

-- Política: Permitir INSERT para novos usuários (trigger já cria automaticamente)
CREATE POLICY "users_insert_own"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());
