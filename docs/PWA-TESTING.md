# 🚀 Guia Rápido: Testando o PWA

## ✅ Checklist de Testes

### 1. Verificar Manifest

- [ ] Abrir DevTools (F12)
- [ ] Ir para **Application** → **Manifest**
- [ ] Verificar se todos os campos aparecem corretamente
- [ ] Conferir se os ícones carregam

### 2. Verificar Service Worker

- [ ] DevTools → **Application** → **Service Workers**
- [ ] Confirmar que está "activated and running"
- [ ] Status deve estar verde ✅

### 3. Testar Instalação

**Desktop:**

- [ ] Procurar ícone ⊕ na barra de endereço
- [ ] Clicar e confirmar instalação
- [ ] App abre em janela separada

**Mobile:**

- [ ] Aguardar banner de instalação (após 30s)
- [ ] Ou: Menu → "Adicionar à tela inicial"
- [ ] Confirmar e testar ícone na home

### 4. Testar Modo Offline

- [ ] DevTools → **Application** → **Service Workers**
- [ ] Marcar checkbox "Offline"
- [ ] Recarregar página (deve funcionar)
- [ ] Banner amarelo deve aparecer indicando offline
- [ ] Tentar acessar páginas já visitadas

### 5. Testar Cache

- [ ] Visitar todas as páginas principais
- [ ] Marcar modo offline
- [ ] Navegar entre páginas (deve funcionar)
- [ ] Imagens e estilos devem carregar

### 6. Lighthouse Audit

- [ ] DevTools → **Lighthouse**
- [ ] Selecionar "Progressive Web App"
- [ ] Rodar análise
- [ ] **Meta**: Score 90+ ⭐

## 📊 Esperado vs Problemas Comuns

### ✅ Comportamento Esperado

| Situação               | O que deve acontecer                            |
| ---------------------- | ----------------------------------------------- |
| Primeira visita        | Service worker registra, recursos são cacheados |
| Segunda visita         | Carregamento instantâneo do cache               |
| Modo offline           | App funciona, banner amarelo aparece            |
| Atualização disponível | Banner verde com botão "Atualizar"              |
| Instalação             | Ícone ⊕ na barra ou banner após 30s             |

### ❌ Problemas Comuns

| Problema                        | Solução                                  |
| ------------------------------- | ---------------------------------------- |
| Service worker não registra     | HTTPS obrigatório (ou use localhost)     |
| Ícone de instalação não aparece | Aguardar 30s ou limpar cache             |
| Offline não funciona            | Visitar páginas antes de desconectar     |
| Manifest não carrega            | Verificar caminho dos ícones em /public/ |
| Score baixo no Lighthouse       | Conferir checklist PWA no Lighthouse     |

## 🔧 Comandos Úteis

### Limpar Cache Completamente

```bash
# Parar servidor
Stop-Process -Name "node" -Force

# Limpar .nuxt
Remove-Item .nuxt -Recurse -Force

# Reiniciar
npm run dev
```

### Testar em Modo Produção

```bash
# Build
npm run build

# Preview
npm run preview
```

### Gerar Ícones (se ainda não fez)

```bash
# Instalar sharp
npm install sharp

# Executar script
node scripts/generate-pwa-icons.js
```

## 📱 Testar em Dispositivos Reais

### Android

1. Conectar celular via USB
2. Ativar "Depuração USB" no celular
3. Chrome DevTools → Remote Devices
4. Acessar site no celular
5. Testar instalação

### iOS (Safari)

1. Abrir site no Safari do iPhone
2. Compartilhar → Adicionar à Tela Inicial
3. Testar funcionalidade offline

## 🎯 Métricas de Sucesso

### PWA Perfeito ⭐⭐⭐⭐⭐

- [x] **Instalável**: Prompt aparece, instalação funciona
- [x] **Offline**: App funciona sem internet
- [x] **Rápido**: Carregamento < 2s (após cache)
- [x] **Responsivo**: Funciona em todas as resoluções
- [x] **Seguro**: HTTPS ativo
- [x] **Atualizado**: Verificação automática de updates
- [x] **Score**: Lighthouse PWA 90+

## 🐛 Debug

### Ver logs do Service Worker

```javascript
// No console do navegador
navigator.serviceWorker.ready.then((reg) => {
  console.log("Service Worker ativo:", reg);
});
```

### Forçar atualização do SW

```javascript
// Desregistrar SW atual
navigator.serviceWorker.getRegistrations().then((registrations) => {
  registrations.forEach((reg) => reg.unregister());
});

// Recarregar página
location.reload();
```

### Ver cache

```javascript
// Listar todos os caches
caches.keys().then((names) => {
  console.log("Caches disponíveis:", names);
});
```

## 📈 Próximo Nível

Após validar funcionamento básico:

1. **Notificações Push**

   - Adicionar permissão de notificações
   - Configurar Firebase Cloud Messaging
   - Enviar alertas para usuários

2. **Background Sync**

   - Sincronizar dados criados offline
   - Retry automático de requisições falhadas

3. **Share API**

   - Compartilhar ordens de serviço
   - Integração com apps nativos

4. **App Shortcuts**
   - Atalhos no menu do ícone
   - Acesso rápido a funcionalidades

## 📞 Suporte

Problemas? Verifique:

- [docs/PWA.md](./PWA.md) - Documentação completa
- [Lighthouse Report](chrome://lighthouse/) - Análise detalhada
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - Ferramentas de debug
