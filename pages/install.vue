<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4"
  >
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-4"
        >
          <svg
            class="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-slate-900 dark:text-white mb-3">
          Instale o appOS
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-300">
          Use como aplicativo nativo no seu dispositivo
        </p>
      </div>

      <!-- Status Cards -->
      <div class="grid md:grid-cols-3 gap-4 mb-12">
        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <div class="flex items-center gap-3 mb-2">
            <div
              class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 class="font-semibold text-slate-900 dark:text-white">Rápido</h3>
          </div>
          <p class="text-sm text-slate-600 dark:text-slate-300">
            Carregamento instantâneo com cache inteligente
          </p>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <div class="flex items-center gap-3 mb-2">
            <div
              class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                />
              </svg>
            </div>
            <h3 class="font-semibold text-slate-900 dark:text-white">
              Offline
            </h3>
          </div>
          <p class="text-sm text-slate-600 dark:text-slate-300">
            Funciona sem conexão com a internet
          </p>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <div class="flex items-center gap-3 mb-2">
            <div
              class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <h3 class="font-semibold text-slate-900 dark:text-white">
              Atualizado
            </h3>
          </div>
          <p class="text-sm text-slate-600 dark:text-slate-300">
            Atualizações automáticas em segundo plano
          </p>
        </div>
      </div>

      <!-- Installation Instructions -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-8">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Como Instalar
        </h2>

        <!-- Tabs -->
        <div class="flex gap-2 mb-6 overflow-x-auto">
          <button
            v-for="platform in platforms"
            :key="platform.id"
            @click="selectedPlatform = platform.id"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap',
              selectedPlatform === platform.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600',
            ]"
          >
            {{ platform.name }}
          </button>
        </div>

        <!-- Instructions -->
        <div class="space-y-4">
          <div
            v-for="(step, index) in currentPlatform.steps"
            :key="index"
            class="flex gap-4"
          >
            <div
              class="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold"
            >
              {{ index + 1 }}
            </div>
            <p class="text-slate-700 dark:text-slate-300 flex-1 pt-1">
              {{ step }}
            </p>
          </div>
        </div>
      </div>

      <!-- Features -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-8">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Recursos do PWA
        </h2>

        <div class="grid md:grid-cols-2 gap-4">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="flex gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50"
          >
            <div class="flex-shrink-0 text-blue-600 dark:text-blue-400">
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-slate-900 dark:text-white mb-1">
                {{ feature.title }}
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-300">
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Back Button -->
      <div class="text-center">
        <button
          @click="$router.push('/')"
          class="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          Voltar ao Início
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const selectedPlatform = ref("android");

const platforms = [
  { id: "android", name: "📱 Android" },
  { id: "ios", name: "🍎 iOS" },
  { id: "desktop", name: "💻 Desktop" },
];

const platformInstructions = {
  android: {
    steps: [
      "Abra o site no Chrome ou Edge",
      "Toque no menu (⋮) no canto superior direito",
      'Selecione "Adicionar à tela inicial" ou "Instalar app"',
      'Confirme tocando em "Instalar" ou "Adicionar"',
      "O ícone aparecerá na sua tela inicial",
    ],
  },
  ios: {
    steps: [
      "Abra o site no Safari (navegador padrão do iPhone)",
      "Toque no botão de compartilhar (📤) na barra inferior",
      'Role a lista e toque em "Adicionar à Tela de Início"',
      'Edite o nome se desejar e toque em "Adicionar"',
      "O app aparecerá na sua tela inicial",
    ],
  },
  desktop: {
    steps: [
      "Abra o site no Chrome, Edge ou outro navegador compatível",
      "Clique no ícone de instalação (⊕) na barra de endereço",
      "Ou aguarde o banner de instalação aparecer automaticamente",
      'Clique em "Instalar" na janela de confirmação',
      "O app será adicionado ao seu sistema como aplicativo nativo",
    ],
  },
};

const features = [
  {
    title: "Acesso Instantâneo",
    description: "Lance direto da tela inicial como um app nativo",
  },
  {
    title: "Modo Offline",
    description: "Continue usando mesmo sem conexão à internet",
  },
  {
    title: "Notificações",
    description: "Receba alertas importantes mesmo com o app fechado",
  },
  {
    title: "Sem Download na Loja",
    description:
      "Instale diretamente do navegador, sem Apple Store ou Google Play",
  },
  {
    title: "Economia de Dados",
    description: "Cache inteligente reduz consumo de internet",
  },
  {
    title: "Sempre Atualizado",
    description: "Receba atualizações automaticamente em segundo plano",
  },
  {
    title: "Tela Cheia",
    description: "Interface sem barras do navegador para melhor experiência",
  },
  {
    title: "Sincronização",
    description: "Dados criados offline são sincronizados quando voltar online",
  },
];

const currentPlatform = computed(() => {
  return platformInstructions[
    selectedPlatform.value as keyof typeof platformInstructions
  ];
});

// Meta tags
useHead({
  title: "Instalar App - appOS",
  meta: [
    {
      name: "description",
      content:
        "Instale o appOS como aplicativo nativo em seu dispositivo para acesso rápido e uso offline",
    },
  ],
});
</script>
