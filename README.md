# Sistema de Ordem de Serviço - appOS

Sistema completo de gerenciamento de Ordens de Serviço desenvolvido com Nuxt 4, Tailwind CSS e Supabase.

## 🚀 Características

- ✅ Cadastro completo de Ordens de Serviço
- 📋 Listagem com filtros avançados
- ✏️ Edição de ordens existentes
- 👁️ Visualização detalhada
- 🖨️ Impressão de documentos
- 💾 Armazenamento em Supabase
- 🎨 Interface moderna com Tailwind CSS
- 📱 Design responsivo

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

3. Configure o Supabase:

### Passo 1: Criar Projeto no Supabase

- Acesse https://supabase.com
- Crie uma nova conta ou faça login
- Clique em "New Project"
- Preencha os dados do projeto

### Passo 2: Executar o Schema SQL

- No painel do Supabase, vá em "SQL Editor"
- Copie todo o conteúdo do arquivo `supabase-schema.sql`
- Cole no editor e execute
- Isso criará todas as tabelas e dados iniciais

### Passo 3: Configurar Variáveis de Ambiente

- Crie um arquivo `.env` na raiz do projeto
- Copie o conteúdo de `.env.example`
- No Supabase, vá em Settings > API
- Copie a `Project URL` e cole em `SUPABASE_URL`
- Copie a `anon/public key` e cole em `SUPABASE_KEY`

Exemplo do arquivo `.env`:

```
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🏃‍♂️ Executar o Projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

## 📁 Estrutura do Projeto

```
appOS/
├── components/
│   └── OrdemServicoForm.vue      # Formulário de criação
├── composables/
│   ├── useSupabase.ts            # Cliente Supabase
│   └── useOrdemServico.ts        # Lógica de negócio
├── pages/
│   ├── index.vue                 # Listagem de ordens
│   ├── nova.vue                  # Nova ordem
│   ├── editar/[id].vue          # Editar ordem
│   └── visualizar/[id].vue      # Visualizar/Imprimir
├── types/
│   └── ordem-servico.ts         # Tipos TypeScript
├── supabase-schema.sql          # Schema do banco
└── nuxt.config.ts               # Configuração
```

## 📊 Banco de Dados

O sistema utiliza as seguintes tabelas:

- **familias** - Categorias de equipamentos
- **ativos** - Equipamentos/ativos
- **solicitantes** - Pessoas que solicitam serviços
- **funcionarios** - Executores dos serviços
- **ordens_servico** - Ordens de serviço principais

## 🎯 Funcionalidades

### Tela Principal (Listagem)

- Lista todas as ordens de serviço
- Filtros por número, tipo e categoria
- Botões de ação: Visualizar, Editar, Excluir
- Status visual das ordens

### Nova Ordem de Serviço

- Formulário completo baseado no documento original
- Seleção de tipo e categoria
- Cadastro de sintomas/defeitos
- Seleção de família, ativo e solicitante
- Informações de recebimento e execução
- Controle de insumos utilizados
- Observações e tempo de execução
- Aprovação e liberação

### Visualização

- Exibição completa dos dados
- Layout fiel ao documento original
- Função de impressão otimizada
- Formatação adequada para PDF

### Edição

- Todos os campos editáveis
- Validação de dados
- Atualização em tempo real

## 🔐 Segurança

O projeto está configurado com Row Level Security (RLS) no Supabase. As políticas podem ser ajustadas conforme necessário no arquivo SQL.

## 🎨 Personalização

### Cores

O sistema utiliza as cores da Marquise Ambiental:

- Vermelho/Laranja: Gradiente do logo
- Verde: Botões de ação
- Cinza: Fundo e elementos neutros

### Layout

O layout foi desenvolvido para ser fiel ao documento original da Marquise, mantendo todos os campos e seções.

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:

- Desktop
- Tablet
- Mobile

## 🖨️ Impressão

A página de visualização possui estilos específicos para impressão:

- Remoção de elementos desnecessários
- Cores ajustadas para impressão
- Layout otimizado para A4
- Bordas e formatação adequadas

## 🛠️ Tecnologias

- **Nuxt 4** - Framework Vue.js
- **Vue 3** - Framework JavaScript
- **Tailwind CSS** - Framework CSS
- **Supabase** - Backend as a Service
- **TypeScript** - Tipagem estática

## 📝 Licença

Este projeto foi desenvolvido para uso interno da Marquise Ambiental.

## 👨‍💻 Desenvolvimento

Sistema desenvolvido seguindo as melhores práticas:

- Componentização
- Composables reutilizáveis
- Tipagem forte com TypeScript
- Código limpo e documentado
- Performance otimizada
