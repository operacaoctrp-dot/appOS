<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div
        class="absolute inset-0"
        style="
          background-image: radial-gradient(
            circle at 2px 2px,
            white 1px,
            transparent 0
          );
          background-size: 32px 32px;
        "
      ></div>
    </div>

    <div class="max-w-md w-full space-y-8 relative z-10">
      <!-- Logo e Título -->
      <div class="text-center">
        <div class="flex justify-center mb-6">
          <img
            src="/marquise-logo.jpg"
            alt="Marquise Ambiental"
            class="h-20 w-auto rounded-lg shadow-xl"
          />
        </div>
        <h2 class="text-4xl font-bold text-white mb-2">Sistema de OS</h2>
        <p class="text-slate-300 text-lg">
          {{ showRegister ? "Criar nova conta" : "Entre na sua conta" }}
        </p>
      </div>

      <!-- Card de Login/Registro -->
      <div
        class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 space-y-6"
      >
        <!-- Mensagem de erro -->
        <div
          v-if="errorMessage"
          class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3"
        >
          <svg
            class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p class="text-sm text-red-700 dark:text-red-300">
            {{ errorMessage }}
          </p>
        </div>

        <!-- Mensagem de sucesso -->
        <div
          v-if="successMessage"
          class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3"
        >
          <svg
            class="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
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
          <p class="text-sm text-green-700 dark:text-green-300">
            {{ successMessage }}
          </p>
        </div>

        <!-- Formulário -->
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              autocomplete="email"
              class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="seu@email.com"
            />
          </div>

          <!-- Senha -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Senha
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <svg
                  v-if="!showPassword"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <svg
                  v-else
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Nome (apenas no registro) -->
          <div v-if="showRegister">
            <label
              for="name"
              class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Nome Completo
            </label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Seu nome"
            />
          </div>

          <!-- Link esqueci senha -->
          <div v-if="!showRegister" class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember"
                type="checkbox"
                class="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <label
                for="remember"
                class="ml-2 text-sm text-slate-700 dark:text-slate-300"
              >
                Lembrar de mim
              </label>
            </div>
            <button
              type="button"
              @click="showForgotPassword = true"
              class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              Esqueceu a senha?
            </button>
          </div>

          <!-- Botão Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
            <span>{{
              loading ? "Aguarde..." : showRegister ? "Criar Conta" : "Entrar"
            }}</span>
          </button>
        </form>

        <!-- Link para alternar entre login e registro -->
        <div
          class="text-center pt-4 border-t border-slate-200 dark:border-slate-700"
        >
          <p class="text-sm text-slate-600 dark:text-slate-400">
            {{ showRegister ? "Já tem uma conta?" : "Não tem uma conta?" }}
            <button
              @click="toggleMode"
              class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium ml-1"
            >
              {{ showRegister ? "Fazer login" : "Criar conta" }}
            </button>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-sm text-slate-400">
        © 2025 Marquise Ambiental. Todos os direitos reservados.
      </p>
    </div>

    <!-- Modal Esqueci Senha -->
    <div
      v-if="showForgotPassword"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      @click.self="showForgotPassword = false"
    >
      <div
        class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full"
      >
        <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Recuperar Senha
        </h3>
        <p class="text-slate-600 dark:text-slate-300 mb-6">
          Digite seu email para receber um link de recuperação de senha.
        </p>

        <form @submit.prevent="handleResetPassword" class="space-y-4">
          <input
            v-model="resetEmail"
            type="email"
            required
            placeholder="seu@email.com"
            class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div class="flex gap-3">
            <button
              type="button"
              @click="showForgotPassword = false"
              class="flex-1 px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {{ loading ? "Enviando..." : "Enviar" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: [],
});

const { signIn, signUp, resetPassword, loading } = useAuth();

const formData = reactive({
  email: "",
  password: "",
  name: "",
});

const showPassword = ref(false);
const showRegister = ref(false);
const showForgotPassword = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const resetEmail = ref("");

const handleSubmit = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (showRegister.value) {
    // Registro
    const result = await signUp(formData.email, formData.password, {
      name: formData.name,
    });

    if (result.success) {
      successMessage.value = result.message || "Conta criada com sucesso!";
      formData.email = "";
      formData.password = "";
      formData.name = "";
      showRegister.value = false;
    } else {
      errorMessage.value = result.error || "Erro ao criar conta";
    }
  } else {
    // Login
    const result = await signIn(formData.email, formData.password);

    if (result.success) {
      navigateTo("/");
    } else {
      errorMessage.value = result.error || "Email ou senha incorretos";
    }
  }
};

const handleResetPassword = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  const result = await resetPassword(resetEmail.value);

  if (result.success) {
    successMessage.value = result.message || "Email enviado com sucesso!";
    showForgotPassword.value = false;
    resetEmail.value = "";
  } else {
    errorMessage.value = result.error || "Erro ao enviar email";
  }
};

const toggleMode = () => {
  showRegister.value = !showRegister.value;
  errorMessage.value = "";
  successMessage.value = "";
  formData.email = "";
  formData.password = "";
  formData.name = "";
};

// Meta tags
useHead({
  title: "Login - appOS",
  meta: [
    {
      name: "description",
      content: "Acesse o sistema de gerenciamento de ordens de serviço",
    },
  ],
});
</script>
