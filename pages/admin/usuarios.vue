<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          👤 Gerenciar Usuários
        </h1>
        <p class="text-slate-600 dark:text-slate-400">
          Gerencie roles e permissões dos usuários do sistema
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="carregando" class="flex justify-center items-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
        ></div>
      </div>

      <!-- Content -->
      <div
        v-else
        class="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
      >
        <!-- Table -->
        <div class="overflow-x-auto">
          <table
            class="min-w-full divide-y divide-slate-200 dark:divide-slate-700"
          >
            <thead class="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Nome
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Role Atual
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Alterar Role
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Cadastrado em
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody
              class="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700"
            >
              <tr
                v-for="user in usuarios"
                :key="user.id"
                class="hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    class="text-sm font-medium text-slate-900 dark:text-white"
                  >
                    {{ user.email }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-slate-600 dark:text-slate-400">
                    {{ user.name || "-" }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getRoleBadgeClass(user.role)"
                    class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ getRoleLabel(user.role) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <select
                    v-model="user.novoRole"
                    :disabled="salvandoId === user.id"
                    class="px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  >
                    <option value="admin">Admin</option>
                    <option value="manutencao">Manutenção</option>
                    <option value="visualizador">Visualizador</option>
                  </select>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400"
                >
                  {{ formatarData(user.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    v-if="user.role !== user.novoRole"
                    @click="atualizarRole(user)"
                    :disabled="salvandoId === user.id"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ salvandoId === user.id ? "Salvando..." : "Salvar" }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="usuarios.length === 0" class="text-center py-12">
          <p class="text-slate-500 dark:text-slate-400">
            Nenhum usuário encontrado
          </p>
        </div>
      </div>

      <!-- Info Box -->
      <div
        class="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
      >
        <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          ℹ️ Sobre as Roles
        </h3>
        <div class="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <p>
            <strong>Admin:</strong> Acesso total ao sistema, pode gerenciar
            usuários, preencher manutenção e fechar OS.
          </p>
          <p>
            <strong>Manutenção:</strong> Pode preencher dados de manutenção
            (descrição, executor, insumos, etc). Necessário para permitir
            fechamento da OS.
          </p>
          <p>
            <strong>Visualizador:</strong> Pode apenas visualizar ordens de
            serviço. Não pode preencher manutenção nem fechar OS sem dados
            preenchidos.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserProfile, UserRole } from "~/types/user";

definePageMeta({
  middleware: "auth",
});

interface UsuarioComNovoRole extends UserProfile {
  novoRole: UserRole;
}

const { user, ensureValidSession } = useAuth();
const { success, error: showError } = useNotification();
const supabase = useSupabase();

const carregando = ref(true);
const salvandoId = ref<string | null>(null);
const usuarios = ref<UsuarioComNovoRole[]>([]);

const carregarUsuarios = async () => {
  try {
    carregando.value = true;

    // Garantir sessão válida antes de carregar dados
    await ensureValidSession();

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    usuarios.value = (data || []).map((u: any) => ({
      ...u,
      novoRole: u.role as UserRole,
    }));
  } catch (err) {
    console.error("Erro ao carregar usuários:", err);
    showError("Erro ao carregar usuários");
  } finally {
    carregando.value = false;
  }
};

const atualizarRole = async (usuario: UsuarioComNovoRole) => {
  try {
    salvandoId.value = usuario.id;

    const { error } = await supabase
      .from("user_profiles")
      .update({ role: usuario.novoRole })
      .eq("id", usuario.id);

    if (error) throw error;

    usuario.role = usuario.novoRole as UserRole;
    success(
      `Role de ${usuario.email} atualizada para ${getRoleLabel(
        usuario.novoRole
      )}`
    );
  } catch (err) {
    console.error("Erro ao atualizar role:", err);
    showError("Erro ao atualizar role do usuário");
    usuario.novoRole = usuario.role; // Reverter
  } finally {
    salvandoId.value = null;
  }
};

const getRoleLabel = (role: string): string => {
  const labels: Record<string, string> = {
    admin: "Admin",
    manutencao: "Manutenção",
    visualizador: "Visualizador",
  };
  return labels[role] || role;
};

const getRoleBadgeClass = (role: string): string => {
  const classes: Record<string, string> = {
    admin:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    manutencao: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    visualizador:
      "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300",
  };
  return (
    classes[role] ||
    "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
  );
};

const formatarData = (data: string): string => {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Verificar se usuário é admin
onMounted(async () => {
  // Verificar role do usuário atual
  const { data: perfil } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.value?.id)
    .single();

  if (!perfil || perfil.role !== "admin") {
    showError(
      "Acesso negado. Apenas administradores podem acessar esta página."
    );
    await navigateTo("/");
    return;
  }

  await carregarUsuarios();
});
</script>
