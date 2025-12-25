<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        🔍 Debug - Verificação de Role
      </h1>

      <!-- Info do useAuth -->
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 mb-6 shadow-lg">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Estado do useAuth
        </h2>
        <div class="space-y-2 font-mono text-sm">
          <div>
            <strong class="text-slate-600 dark:text-slate-400">User ID:</strong>
            <span class="text-slate-900 dark:text-white ml-2">{{
              user?.id || "null"
            }}</span>
          </div>
          <div>
            <strong class="text-slate-600 dark:text-slate-400">Email:</strong>
            <span class="text-slate-900 dark:text-white ml-2">{{
              user?.email || "null"
            }}</span>
          </div>
          <div>
            <strong class="text-slate-600 dark:text-slate-400"
              >userRole:</strong
            >
            <span class="text-slate-900 dark:text-white ml-2">{{
              userRole || "null"
            }}</span>
          </div>
          <div>
            <strong class="text-slate-600 dark:text-slate-400">isAdmin:</strong>
            <span class="text-slate-900 dark:text-white ml-2">{{
              isAdmin
            }}</span>
          </div>
          <div>
            <strong class="text-slate-600 dark:text-slate-400"
              >isManutencao:</strong
            >
            <span class="text-slate-900 dark:text-white ml-2">{{
              isManutencao
            }}</span>
          </div>
        </div>
      </div>

      <!-- Info do Banco -->
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 mb-6 shadow-lg">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Dados do Banco (user_profiles)
        </h2>
        <button
          @click="buscarDadosBanco"
          :disabled="carregando"
          class="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {{ carregando ? "Carregando..." : "Buscar Dados do Banco" }}
        </button>

        <div
          v-if="erro"
          class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg mb-4"
        >
          {{ erro }}
        </div>

        <div v-if="dadosBanco" class="space-y-2 font-mono text-sm">
          <div>
            <strong class="text-slate-600 dark:text-slate-400">ID:</strong>
            <span class="text-slate-900 dark:text-white ml-2">{{
              dadosBanco.id
            }}</span>
          </div>
          <div>
            <strong class="text-slate-600 dark:text-slate-400">Email:</strong>
            <span class="text-slate-900 dark:text-white ml-2">{{
              dadosBanco.email
            }}</span>
          </div>
          <div>
            <strong class="text-slate-600 dark:text-slate-400">Role:</strong>
            <span
              :class="[
                'ml-2 px-2 py-1 rounded',
                dadosBanco.role === 'admin'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  : dadosBanco.role === 'manutencao'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
              ]"
            >
              {{ dadosBanco.role }}
            </span>
          </div>
          <div>
            <strong class="text-slate-600 dark:text-slate-400">Name:</strong>
            <span class="text-slate-900 dark:text-white ml-2">{{
              dadosBanco.name || "null"
            }}</span>
          </div>
        </div>
      </div>

      <!-- Atualizar Role -->
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-4">
          🔧 Tornar Admin
        </h2>
        <p class="text-slate-600 dark:text-slate-400 mb-4">
          Se o role não for 'admin', clique no botão abaixo:
        </p>
        <button
          @click="tornarAdmin"
          :disabled="salvando"
          class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium"
        >
          {{ salvando ? "Salvando..." : "Tornar Meu Usuário Admin" }}
        </button>

        <div
          v-if="sucesso"
          class="mt-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg"
        >
          ✅ {{ sucesso }}
          <br />
          <strong>Faça logout e login novamente para ver o botão Admin!</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, userRole, isAdmin, isManutencao } = useAuth();
const supabase = useSupabase();

const carregando = ref(false);
const salvando = ref(false);
const erro = ref("");
const sucesso = ref("");
const dadosBanco = ref<any>(null);

const buscarDadosBanco = async () => {
  if (!user.value?.id) {
    erro.value = "Usuário não está logado";
    return;
  }

  carregando.value = true;
  erro.value = "";

  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.value.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        erro.value =
          "Perfil não encontrado na tabela user_profiles. Execute a migração SQL primeiro.";
      } else {
        throw error;
      }
    } else {
      dadosBanco.value = data;
    }
  } catch (err: any) {
    erro.value = `Erro: ${err.message || err}`;
    console.error("Erro ao buscar dados do banco:", err);
  } finally {
    carregando.value = false;
  }
};

const tornarAdmin = async () => {
  if (!user.value?.id) {
    erro.value = "Usuário não está logado";
    return;
  }

  salvando.value = true;
  erro.value = "";
  sucesso.value = "";

  try {
    // Primeiro verificar se o registro existe
    const { data: existing } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("id", user.value.id)
      .single();

    if (!existing) {
      // Criar o registro
      const { error: insertError } = await supabase
        .from("user_profiles")
        .insert({
          id: user.value.id,
          email: user.value.email,
          role: "admin",
          name: user.value.email?.split("@")[0],
        });

      if (insertError) throw insertError;
    } else {
      // Atualizar o registro
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({ role: "admin" })
        .eq("id", user.value.id);

      if (updateError) throw updateError;
    }

    sucesso.value = "Role atualizada para admin com sucesso!";
    await buscarDadosBanco();
  } catch (err: any) {
    erro.value = `Erro ao atualizar role: ${err.message || err}`;
    console.error("Erro ao tornar admin:", err);
  } finally {
    salvando.value = false;
  }
};

// Buscar dados automaticamente ao montar
onMounted(() => {
  if (user.value) {
    buscarDadosBanco();
  }
});
</script>
