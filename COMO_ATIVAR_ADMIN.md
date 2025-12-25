# 🔧 PASSO A PASSO: Como Ativar o Menu Admin

## ⚠️ IMPORTANTE: O botão "Admin" não aparece porque você precisa executar as migrações SQL primeiro!

---

## 📋 Passo 1: Acesse o Supabase Dashboard

1. Abra seu navegador
2. Vá para: **https://app.supabase.com**
3. Faça login na sua conta
4. Selecione seu projeto (appOS)

---

## 📋 Passo 2: Abra o SQL Editor

1. No menu lateral esquerdo, clique em **"SQL Editor"** (ícone de banco de dados)
2. Você verá uma tela com um editor SQL

---

## 📋 Passo 3: Execute a Primeira Migração

1. Abra o arquivo: `E:\Apps\appOS\database\migrations\001_create_user_profiles.sql`
2. **COPIE TODO O CONTEÚDO** do arquivo
3. **COLE** no SQL Editor do Supabase
4. Clique no botão **"Run"** (ou pressione Ctrl+Enter)
5. Aguarde a mensagem de sucesso ✅

---

## 📋 Passo 4: Execute a Segunda Migração

1. Abra o arquivo: `E:\Apps\appOS\database\migrations\002_add_manutencao_preenchidos.sql`
2. **COPIE TODO O CONTEÚDO** do arquivo
3. **COLE** no SQL Editor do Supabase (pode limpar o editor antes)
4. Clique no botão **"Run"**
5. Aguarde a mensagem de sucesso ✅

---

## 📋 Passo 5: Torne Seu Usuário um Admin

**Agora você precisa atribuir a role "admin" ao seu usuário:**

1. No SQL Editor do Supabase, **cole este comando** (SUBSTITUA O EMAIL):

```sql
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'SEU-EMAIL@EXEMPLO.COM';
```

2. **IMPORTANTE**: Substitua `'SEU-EMAIL@EXEMPLO.COM'` pelo email que você usa para fazer login no sistema
3. Clique em **"Run"**
4. Deve retornar "1 row affected" ✅

---

## 📋 Passo 6: Verificar se Funcionou

Execute este comando para ver todos os usuários e suas roles:

```sql
SELECT id, email, role, name, created_at
FROM user_profiles
ORDER BY created_at DESC;
```

Você deve ver seu email com `role = 'admin'`

---

## 📋 Passo 7: Faça Logout e Login Novamente

1. Volte para o sistema (http://localhost:3000)
2. Clique no botão de **Sair** (ícone vermelho no canto superior direito)
3. Faça **login novamente** com suas credenciais
4. **AGORA O BOTÃO "👤 Admin" DEVE APARECER NO MENU!** 🎉

---

## 🎯 Como Será Depois:

**Menu antes (sem admin):**

```
[Gerenciar OS] [Estatísticas] [Nova OS] [seu-email] [Sair] [🌙]
```

**Menu depois (com admin):**

```
[Gerenciar OS] [Estatísticas] [Nova OS] [👤 Admin] [seu-email] [Sair] [🌙]
```

---

## ❓ Problemas Comuns

### "Não vejo o botão Admin mesmo depois de fazer tudo"

**Solução:**

1. Abra o Console do navegador (F12)
2. Vá na aba "Console"
3. Procure por erros relacionados a "user_profiles"
4. Se ver erro, execute novamente o passo 5 (UPDATE user_profiles)

### "Erro ao executar SQL"

**Solução:**

1. Verifique se você está no projeto correto no Supabase
2. Verifique se copiou TODO o conteúdo do arquivo SQL
3. Tente executar linha por linha se der erro

### "1 row affected não apareceu no passo 5"

**Solução:**
Seu usuário pode não ter sido criado ainda na tabela. Execute:

```sql
-- Primeiro, veja seu ID de usuário
SELECT id, email FROM auth.users WHERE email = 'SEU-EMAIL@EXEMPLO.COM';

-- Copie o ID e execute:
INSERT INTO user_profiles (id, email, role)
VALUES ('COLE-O-ID-AQUI', 'SEU-EMAIL@EXEMPLO.COM', 'admin');
```

---

## 📞 Ainda com Problemas?

Se o botão Admin não aparecer:

1. Abra o navegador no modo anônimo
2. Acesse http://localhost:3000
3. Faça login
4. O botão deve aparecer

Se ainda não funcionar, me avise que vamos debugar juntos! 🚀

---

**Última atualização:** 19/12/2024
