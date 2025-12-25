<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4"
  >
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="flex justify-center mb-6">
          <img
            src="/marquise-logo.jpg"
            alt="Marquise Ambiental"
            class="h-16 w-auto rounded-lg shadow-xl"
          />
        </div>
        <h2 class="text-3xl font-bold text-white mb-2">Redefinir Senha</h2>
        <p class="text-slate-300">Digite sua nova senha</p>
      </div>

      <!-- Card -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
        <!-- Mensagem -->
        <div
          v-if="message"
          :class="[
            'mb-6 p-4 rounded-lg flex items-start gap-3',
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800',
          ]"
        >
          <svg
            :class="[
              'w-5 h-5 flex-shrink-0 mt-0.5',
              message.type === 'success'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400',
            ]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              v-if="message.type === 'success'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p
            :class="[
              'text-sm',
              message.type === 'success'
                ? 'text-green-700 dark:text-green-300'
                : 'text-red-700 dark:text-red-300',
            ]"
          >
            {{ message.text }}
          </p>
        </div>

        <form v-if="!success" @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Nova Senha
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              minlength="6"
              class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite a nova senha"
            />
          </div>

          <div>
            <label
              for="confirm-password"
              class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Confirmar Senha
            </label>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              required
              minlength="6"
              class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirme a nova senha"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg
              v-if="loading"
              class="animate-spin h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ loading ? "Redefinindo..." : "Redefinir Senha" }}
          </button>
        </form>

        <div v-else class="text-center">
          <NuxtLink
            to="/login"
            class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Ir para Login
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: [],
});

const { updatePassword, loading } = useAuth();

const password = ref("");
const confirmPassword = ref("");
const message = ref<{ type: "success" | "error"; text: string } | null>(null);
const success = ref(false);

const handleSubmit = async () => {
  message.value = null;

  if (password.value !== confirmPassword.value) {
    message.value = {
      type: "error",
      text: "As senhas não coincidem",
    };
    return;
  }

  if (password.value.length < 6) {
    message.value = {
      type: "error",
      text: "A senha deve ter no mínimo 6 caracteres",
    };
    return;
  }

  const result = await updatePassword(password.value);

  if (result.success) {
    success.value = true;
    message.value = {
      type: "success",
      text: "Senha redefinida com sucesso! Você já pode fazer login.",
    };
  } else {
    message.value = {
      type: "error",
      text: result.error || "Erro ao redefinir senha",
    };
  }
};

useHead({
  title: "Redefinir Senha - appOS",
});
</script>
