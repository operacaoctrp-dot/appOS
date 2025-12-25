<template>
  <footer
    class="bg-orange-400 border-t-2 border-orange-500 mt-auto print:hidden text-white"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Desktop Footer -->
      <div class="hidden md:grid md:grid-cols-3 gap-8">
        <!-- Coluna 1 - Sobre -->
        <div>
          <div class="flex items-center space-x-2 mb-3">
            <img
              src="/marquise-logo.jpg"
              alt="Marquise Ambiental"
              class="h-10 w-auto rounded"
            />
            <span class="font-semibold text-gray-900">Ambiental</span>
          </div>
          <p class="text-sm text-gray-600 leading-relaxed">
            Centro de Tratamento de Resíduos Perigosos especializado em soluções
            ambientais sustentáveis.
          </p>
        </div>

        <!-- Coluna 2 - Contato -->
        <div>
          <h3 class="font-semibold text-gray-900 mb-3">Contato</h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li class="flex items-center space-x-2">
              <svg
                class="w-4 h-4 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Estrada do Itaperi, 725 - Jangurussu</span>
            </li>
            <li class="flex items-center space-x-2">
              <svg
                class="w-4 h-4 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>CEP: 60862-220</span>
            </li>
            <li class="flex items-center space-x-2">
              <svg
                class="w-4 h-4 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>contato@marquiseambiental.com</span>
            </li>
          </ul>
        </div>

        <!-- Coluna 3 - Links Rápidos -->
        <div>
          <h3 class="font-semibold text-gray-900 mb-3">Links Rápidos</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <NuxtLink
                to="/"
                class="text-gray-600 hover:text-green-600 transition"
              >
                📋 Lista de Ordens
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/nova"
                class="text-gray-600 hover:text-green-600 transition"
              >
                ➕ Nova Ordem de Serviço
              </NuxtLink>
            </li>
            <li>
              <a href="#" class="text-gray-600 hover:text-green-600 transition">
                📊 Relatórios
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-600 hover:text-green-600 transition">
                ⚙️ Configurações
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Mobile Footer -->
      <div class="md:hidden space-y-4">
        <div class="text-center">
          <div class="inline-flex items-center space-x-2 mb-2">
            <img
              src="/marquise-logo.jpg"
              alt="Marquise Ambiental"
              class="h-10 w-auto rounded"
            />
            <span class="font-semibold text-gray-900">Ambiental</span>
          </div>
          <p class="text-xs text-gray-600">
            Centro de Tratamento de Resíduos Perigosos
          </p>
        </div>

        <div class="text-center text-xs text-gray-600">
          <p>Estrada do Itaperi, 725 - Jangurussu</p>
          <p>CEP: 60862-220</p>
        </div>
      </div>

      <!-- Copyright -->
      <div class="mt-6 pt-6 border-t border-gray-200">
        <div
          class="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0"
        >
          <p class="text-sm text-gray-600">
            © {{ anoAtual }} Marquise Ambiental. Todos os direitos reservados.
          </p>
          <div class="flex items-center space-x-4 text-xs text-gray-600">
            <span class="flex items-center space-x-1">
              <svg
                class="w-4 h-4 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Sistema v1.0.0</span>
            </span>
            <span class="hidden md:inline">|</span>
            <span class="flex items-center space-x-1">
              <svg
                class="w-4 h-4 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Powered by Nuxt 4</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const anoAtual = new Date().getFullYear();
</script>
