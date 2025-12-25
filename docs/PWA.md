# PWA - Progressive Web App

## ✅ Funcionalidades Implementadas

### 🚀 Instalabilidade

- **Prompt de Instalação**: Banner automático sugerindo instalação após 30 segundos de uso
- **Instalação Multi-Plataforma**: Funciona em Android, iOS, Windows, macOS e Linux
- **Ícones Adaptativos**: Suporte para diferentes tamanhos e plataformas

### 📡 Modo Offline

- **Service Worker**: Cache inteligente de recursos estáticos e API
- **Página Offline**: Página customizada quando não há conexão
- **Indicador de Status**: Banner mostrando quando está offline/online
- **Sincronização**: Dados pendentes sincronizados quando conexão é restaurada

### 🔄 Atualizações Automáticas

- **Update Prompt**: Notificação quando nova versão está disponível
- **Auto-Update**: Verifica atualizações a cada hora
- **Reload Automático**: Atualiza app automaticamente após download

### 💾 Estratégias de Cache

#### 1. **Recursos Estáticos** (Cache First)

- Imagens (PNG, JPG, SVG, WebP)
- Fontes do Google
- Arquivos CSS e JS
- **Vantagem**: Carregamento instantâneo, economia de dados

#### 2. **API Supabase** (Network First)

- Dados sempre atualizados quando online
- Fallback para cache quando offline
- Cache válido por 24 horas
- **Vantagem**: Dados frescos com suporte offline

## 📱 Como Instalar o App

### No Android (Chrome/Edge)

1. Abra o site no navegador
2. Aguarde o banner de instalação ou clique no menu ⋮
3. Selecione "Adicionar à tela inicial" ou "Instalar app"
4. Confirme a instalação

### No iOS (Safari)

1. Abra o site no Safari
2. Toque no botão de compartilhar 📤
3. Role e toque em "Adicionar à Tela de Início"
4. Toque em "Adicionar"

### No Desktop (Chrome/Edge)

1. Abra o site no navegador
2. Clique no ícone de instalação ⊕ na barra de endereço
3. Ou aguarde o banner de instalação aparecer
4. Clique em "Instalar"

## 🎨 Gerando Ícones do PWA

### Opção 1: Online (Recomendado)

Use o [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator):

1. Faça upload de um ícone 512x512px (PNG com fundo)
2. Baixe o pacote completo de ícones
3. Substitua os arquivos em `/public/`

### Opção 2: Manualmente

Crie as seguintes imagens a partir do logo:

```
/public/
├── icon-192x192.png    (192x192px)
├── icon-512x512.png    (512x512px)
└── apple-touch-icon.png (180x180px)
```

**Requisitos dos ícones:**

- Formato PNG com fundo opaco
- Espaçamento interno de ~10% (safe zone)
- Logo centralizado e visível
- Cores vibrantes para destaque

### Dica de Design

- Use fundo gradiente (ex: slate-800 → slate-900)
- Logo branco ou em cor de destaque
- Bordas arredondadas opcionalm (o sistema aplica automaticamente)

## 🔧 Configurações Avançadas

### Modificar Tema do App

Edite em `nuxt.config.ts`:

```typescript
pwa: {
  manifest: {
    theme_color: "#1e293b",        // Cor da barra de status
    background_color: "#0f172a",   // Cor ao abrir o app
  }
}
```

### Ajustar Estratégia de Cache

Edite `workbox.runtimeCaching` em `nuxt.config.ts`:

- **NetworkFirst**: Prioriza rede, cache como fallback
- **CacheFirst**: Prioriza cache, rede como fallback
- **NetworkOnly**: Sempre usa rede (sem cache)
- **CacheOnly**: Sempre usa cache (sem rede)

### Desabilitar PWA em Desenvolvimento

```typescript
pwa: {
  devOptions: {
    enabled: false,  // Mudar para false
  }
}
```

## 📊 Testando o PWA

### Chrome DevTools

1. Abra DevTools (F12)
2. Vá para "Application" → "Service Workers"
3. Verifique se está ativado e rodando
4. Teste modo offline: "Application" → "Service Workers" → marque "Offline"

### Lighthouse Audit

1. DevTools → "Lighthouse"
2. Marque "Progressive Web App"
3. Clique "Generate report"
4. Veja pontuação e sugestões

### Teste de Instalação

1. DevTools → "Application" → "Manifest"
2. Verifique se todos os campos estão corretos
3. Clique "Add to homescreen" para testar

## 🐛 Troubleshooting

### PWA não instala

- Verifique se está usando HTTPS (ou localhost)
- Confirme que os ícones existem em `/public/`
- Veja erros no Console do DevTools

### Service Worker não registra

- Limpe cache: DevTools → Application → Clear storage
- Force refresh: Ctrl+Shift+R (ou Cmd+Shift+R)
- Verifique se `@vite-pwa/nuxt` está instalado

### Página offline não aparece

- Verifique se `/public/offline.html` existe
- Teste desconectando WiFi completamente
- Limpe cache e recarregue

### Ícones não aparecem

- Formato deve ser PNG (não JPG ou SVG)
- Tamanhos devem ser exatos (192x192 e 512x512)
- Nomes devem corresponder ao manifest

## 📚 Recursos

- [PWA Builder](https://www.pwabuilder.com/)
- [Vite PWA Docs](https://vite-pwa-org.netlify.app/)
- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google: PWA Checklist](https://web.dev/pwa-checklist/)

## 🔐 Segurança

- Service Worker só funciona em HTTPS (ou localhost)
- Cache tem expiração automática
- Dados sensíveis nunca são cacheados
- Atualizações verificadas periodicamente

## 🎯 Próximos Passos

1. **Substituir ícones placeholder** pelos reais
2. **Testar instalação** em dispositivos móveis
3. **Verificar score** no Lighthouse (meta: 90+)
4. **Configurar notificações push** (opcional)
5. **Implementar Background Sync** para sincronização de dados offline
