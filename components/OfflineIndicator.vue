<template>
  <transition name="slide-down">
    <div
      v-if="!isOnline"
      class="fixed top-0 left-0 right-0 z-50 bg-yellow-500 dark:bg-yellow-600 text-white py-2 px-4 text-center text-sm font-medium shadow-lg"
    >
      <div class="flex items-center justify-center gap-2">
        <svg
          class="w-5 h-5 animate-pulse"
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
        <span
          >Você está offline. Algumas funcionalidades podem estar
          limitadas.</span
        >
      </div>
    </div>
  </transition>

  <transition name="slide-down">
    <div
      v-if="isOnline && wasOffline"
      class="fixed top-0 left-0 right-0 z-50 bg-green-500 dark:bg-green-600 text-white py-2 px-4 text-center text-sm font-medium shadow-lg"
    >
      <div class="flex items-center justify-center gap-2">
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Conexão restaurada!</span>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
const { isOnline, wasOffline } = useOffline();

// Esconder notificação de "conexão restaurada" após 3 segundos
watch(wasOffline, (newValue) => {
  if (newValue && isOnline.value) {
    setTimeout(() => {
      wasOffline.value = false;
    }, 3000);
  }
});
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-down-enter-from {
  transform: translateY(-100%);
}

.slide-down-leave-to {
  transform: translateY(-100%);
}
</style>
