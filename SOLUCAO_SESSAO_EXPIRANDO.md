# 🔐 Solução: Sessão Expirando Muito Rápido

## Problema

O usuário está sendo deslogado muito rapidamente e retornando para a tela de login.

## ✅ Soluções Implementadas no Código

1. **Atualização automática de token** habilitada
2. **Persistência de sessão** no localStorage
3. **Middleware otimizado** para verificar sessão válida

## 🔧 Configuração no Supabase Dashboard

Para aumentar o tempo de sessão, você precisa configurar no Supabase:

### Passo 1: Acesse as Configurações de Auth

1. Abra **https://app.supabase.com**
2. Selecione seu projeto
3. Vá em **Authentication** (menu lateral)
4. Clique em **Settings** (Configurações)

### Passo 2: Ajustar JWT Expiry (Tempo de Expiração)

Procure por:

**JWT Expiry** ou **Session Duration**

E configure:

- **JWT Expiry**: `604800` (7 dias em segundos)
- Ou escolha: `86400` (24 horas) ou `2592000` (30 dias)

### Passo 3: Salvar

Clique em **Save** para aplicar as mudanças.

## 🔄 Reiniciar o Servidor

Após fazer as mudanças:

1. Pare o servidor (Ctrl+C)
2. Reinicie: `npm run dev`
3. Faça logout e login novamente

## 📋 Configurações Recomendadas

### Para Desenvolvimento:

```
JWT Expiry: 86400 (24 horas)
Refresh Token Reuse Interval: 10
```

### Para Produção:

```
JWT Expiry: 3600 (1 hora)
Refresh Token Reuse Interval: 10
Enable Refresh Token Rotation: true
```

## 🧪 Teste

1. Faça login no sistema
2. Deixe o navegador aberto por 30 minutos
3. Navegue para outra página
4. Você deve continuar logado

## ⚙️ Configurações Adicionais

Se ainda estiver deslogando rápido, verifique:

### 1. Configuração de Cookie SameSite

No Supabase Dashboard → Authentication → Settings:

- **Cookie SameSite**: `lax` (para desenvolvimento local)
- **Cookie SameSite**: `none` (para produção com HTTPS)

### 2. Domínio Autorizado

Em **Authentication** → **URL Configuration**:

- Adicione: `http://localhost:3000` em **Site URL**
- Adicione: `http://localhost:3000/**` em **Redirect URLs**

## 🐛 Debug

Se continuar com problemas, abra o Console do navegador (F12) e procure por:

```
Supabase auth token expired
Session not found
```

Isso indicará exatamente onde está o problema.

## 📝 Notas

- A sessão é renovada automaticamente quando você interage com o sistema
- Se fechar o navegador, a sessão é mantida no localStorage
- Para forçar logout, use o botão "Sair" no menu

---

**Última atualização:** 19/12/2024
