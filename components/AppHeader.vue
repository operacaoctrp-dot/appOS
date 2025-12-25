<template>
  <header
    class="bg-orange-400 shadow-sm border-b-2 border-orange-500 print:border-black sticky top-0 z-50 text-white"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Desktop Header -->
      <div class="hidden md:flex items-center justify-between py-4">
        <NuxtLink
          to="/"
          class="flex items-center space-x-4 hover:opacity-80 transition"
        >
          <img
            src="/marquise-logo.jpg"
            alt="Marquise Ambiental"
            class="h-16 w-auto rounded shadow-md"
          />
          <div>
            <h1 class="text-xl font-bold text-gray-900">
              Sistema de Ordem de Serviço
            </h1>
            <p class="text-sm text-gray-600">
              Centro de Tratamento de Resíduos Perigosos
            </p>
          </div>
        </NuxtLink>

        <nav class="flex items-center space-x-4">
          <NuxtLink
            to="/nova"
            class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex items-center space-x-2 shadow-md hover:shadow-lg"
          >
            <span class="text-xl">+</span>
            <span>Nova OS</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- Mobile Header -->
      <div class="md:hidden py-1">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <img
              src="/marquise-logo.jpg"
              alt="Marquise Ambiental"
              class="h-12 w-auto rounded"
            />
            <div>
              <h1 class="text-sm font-bold text-gray-900">Sistema OS</h1>
            </div>
          </NuxtLink>
          <div class="flex items-center gap-2">
            <ThemeToggle />
            <button
              @click="menuAberto = !menuAberto"
              class="p-2 text-gray-700 hover:text-green-600"
              aria-label="Menu"
            >
              <svg
                v-if="!menuAberto"
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                v-else
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <nav v-if="menuAberto" class="pb-3 space-y-2">
            <NuxtLink
              to="/gerenciar"
              @click="menuAberto = false"
              class="block px-4 py-2 rounded text-base font-medium transition text-black !text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              Gerenciar OS
            </NuxtLink>
            <NuxtLink
              to="/estatisticas"
              @click="menuAberto = false"
              class="block px-4 py-2 rounded text-base font-medium transition text-black !text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              Estatísticas
            </NuxtLink>
            <NuxtLink
              to="/nova"
              @click="menuAberto = false"
              class="block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center font-semibold"
            >
              + Nova Ordem de Serviço
            </NuxtLink>
            <NuxtLink
              v-if="isAdmin"
              to="/admin/usuarios"
              @click="menuAberto = false"
              class="block px-4 py-2 rounded text-base font-medium transition text-black !text-black dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              👤 Admin
            </NuxtLink>
          </nav>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const menuAberto = ref(false);

// Fechar menu ao navegar
const route = useRoute();
watch(
  () => route.path,
  () => {
    menuAberto.value = false;
  }
);
</script>
