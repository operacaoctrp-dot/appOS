<template>
  <div
    v-if="showInstallPrompt"
    class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 p-4 z-50 animate-slide-up"
  >
    <div class="flex items-start gap-3">
      <div
        class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center"
      >
        <svg
          class="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      </div>

      <div class="flex-1">
        <h3 class="font-semibold text-slate-900 dark:text-white mb-1">
          Instalar appOS
        </h3>
        <p class="text-sm text-slate-600 dark:text-slate-300 mb-3">
          Instale o aplicativo para acesso rápido e use offline!
        </p>

        <div class="flex gap-2">
          <button
            @click="install"
            class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Instalar
          </button>
          <button
            @click="dismiss"
            class="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-medium rounded-lg transition-colors"
          >
            Agora não
          </button>
        </div>
      </div>

      <button
        @click="dismiss"
        class="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>

  <!-- Toast de atualização disponível -->
  <div
    v-if="showUpdatePrompt"
    class="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-green-50 dark:bg-green-900/20 rounded-lg shadow-lg border border-green-200 dark:border-green-800 p-4 z-50 animate-slide-down"
  >
    <div class="flex items-start gap-3">
      <div
        class="flex-shrink-0 w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center"
      >
        <svg
          class="w-5 h-5 text-white"
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

      <div class="flex-1">
        <h3 class="font-semibold text-green-900 dark:text-green-100 mb-1">
          Atualização disponível
        </h3>
        <p class="text-sm text-green-700 dark:text-green-200 mb-3">
          Uma nova versão está disponível!
        </p>

        <button
          @click="update"
          class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Atualizar agora
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const showInstallPrompt = ref(false);
const showUpdatePrompt = ref(false);
let deferredPrompt: any = null;

onMounted(() => {
  // Verificar se já foi instalado ou se o usuário já recusou
  const dismissed = localStorage.getItem("pwa-install-dismissed");
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

  if (!dismissed && !isStandalone) {
    // Mostrar prompt após 30 segundos de uso
    setTimeout(() => {
      if (deferredPrompt) {
        showInstallPrompt.value = true;
      }
    }, 30000);
  }

  // Capturar evento de instalação
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Mostrar prompt se não foi dispensado
    if (!dismissed && !isStandalone) {
      showInstallPrompt.value = true;
    }
  });

  // Detectar quando foi instalado
  window.addEventListener("appinstalled", () => {
    showInstallPrompt.value = false;
    deferredPrompt = null;
    console.log("PWA instalado com sucesso!");
  });

  // Verificar atualizações do service worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              showUpdatePrompt.value = true;
            }
          });
        }
      });
    });
  }
});

const install = async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;

  if (outcome === "accepted") {
    console.log("Usuário aceitou instalar o PWA");
  }

  deferredPrompt = null;
  showInstallPrompt.value = false;
};

const dismiss = () => {
  showInstallPrompt.value = false;
  localStorage.setItem("pwa-install-dismissed", "true");
  // Remover após 7 dias
  setTimeout(() => {
    localStorage.removeItem("pwa-install-dismissed");
  }, 7 * 24 * 60 * 60 * 1000);
};

const update = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.waiting?.postMessage({ type: "SKIP_WAITING" });
    });
  }
  showUpdatePrompt.value = false;
  window.location.reload();
};
</script>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-down {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

.animate-slide-down {
  animation: slide-down 0.3s ease-out;
}
</style>
