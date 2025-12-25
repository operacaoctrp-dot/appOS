<template>
  <div>
    <AppNavigation />
    <Breadcrumbs :items="[{ label: 'Meu Perfil' }]" />

    <div
      class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8"
    >
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4"
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Meu Perfil
          </h1>
          <p class="text-slate-600 dark:text-slate-300">
            Gerencie suas informações pessoais
          </p>
        </div>

        <!-- Card de Informações -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-6">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Informações da Conta
          </h2>

          <div class="space-y-4">
            <div>
              <label
                class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Email
              </label>
              <div
                class="px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                {{ user?.email }}
              </div>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                ID do Usuário
              </label>
              <div
                class="px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400 font-mono text-sm"
              >
                {{ user?.id }}
              </div>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Criado em
              </label>
              <div
                class="px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                {{ formatDate(user?.created_at) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Card de Alterar Senha -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Alterar Senha
          </h2>

          <!-- Mensagem de sucesso/erro -->
          <div
            v-if="message"
            :class="[
              'mb-4 p-4 rounded-lg flex items-start gap-3',
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

          <form @submit.prevent="handleChangePassword" class="space-y-4">
            <div>
              <label
                for="new-password"
                class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Nova Senha
              </label>
              <input
                id="new-password"
                v-model="newPassword"
                type="password"
                required
                minlength="6"
                class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite a nova senha"
              />
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Mínimo de 6 caracteres
              </p>
            </div>

            <div>
              <label
                for="confirm-password"
                class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Confirmar Nova Senha
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
              {{ loading ? "Alterando..." : "Alterar Senha" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const { user, updatePassword, loading } = useAuth();

const newPassword = ref("");
const confirmPassword = ref("");
const message = ref<{ type: "success" | "error"; text: string } | null>(null);

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const handleChangePassword = async () => {
  message.value = null;

  // Validar se as senhas coincidem
  if (newPassword.value !== confirmPassword.value) {
    message.value = {
      type: "error",
      text: "As senhas não coincidem",
    };
    return;
  }

  // Validar comprimento mínimo
  if (newPassword.value.length < 6) {
    message.value = {
      type: "error",
      text: "A senha deve ter no mínimo 6 caracteres",
    };
    return;
  }

  const result = await updatePassword(newPassword.value);

  if (result.success) {
    message.value = {
      type: "success",
      text: result.message || "Senha alterada com sucesso!",
    };
    newPassword.value = "";
    confirmPassword.value = "";
  } else {
    message.value = {
      type: "error",
      text: result.error || "Erro ao alterar senha",
    };
  }
};

// Meta tags
useHead({
  title: "Meu Perfil - appOS",
});
</script>
