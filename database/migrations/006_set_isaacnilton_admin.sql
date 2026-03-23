-- Garantir que o usuário isaacnilton@marquise.com.br tenha role de admin
-- Esta migração é idempotente: pode ser executada mais de uma vez sem efeitos colaterais.

-- 1) Se o perfil já existe, apenas promove para admin.
UPDATE public.user_profiles
SET role = 'admin',
    updated_at = NOW()
WHERE LOWER(email) = LOWER('isaacnilton@marquise.com.br');

-- 2) Se o usuário existe em auth.users mas ainda não tem perfil, cria já como admin.
INSERT INTO public.user_profiles (id, email, role, name)
SELECT
  u.id,
  u.email,
  'admin',
  COALESCE(u.raw_user_meta_data->>'name', SPLIT_PART(u.email, '@', 1))
FROM auth.users u
WHERE LOWER(u.email) = LOWER('isaacnilton@marquise.com.br')
  AND NOT EXISTS (
    SELECT 1
    FROM public.user_profiles p
    WHERE p.id = u.id
  );
