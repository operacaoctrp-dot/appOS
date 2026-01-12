# Diagnóstico: Ativos não carregam

## Problema

O campo "ATIVO" fica em "Carregando..." indefinidamente quando você seleciona uma família.

## Causas Possíveis

1. **Nenhum ativo cadastrado** - A tabela de ativos está vazia ou não há ativos para a família selecionada
2. **Erro de RLS (Row Level Security)** - As políticas estão bloqueando o acesso aos dados
3. **Erro de sessão/autenticação** - A sessão expirou ou há problema com a autenticação
4. **Erro de conexão** - Problema de conectividade com o Supabase

## Passos para Diagnosticar

### 1. Verificar o Console do Navegador

1. Abra o navegador (F12 ou Ctrl+Shift+I)
2. Vá para a aba "Console"
3. Selecione uma família
4. Procure por mensagens de erro que começam com `[listarAtivosPorFamilia]`

**Exemplo de erro esperado:**

```
[listarAtivosPorFamilia] Erro ao listar ativos: {error object}
Detalhes: { code: "...", message: "...", hint: "..." }
```

### 2. Verificar Dados no Banco

Execute o script `verify-data.sql` no Supabase SQL Editor:

1. Acesse https://app.supabase.com
2. Seu projeto → SQL Editor
3. Cole o conteúdo de `verify-data.sql`
4. Clique em "Execute"

**Procure por:**

- `total_familias` > 0 ✅
- `total_ativos` > 0 ✅
- Há ativos para as famílias listadas ✅

### 3. Verificar Políticas RLS

Se todos os dados estão presentes:

1. Vá para "Authentication" → "Row Level Security"
2. Clique em "ativos"
3. Verifique se há uma política para SELECT

**Deve haver uma política parecida com:**

```
Permitir leitura de ativos para autenticados
```

### 4. Verificar Autenticação

Se o diagnóstico acima não ajudar:

1. Faça logout (clique no seu perfil)
2. Faça login novamente
3. Tente selecionar a família novamente

## Soluções Rápidas

### ❌ Problema: Tabela vazia

**Solução:** Execute o script `insert-ativos.sql` no Supabase

```sql
-- No SQL Editor do Supabase, cole o arquivo insert-ativos.sql
```

### ❌ Problema: RLS bloqueando

**Solução Temporária (DEBUG):**
Execute o script `debug-disable-rls.sql` para desabilitar RLS temporariamente

```sql
ALTER TABLE ativos DISABLE ROW LEVEL SECURITY;
```

**Solução Permanente:**
Certifique-se que todas as políticas de `ativos` usam:

```sql
TO authenticated
```

(Não `TO public`)

### ❌ Problema: Sessão expirada

**Solução:** Faça logout e login novamente

## Logs Adicionados

O componente agora exibe:

- **Timeout de 20 segundos** (era 15)
- **Mensagens de erro detalhadas** no formulário
- **Console logs** com `[listarAtivosPorFamilia]` tag
- **Retry automático** com renovação de sessão

Abra o console (F12) para ver os logs detalhados.

## Próximos Passos

1. Abra o console (F12)
2. Selecione uma família
3. Compartilhe a mensagem de erro que aparece no console
4. Execute o `verify-data.sql` e compartilhe os resultados
