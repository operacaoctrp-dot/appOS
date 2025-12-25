<template>
  <nav
    class="bg-white dark:bg-slate-800 shadow-md border-b border-gray-200 dark:border-slate-700 transition-colors duration-200 md:bg-white md:dark:bg-slate-800 bg-transparent"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-12 md:h-16">
        <!-- Navigation Links -->
        <div class="flex items-center space-x-8">
          <div class="hidden md:flex space-x-4">
            <NuxtLink
              to="/gerenciar"
              class="px-3 py-2 rounded-md text-sm font-medium transition"
              :class="
                isActive('/gerenciar') || isActive('/')
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700'
              "
            >
              Gerenciar OS
            </NuxtLink>
            <NuxtLink
              to="/estatisticas"
              class="px-3 py-2 rounded-md text-sm font-medium transition"
              :class="
                isActive('/estatisticas')
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700'
              "
            >
              Estatísticas
            </NuxtLink>
            <NuxtLink
              to="/nova"
              class="px-3 py-2 rounded-md text-sm font-medium transition"
              :class="
                isActive('/nova')
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700'
              "
            >
              Nova OS
            </NuxtLink>
            <NuxtLink
              v-if="isAdmin"
              to="/admin/usuarios"
              class="px-3 py-2 rounded-md text-sm font-medium transition"
              :class="
                isActive('/admin')
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20'
              "
            >
              👤 Admin
            </NuxtLink>
          </div>
        </div>

        <!-- User Menu & Actions -->
        <div class="flex items-center gap-2">
          <!-- User Info (Desktop) -->
          <div class="hidden md:flex items-center gap-3 mr-2">
            <NuxtLink
              to="/perfil"
              class="text-right hover:opacity-80 transition-opacity"
            >
              <p class="text-sm font-medium text-slate-900 dark:text-white">
                {{ user?.email?.split("@")[0] }}
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Ver perfil →
              </p>
            </NuxtLink>
            <button
              @click="handleLogout"
              class="p-2 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Sair"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div
      v-if="mobileMenuOpen"
      class="md:hidden border-t border-gray-200 dark:border-slate-700"
    >
      <div class="px-2 pt-2 pb-3 space-y-1">
        <NuxtLink
          to="/gerenciar"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-md text-base font-medium transition"
          :class="
            isActive('/gerenciar') || isActive('/')
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700'
          "
        >
          Gerenciar OS
        </NuxtLink>
        <NuxtLink
          to="/estatisticas"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-md text-base font-medium transition"
          :class="
            isActive('/estatisticas')
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700'
          "
        >
          Estatísticas
        </NuxtLink>
        <NuxtLink
          to="/nova"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-md text-base font-medium transition"
          :class="
            isActive('/nova')
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700'
          "
        >
          Nova OS
        </NuxtLink>
        <NuxtLink
          v-if="isAdmin"
          to="/admin/usuarios"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-md text-base font-medium transition"
          :class="
            isActive('/admin')
              ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200'
              : 'text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20'
          "
        >
          👤 Admin
        </NuxtLink>

        <!-- Logout Mobile -->
        <button
          @click="handleLogout"
          class="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center gap-2"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Sair
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute();
const mobileMenuOpen = ref(false);
const { user, signOut, isAdmin } = useAuth();

const handleLogout = async () => {
  await signOut();
  mobileMenuOpen.value = false;
};

const isActive = (path: string) => {
  if (path === "/") {
    return route.path === "/";
  }
  return route.path.startsWith(path);
};

// Inicializar tema
const { initTheme } = useTheme();
onMounted(() => {
  initTheme();
});

// Fechar menu mobile ao navegar
watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false;
  }
);
</script>
