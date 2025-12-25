# 🚀 Guia Rápido: Primeiros Passos com Autenticação

## ✅ Sistema de Login Implementado

Seu sistema agora possui **autenticação completa** com proteção de rotas!

## 🎯 Teste Rápido (3 minutos)

### 1. Criar Primeiro Usuário

**Opção A: Via Supabase Dashboard (Recomendado)**

1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá para **Authentication** → **Users**
4. Clique em **"Add user"** → **"Create new user"**
5. Preencha:
   ```
   Email: admin@marquise.com
   Password: admin123
   ```
6. ✅ Marque **"Auto Confirm User"** (importante!)
7. Clique em **"Create user"**

**Opção B: Via Aplicação**

1. Acesse http://localhost:3000/login
2. Clique em **"Criar conta"**
3. Preencha os dados
4. Clique em **"Criar Conta"**
5. Se confirmação por email estiver ativa, confirme via email

### 2. Fazer Login

1. Acesse http://localhost:3000
2. Será redirecionado automaticamente para `/login`
3. Digite:
   ```
   Email: admin@marquise.com
   Senha: admin123
   ```
4. Clique em **"Entrar"**
5. ✅ Será redirecionado para o sistema!

### 3. Explorar o Sistema

Agora você tem acesso a todas as páginas:

- 📋 **Gerenciar OS**: http://localhost:3000/gerenciar
- ➕ **Nova OS**: http://localhost:3000/nova
- 📊 **Estatísticas**: http://localhost:3000/estatisticas
- 👤 **Perfil**: http://localhost:3000/perfil

## 🔒 Recursos Disponíveis

### ✅ Já Funciona

| Recurso          | Descrição           | Como Usar                   |
| ---------------- | ------------------- | --------------------------- |
| 🔐 Login         | Autenticação segura | Email + senha               |
| 📝 Registro      | Criar nova conta    | Botão "Criar conta"         |
| 🔄 Reset Senha   | Recuperar acesso    | Link "Esqueceu a senha?"    |
| 👤 Perfil        | Visualizar conta    | Clicar no nome no topo      |
| 🔑 Alterar Senha | Atualizar senha     | Página de perfil            |
| 🚪 Logout        | Sair do sistema     | Botão vermelho (ícone sair) |
| 🛡️ Proteção      | Rotas protegidas    | Automático                  |

### 🎨 Interface

- **Dark Mode**: Totalmente compatível ✅
- **Responsivo**: Mobile e Desktop ✅
- **PWA**: Instalável como app ✅
- **Offline**: Funciona sem internet ✅

## 🔧 Configuração Adicional (Opcional)

### Desabilitar Confirmação de Email

Se você quer que usuários possam se registrar sem confirmar email:

1. Supabase Dashboard → **Authentication** → **Settings**
2. Encontre **"Enable email confirmations"**
3. **Desmarque** a opção
4. Salve as alterações

### Configurar SMTP (Para emails reais)

1. Supabase Dashboard → **Project Settings** → **Auth**
2. Role até **SMTP Settings**
3. Configure com seu provedor (Gmail, SendGrid, etc.)
4. Teste enviando um email de reset

## 📊 Status da Proteção

### Rotas Protegidas 🔒

Requerem login:

- ✅ `/` (Home/Gerenciar)
- ✅ `/gerenciar` (Lista OS)
- ✅ `/nova` (Nova OS)
- ✅ `/estatisticas` (Relatórios)
- ✅ `/perfil` (Perfil do usuário)
- ✅ `/visualizar/[id]` (Visualizar OS)

### Rotas Públicas 🌐

Acessíveis sem login:

- ✅ `/login` (Login/Registro)
- ✅ `/reset-password` (Reset de senha)
- ✅ `/install` (Instruções PWA)

## 🎯 Próximos Passos

### 1. Criar Mais Usuários

Adicione seus colaboradores:

```
Email: joao@marquise.com
Senha: (senha segura)

Email: maria@marquise.com
Senha: (senha segura)
```

### 2. Testar Funcionalidades

- [x] Login
- [x] Logout
- [x] Criar OS
- [x] Visualizar OS
- [x] Alterar perfil
- [x] Resetar senha

### 3. Configurar Permissões (Futuro)

Planeje níveis de acesso:

- **Admin**: Acesso total
- **Gerente**: Aprovar e visualizar
- **Técnico**: Criar e editar
- **Visualizador**: Apenas ver

## 🐛 Problemas Comuns

### "Email ou senha incorretos"

**Soluções:**

1. Verifique se usuário foi criado no Supabase
2. Confirme que marcou "Auto Confirm User"
3. Teste com email/senha exatos (case-sensitive na senha)
4. Limpe cache: `Ctrl+Shift+Del`

### Redirect loop infinito

**Solução:**

```bash
# Parar servidor
Ctrl+C

# Limpar tudo
Remove-Item .nuxt -Recurse -Force
Remove-Item node_modules\.cache -Recurse -Force

# Reiniciar
npm run dev
```

### Não redireciona após login

**Verificar:**

1. Console do navegador (F12)
2. Network tab → ver requisições
3. Variáveis de ambiente (.env)

### Session não persiste

**Solução:**

1. Limpar localStorage
2. Verificar se cookies estão habilitados
3. Testar em janela anônima

## 📱 Testar no Mobile

### Android/iOS

1. Certifique-se que está na mesma rede
2. Obtenha IP do computador: `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)
3. Acesse: `http://SEU_IP:3000/login`
4. Faça login normalmente

## 🎓 Documentação Completa

Para detalhes técnicos, consulte:

- **[docs/AUTHENTICATION.md](./AUTHENTICATION.md)** - Documentação completa
- **[docs/PWA.md](./PWA.md)** - Funcionalidades PWA
- **[docs/PWA-TESTING.md](./PWA-TESTING.md)** - Testes do PWA

## 💡 Dicas

### Desenvolvimento

```typescript
// Ver usuário atual em qualquer componente
const { user, isAuthenticated } = useAuth();

console.log("Logado como:", user.value?.email);
console.log("Autenticado?", isAuthenticated.value);
```

### Proteger Nova Página

```vue
<script setup lang="ts">
definePageMeta({
  middleware: "auth", // ✅ Adicione isto!
});
</script>
```

### Logout Programático

```vue
<script setup lang="ts">
const { signOut } = useAuth();

const handleLogout = async () => {
  await signOut();
  // Redireciona automaticamente para /login
};
</script>
```

## ✅ Checklist de Validação

Certifique-se que tudo funciona:

- [ ] Criou usuário no Supabase
- [ ] Consegue fazer login
- [ ] Vê nome do usuário no topo
- [ ] Acessa páginas protegidas
- [ ] Logout funciona
- [ ] Não acessa páginas protegidas sem login
- [ ] Login redireciona para home
- [ ] Reset de senha envia email (se configurado)
- [ ] Dark mode funciona
- [ ] Mobile responsivo

## 🎉 Pronto!

Seu sistema está 100% funcional com:

- ✅ Autenticação completa
- ✅ Proteção de rotas
- ✅ Interface moderna
- ✅ PWA instalável
- ✅ Modo offline
- ✅ Dark mode
- ✅ Responsivo

**Comece a usar:** http://localhost:3000/login
