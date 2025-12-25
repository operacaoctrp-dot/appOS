# Migrações do Banco de Dados

Este diretório contém as migrações SQL para o banco de dados do sistema de Ordem de Serviços.

## Ordem de Execução

Execute as migrações na ordem indicada pelos números:

### 001 - Criar Tabela de Perfis de Usuários (user_profiles)

**Arquivo:** `001_create_user_profiles.sql`

**Objetivo:** Criar o sistema de roles/permissões para controle de acesso.

**Funcionalidades:**

- Tabela `user_profiles` com campos:
  - `id`: UUID do usuário (referência para auth.users)
  - `email`: Email do usuário
  - `role`: Role do usuário (admin, manutencao, visualizador)
  - `name`: Nome do usuário
  - `created_at` e `updated_at`: Timestamps
- Trigger automático para criar perfil quando novo usuário é cadastrado
- RLS (Row Level Security) policies:
  - Usuários podem ver seu próprio perfil
  - Admins podem ver e editar todos os perfis
  - Usuários podem atualizar seu nome (mas não o role)

**Como executar:**

1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Cole o conteúdo do arquivo `001_create_user_profiles.sql`
4. Clique em **Run** para executar

**Após execução:**

- Você precisará criar pelo menos um usuário admin manualmente:

  ```sql
  -- Atualizar role de um usuário para admin (substitua o email)
  UPDATE user_profiles
  SET role = 'admin'
  WHERE email = 'seu-email@exemplo.com';
  ```

- Criar usuários da equipe de manutenção:
  ```sql
  -- Atualizar role de um usuário para manutenção
  UPDATE user_profiles
  SET role = 'manutencao'
  WHERE email = 'manutencao@exemplo.com';
  ```

### 002 - Adicionar Coluna dados_manutencao_preenchidos

**Arquivo:** `002_add_manutencao_preenchidos.sql`

**Objetivo:** Adicionar controle para verificar se os dados de manutenção foram preenchidos antes de permitir o fechamento da OS.

**Funcionalidades:**

- Adiciona coluna `dados_manutencao_preenchidos` (boolean, default false)
- Adiciona índice para otimizar consultas

**Como executar:**

1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Cole o conteúdo do arquivo `002_add_manutencao_preenchidos.sql`
4. Clique em **Run** para executar

## Sistema de Roles

### Admin

- Acesso total ao sistema
- Pode atribuir roles a outros usuários
- Pode preencher dados de manutenção
- Pode fechar OS

### Manutenção

- Pode preencher dados de manutenção (página /manutencao/[id])
- Pode visualizar OS
- Pode editar OS
- **Necessário** para preencher dados antes do fechamento da OS

### Visualizador (padrão)

- Apenas visualização de OS
- Não pode preencher dados de manutenção
- Não pode fechar OS que não tenham dados de manutenção preenchidos

## Fluxo de Trabalho

1. **Criação da OS**: Qualquer usuário autenticado cria a OS
2. **Recebimento**: Equipe de manutenção recebe a OS
3. **Preenchimento de Dados**: **Apenas equipe de manutenção** acessa `/manutencao/[id]` e preenche:
   - Descrição do Serviço
   - Executor
   - Insumos Utilizados
   - Observações
   - Tempo de Execução (início e fim)
4. **Fechamento**: Após dados preenchidos, a OS pode ser fechada com os dados de liberação

## Verificação

Para verificar se as migrações foram executadas corretamente:

```sql
-- Verificar se a tabela user_profiles existe
SELECT * FROM user_profiles LIMIT 5;

-- Verificar se a coluna foi adicionada
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'ordens_servico'
AND column_name = 'dados_manutencao_preenchidos';

-- Listar usuários e suas roles
SELECT id, email, role, name, created_at
FROM user_profiles
ORDER BY created_at DESC;
```

## Notas Importantes

⚠️ **Importante:** Execute as migrações na ordem correta (001, depois 002).

⚠️ **Primeiro Admin:** Após executar a migração 001, você deve manualmente atribuir a role 'admin' a pelo menos um usuário para poder gerenciar roles de outros usuários.

⚠️ **Backup:** Sempre faça backup do banco de dados antes de executar migrações em produção.

⚠️ **Ambiente de Desenvolvimento:** Teste as migrações em ambiente de desenvolvimento antes de aplicar em produção.
