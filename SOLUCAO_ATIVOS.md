# Solução: Ativos Não Carregam

## Mudanças Implementadas ✅

### 1. **Melhor Tratamento de Erros**

- Timeout aumentado de 15s para 20s
- Mensagens de erro mais detalhadas e úteis
- Logs adicionados com tag `[listarAtivosPorFamilia]` para debugging

### 2. **Retry Automático**

- Se houver erro ao carregar ativos, a sessão é renovada automaticamente
- Nova tentativa é feita com sessão atualizada

### 3. **Botão "Tentar Novamente"**

- Quando há erro ao carregar ativos, um botão vermelho aparece
- Clique para tentar carregar novamente

### 4. **Logs Melhorados**

Abra o console (F12) e procure por linhas como:

```
[listarAtivosPorFamilia] Iniciando busca para familia_id: X
[listarAtivosPorFamilia] Sucesso! Retornando Y ativos
[listarAtivosPorFamilia] Erro ao listar ativos: {erro}
```

## Como Diagnosticar o Problema

### Passo 1: Abrir Console

1. Pressione **F12** (ou **Ctrl+Shift+I**)
2. Vá para a aba **"Console"**

### Passo 2: Reproduzir o Problema

1. Vá para a página de criar ordem de serviço
2. Selecione uma **FAMÍLIA**
3. Observe o carregamento do campo **ATIVO**

### Passo 3: Procurar por Erros

No console, procure por linhas que começam com:

- `[listarAtivosPorFamilia]`
- `Erro ao buscar ativos`

**Exemplo de erro esperado:**

```
[listarAtivosPorFamilia] Erro ao listar ativos:
Detalhes: {
  code: "42501",
  message: "new row violates row level security policy",
  ...
}
```

## Causas Mais Comuns

### 1️⃣ Erro: "row violates row level security policy" (Código 42501)

**Significado:** RLS está bloqueando o acesso
**Solução:** Verifique as políticas em Supabase → Authentication → Row Level Security

### 2️⃣ Erro: "JWT expired" ou "invalid token"

**Significado:** Sessão expirou
**Solução:** Faça logout e login novamente

### 3️⃣ Mensagem: "Nenhum ativo encontrado para esta família"

**Significado:** Não há ativos cadastrados para essa família
**Solução:** Execute o script `insert-ativos.sql` para inserir dados

### 4️⃣ Timeout após 20 segundos

**Significado:** A requisição está demorando muito ou não responde
**Solução:**

- Verifique se tem conexão de internet
- Tente fazer logout e login novamente
- Recarregue a página (Ctrl+F5 ou Cmd+Shift+R)

## Scripts de Ajuda

### 1. Verificar Dados no Banco

Arquivo: `verify-data.sql`

Execute no Supabase SQL Editor para ver:

- Quantas famílias existem
- Quantos ativos existem
- Ativos por família
- Estado do RLS

### 2. Desabilitar RLS Temporariamente (DEBUG ONLY)

Arquivo: `debug-disable-rls.sql`

⚠️ **USE APENAS PARA DEBUG!**

Execute se suspeitar que RLS está bloqueando e quiser confirmar que os dados existem.

## Próximas Ações

Se o problema persistir:

1. ✅ Abra o console (F12)
2. ✅ Reproduza o erro
3. ✅ Copie toda a mensagem de erro
4. ✅ Execute `verify-data.sql` e verifique os resultados
5. ✅ Verifique as políticas RLS em Supabase
6. ✅ Compartilhe essas informações

## Contato/Documentação

- Documento de diagnóstico: `DIAGNOSTICO_ATIVOS.md`
- Script de validação: `verify-data.sql`
- Script de testes: `test-supabase.sh`
