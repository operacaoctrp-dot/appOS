<template>
  <div>
    <!-- Loading Overlay -->
    <div
      v-if="carregandoDados"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-8 flex flex-col items-center">
        <div
          class="h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"
        ></div>
        <p class="text-gray-700 font-medium">Carregando formulário...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-lg">
        <!-- Título -->
        <div
          class="bg-gradient-to-r from-gray-800 to-gray-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg"
        >
          <h2 class="text-2xl font-bold italic">ORDEM DE SERVIÇO</h2>
          <div class="text-right">
            <span class="text-sm">N°</span>
            <span class="text-3xl font-bold ml-2"
              >{{ numeroOS }}/{{
                String(new Date().getFullYear()).slice(-2)
              }}</span
            >
          </div>
        </div>

        <form @submit.prevent="salvarOrdem" class="p-6 space-y-6">
          <!-- Preenchimento do Solicitante -->
          <div class="border-2 border-gray-300 rounded-lg">
            <div class="bg-gray-100 px-4 py-2 border-b-2 border-gray-300">
              <h3 class="font-bold text-gray-800">
                PREENCHIMENTO DO SOLICITANTE
              </h3>
            </div>

            <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Tipo de O.S. -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2"
                  >TIPO DE O.S.:</label
                >
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      type="radio"
                      v-model="form.tipo_os"
                      value="PREVENTIVA"
                      class="w-4 h-4 text-blue-600"
                    />
                    <span class="ml-2">PREVENTIVA</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="radio"
                      v-model="form.tipo_os"
                      value="CORRETIVA"
                      class="w-4 h-4 text-blue-600"
                    />
                    <span class="ml-2">CORRETIVA</span>
                  </label>
                </div>
              </div>

              <!-- Categoria do Serviço -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2"
                  >CATEGORIA DO SERVIÇO:</label
                >
                <div class="grid grid-cols-2 gap-2">
                  <label class="flex items-center">
                    <input
                      type="radio"
                      v-model="form.categoria_servico"
                      value="MECÂNICO"
                      class="w-4 h-4 text-blue-600"
                    />
                    <span class="ml-2 text-sm">MECÂNICO</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="radio"
                      v-model="form.categoria_servico"
                      value="ELÉTRICO"
                      class="w-4 h-4 text-blue-600"
                    />
                    <span class="ml-2 text-sm">ELÉTRICO</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="radio"
                      v-model="form.categoria_servico"
                      value="HIDRÁULICO"
                      class="w-4 h-4 text-blue-600"
                    />
                    <span class="ml-2 text-sm">HIDRÁULICO</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="radio"
                      v-model="form.categoria_servico"
                      value="MANUTENÇÃO PREDIAL"
                      class="w-4 h-4 text-blue-600"
                    />
                    <span class="ml-2 text-sm">MANUTENÇÃO PREDIAL</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="radio"
                      v-model="form.categoria_servico"
                      value="SOLDA"
                      class="w-4 h-4 text-blue-600"
                    />
                    <span class="ml-2 text-sm">SOLDA</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="radio"
                      v-model="form.categoria_servico"
                      value="PINTURA"
                      class="w-4 h-4 text-blue-600"
                    />
                    <span class="ml-2 text-sm">PINTURA</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Sintoma/Defeito -->
            <div class="px-4 pb-4">
              <label class="block text-sm font-semibold text-gray-700 mb-2"
                >SINTOMA/DEFEITO:</label
              >
              <textarea
                v-model="form.sintoma_defeito"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                placeholder="Descreva o sintoma ou defeito..."
                style="text-transform: uppercase"
              ></textarea>
            </div>

            <!-- Família, Ativo, Solicitante, Data -->
            <div class="px-4 pb-4 flex flex-wrap gap-4">
              <div style="min-width: 170px">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  FAMÍLIA: ({{ familias.length }} itens)
                </label>
                <SearchableSelect
                  v-model="form.familia_id"
                  :options="familiasOptions"
                  placeholder="Selecione ou pesquise..."
                  :required="true"
                  @change="onFamiliaChange"
                  font-size="text-xs"
                  style="min-width: 170px"
                />
              </div>
              <div style="position: relative; min-width: 420px">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  ATIVO:
                </label>
                <SearchableSelect
                  v-model="form.ativo_id"
                  :options="ativosOptions"
                  placeholder="Selecione ou pesquise..."
                  :disabled="!form.familia_id || ativosLoading"
                  :required="true"
                  font-size="text-xs"
                  style="min-width: 420px"
                />
                <div
                  v-if="ativosLoading"
                  class="absolute right-2 top-2 text-xs text-blue-600 flex items-center gap-1 bg-white bg-opacity-80 px-2 py-1 rounded"
                >
                  <svg class="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                      fill="none"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Carregando...
                </div>
                <div v-if="ativosErro" class="text-xs text-red-600 mt-1">
                  {{ ativosErro }}
                </div>
              </div>
              <div style="min-width: 300px">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  SOLICITANTE:
                </label>
                <SearchableSelect
                  v-model="form.solicitante_id"
                  :options="solicitantesOptions"
                  placeholder="Selecione ou pesquise..."
                  :required="true"
                  font-size="text-xs"
                />
              </div>
              <div style="min-width: 140px">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  DATA:
                </label>
                <input
                  type="date"
                  v-model="form.data_solicitacao"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-xs"
                  required
                />
              </div>
            </div>
          </div>

          <!-- Recebimento da Manutenção -->
          <div class="border-2 border-gray-300 rounded-lg">
            <div class="bg-gray-100 px-4 py-2 border-b-2 border-gray-300">
              <h3 class="font-bold text-gray-800">
                PREENCHIMENTO DA MANUTENÇÃO
              </h3>
            </div>

            <div class="p-4">
              <h4 class="font-semibold text-gray-700 mb-3">
                RECEBIMENTO DE O.S.
              </h4>
              <div class="flex flex-wrap gap-4">
                <div style="min-width: 500px">
                  <label class="block text-sm font-semibold text-gray-700 mb-2"
                    >NOME:</label
                  >
                  <SearchableSelect
                    v-model="form.recebido_por_id"
                    :options="funcionariosOptions"
                    placeholder="Selecione ou pesquise..."
                    :required="true"
                  />
                </div>
                <div style="min-width: 300px">
                  <label class="block text-sm font-semibold text-gray-700 mb-2"
                    >FUNÇÃO:</label
                  >
                  <input
                    type="text"
                    :value="funcaoRecebedor"
                    readonly
                    class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div style="min-width: 140px">
                  <label class="block text-sm font-semibold text-gray-700 mb-2"
                    >DATA:</label
                  >
                  <input
                    type="date"
                    v-model="form.data_recebimento"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div style="min-width: 120px">
                  <label class="block text-sm font-semibold text-gray-700 mb-2"
                    >HORA:</label
                  >
                  <input
                    type="time"
                    v-model="form.hora_recebimento"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Botões de Ação -->
          <div class="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              @click="$router.push('/')"
              class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="salvando"
              class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {{
                salvando
                  ? "Salvando..."
                  : isEditMode
                  ? "Atualizar Ordem de Serviço"
                  : "Salvar Ordem de Serviço"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  Familia,
  Ativo,
  Solicitante,
  Funcionario,
  Insumo,
  OrdemServico,
} from "~/types/ordem-servico";
import { useOffline } from "~/composables/useOffline";
import { useAuth } from "~/composables/useAuth";

// Props para modo de edição
const props = defineProps<{
  ordemId?: number;
}>();

const isEditMode = computed(() => !!props.ordemId);

const router = useRouter();
const { success, error: showError } = useNotification();
const { refreshSession, ensureValidSession } = useAuth();
const {
  getProximoNumero,
  criarOrdem,
  atualizarOrdem,
  buscarOrdem,
  listarFamilias,
  listarAtivosPorFamilia,
  listarSolicitantes,
  listarFuncionarios,
} = useOrdemServico();

// Estados
const numeroOS = ref(0);
const salvando = ref(false);
const carregandoDados = ref(true);
const familias = ref<Familia[]>([]);
const ativos = ref<Ativo[]>([]);
const ativosFiltrados = ref<Ativo[]>([]);
const ativosLoading = ref(false);
const ativosErro = ref("");
const { isOnline } = useOffline();
let timeoutAtivos: any = null;
const solicitantes = ref<Solicitante[]>([]);
const funcionarios = ref<Funcionario[]>([]);

// Data atual formatada
const dataAtual = new Date().toISOString().split("T")[0];
const horaAtual =
  new Date().toTimeString().split(" ")[0]?.substring(0, 5) || "00:00";

// Tipo estendido para o formulário (inclui executores que não está no tipo base)
interface FormOrdemServico extends Partial<OrdemServico> {
  executores?: (number | undefined)[];
}

// Formulário
const form = ref<FormOrdemServico>({
  numero: 0,
  tipo_os: "CORRETIVA",
  categoria_servico: "MECÂNICO",
  sintoma_defeito: "",
  familia_id: undefined,
  ativo_id: undefined,
  solicitante_id: undefined,
  data_solicitacao: dataAtual,
  recebido_por_id: undefined,
  data_recebimento: dataAtual,
  hora_recebimento: horaAtual,
  descricao_servico: "",
  executor_id: undefined,
  executores: [undefined],
  insumos: [],
  observacoes: "",
  tempo_inicio: "",
  tempo_fim: "",
  custos_concluidos: false,
  custo_total: 0,
  liberado_operacao: false,
  data_liberacao: undefined,
  aprovado_por: undefined,
});

// Computed
const funcaoRecebedor = computed(() => {
  if (!form.value.recebido_por_id) return "";
  const func = funcionarios.value.find(
    (f) => f.id === form.value.recebido_por_id
  );
  return func?.funcao || "";
});

const familiasOptions = computed(() =>
  familias.value.map((f) => ({
    value: f.id,
    label: `${f.codigo} - ${f.familia}`,
  }))
);

const ativosOptions = computed(() =>
  ativosFiltrados.value.map((a) => ({
    value: a.id,
    label: `${a.codigo} - ${a.nome}`,
  }))
);

const solicitantesOptions = computed(() =>
  solicitantes.value.map((s) => ({ value: s.id, label: s.nome }))
);

const funcionariosOptions = computed(() =>
  funcionarios.value.map((f) => ({ value: f.id, label: f.nome }))
);

// Métodos
const carregarDados = async () => {
  carregandoDados.value = true;
  try {
    console.log("Carregando dados...");

    // Carregar dados auxiliares primeiro
    familias.value = await listarFamilias();
    console.log("Famílias carregadas:", familias.value);

    solicitantes.value = await listarSolicitantes();
    console.log("Solicitantes carregados:", solicitantes.value);

    funcionarios.value = await listarFuncionarios();
    console.log("Funcionários carregados:", funcionarios.value);

    // Modo edição: carregar dados da OS existente
    if (isEditMode.value && props.ordemId) {
      const ordem = await buscarOrdem(props.ordemId);
      if (ordem) {
        numeroOS.value = ordem.numero;

        // Carregar ativos da família
        if (ordem.familia_id) {
          ativosFiltrados.value = await listarAtivosPorFamilia(
            ordem.familia_id
          );
        }

        // Preencher formulário com dados existentes
        form.value = {
          numero: ordem.numero,
          tipo_os: ordem.tipo_os,
          categoria_servico: ordem.categoria_servico,
          sintoma_defeito: ordem.sintoma_defeito || "",
          familia_id: ordem.familia_id,
          ativo_id: ordem.ativo_id,
          solicitante_id: ordem.solicitante_id,
          data_solicitacao: ordem.data_solicitacao,
          recebido_por_id: ordem.recebido_por_id,
          data_recebimento: ordem.data_recebimento || "",
          hora_recebimento: ordem.hora_recebimento || "",
          descricao_servico: ordem.descricao_servico || "",
          executor_id: ordem.executor_id,
          executores: (ordem as any).executores?.map((e: any) => e.id) || [
            ordem.executor_id || undefined,
          ],
          insumos: ordem.insumos || [],
          observacoes: ordem.observacoes || "",
          data_inicio: ordem.data_inicio || "",
          tempo_inicio: ordem.tempo_inicio || "",
          data_fim: ordem.data_fim || "",
          tempo_fim: ordem.tempo_fim || "",
          custos_concluidos: ordem.custos_concluidos || false,
          custo_total: ordem.custo_total || 0,
          liberado_operacao: ordem.liberado_operacao || false,
          data_liberacao: ordem.data_liberacao || undefined,
          aprovado_por: ordem.aprovado_por || undefined,
        };

        // Garantir pelo menos um executor no array
        if (!form.value.executores || form.value.executores.length === 0) {
          form.value.executores = [undefined];
        }

        console.log("Ordem carregada para edição:", ordem);
      } else {
        showError("Ordem de serviço não encontrada");
        router.push("/gerenciar");
        return;
      }
    } else {
      // Modo criação: buscar próximo número
      numeroOS.value = await getProximoNumero();
      form.value.numero = numeroOS.value;
      console.log("Número OS:", numeroOS.value);
    }
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    showError("Erro ao carregar dados do formulário");
  } finally {
    carregandoDados.value = false;
  }
};

const onFamiliaChange = async () => {
  ativosErro.value = "";
  ativosLoading.value = true;
  clearTimeout(timeoutAtivos);
  timeoutAtivos = setTimeout(() => {
    if (ativosLoading.value) {
      ativosErro.value = isOnline.value
        ? "Erro: tempo excedido ao buscar ativos. Tente novamente."
        : "Você está offline. Conecte-se à internet para buscar ativos.";
      ativosLoading.value = false;
    }
  }, 15000); // Aumentado para 15 segundos para dar tempo ao refresh

  try {
    if (form.value.familia_id) {
      // Garantir sessão válida ANTES de fazer a requisição
      if (isOnline.value) {
        console.log("Verificando sessão antes de buscar ativos...");
        await ensureValidSession();
      }

      let ativos = await listarAtivosPorFamilia(form.value.familia_id);

      // Se não retornou ativos e está online, tentar renovar sessão e buscar novamente
      if (!ativos.length && isOnline.value) {
        console.log("Nenhum ativo retornado, tentando renovar sessão...");
        const sessionRenewed = await refreshSession();
        if (sessionRenewed) {
          console.log("Sessão renovada, buscando ativos novamente...");
          ativos = await listarAtivosPorFamilia(form.value.familia_id);
        }
      }

      ativosFiltrados.value = ativos;
      if (!ativos.length) {
        ativosErro.value = "Nenhum ativo encontrado para esta família.";
      }
      form.value.ativo_id = undefined;
    } else {
      ativosFiltrados.value = [];
    }
  } catch (e: any) {
    console.error("Erro ao buscar ativos:", e);

    // Tentar renovar sessão em caso de erro
    if (isOnline.value) {
      console.log("Erro detectado, tentando renovar sessão...");
      const sessionRenewed = await refreshSession();
      if (sessionRenewed && form.value.familia_id) {
        try {
          console.log("Sessão renovada, tentando buscar ativos novamente...");
          const ativos = await listarAtivosPorFamilia(form.value.familia_id);
          ativosFiltrados.value = ativos;
          if (!ativos.length) {
            ativosErro.value = "Nenhum ativo encontrado para esta família.";
          }
          form.value.ativo_id = undefined;
          return; // Sucesso na segunda tentativa
        } catch (retryError) {
          console.error("Erro na segunda tentativa:", retryError);
        }
      }
    }

    ativosErro.value = isOnline.value
      ? "Erro ao buscar ativos. Tente recarregar a página."
      : "Você está offline. Conecte-se à internet para buscar ativos.";
    ativosFiltrados.value = [];
  } finally {
    ativosLoading.value = false;
    clearTimeout(timeoutAtivos);
  }
};

// Sincronizar data de solicitação com data de recebimento
watch(
  () => form.value.data_solicitacao,
  (novaData) => {
    if (novaData) {
      form.value.data_recebimento = novaData;
    }
  }
);

const adicionarInsumo = () => {
  if (!form.value.insumos) {
    form.value.insumos = [];
  }
  form.value.insumos.push({
    peca: "",
    quantidade: 1,
    requisicao: "",
    custo: 0,
  });
};

const removerInsumo = (index: number) => {
  form.value.insumos?.splice(index, 1);
};

const adicionarExecutor = () => {
  if (!form.value.executores) {
    form.value.executores = [];
  }
  if (form.value.executores.length >= 6) {
    return;
  }
  form.value.executores.push(undefined);
};

const removerExecutor = (index: number) => {
  form.value.executores?.splice(index, 1);
};

const salvarOrdem = async () => {
  // Validação do campo obrigatório NOME (recebido_por_id)
  if (!form.value.recebido_por_id) {
    showError("O campo NOME em 'Recebimento de O.S.' é obrigatório");
    return;
  }

  salvando.value = true;

  try {
    const executoresValidos =
      form.value.executores?.filter(
        (id: number | undefined): id is number => id !== undefined
      ) || [];

    if (isEditMode.value && props.ordemId) {
      // Modo edição: atualizar ordem existente
      // Filtrar apenas campos válidos para o banco
      const ordemParaAtualizar: Record<string, any> = {
        tipo_os: form.value.tipo_os,
        categoria_servico: form.value.categoria_servico,
        sintoma_defeito: form.value.sintoma_defeito || null,
        familia_id: form.value.familia_id,
        ativo_id: form.value.ativo_id,
        solicitante_id: form.value.solicitante_id,
        data_solicitacao: form.value.data_solicitacao,
        recebido_por_id: form.value.recebido_por_id || null,
        data_recebimento: form.value.data_recebimento || null,
        hora_recebimento: form.value.hora_recebimento || null,
        descricao_servico: form.value.descricao_servico || null,
        executor_id: executoresValidos[0] || null,
        insumos: form.value.insumos || [],
        observacoes: form.value.observacoes || null,
        data_inicio: form.value.data_inicio || null,
        tempo_inicio: form.value.tempo_inicio || null,
        data_fim: form.value.data_fim || null,
        tempo_fim: form.value.tempo_fim || null,
        custos_concluidos: form.value.custos_concluidos ?? false,
        custo_total: form.value.custo_total || null,
        liberado_operacao: form.value.liberado_operacao ?? false,
        data_liberacao: form.value.data_liberacao || null,
        aprovado_por: form.value.aprovado_por || null,
      };

      console.log("Dados para atualizar:", ordemParaAtualizar);

      const sucesso = await atualizarOrdem(props.ordemId, ordemParaAtualizar);
      if (sucesso) {
        success("Ordem de Serviço atualizada com sucesso!");
        router.push("/gerenciar");
      } else {
        showError("Erro ao atualizar ordem de serviço");
      }
    } else {
      // Modo criação: criar nova ordem
      const ordemParaSalvar = {
        ...form.value,
        executor_id: form.value.executores?.[0] || undefined,
        hora_recebimento: form.value.hora_recebimento || null,
        tempo_inicio: form.value.tempo_inicio || null,
        tempo_fim: form.value.tempo_fim || null,
      };
      delete ordemParaSalvar.executores;

      const ordem = await criarOrdem(
        ordemParaSalvar as OrdemServico,
        executoresValidos
      );

      if (ordem) {
        success("Ordem de Serviço criada com sucesso!");
        router.push("/gerenciar");
      }
    }
  } catch (error) {
    console.error("Erro ao salvar ordem:", error);
    showError("Erro ao salvar ordem de serviço");
  } finally {
    salvando.value = false;
  }
};

// Lifecycle
onMounted(() => {
  carregarDados();
});
</script>
