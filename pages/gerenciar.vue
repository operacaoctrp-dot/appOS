<template>
  <div>
    <AppNavigation />
    <Breadcrumbs :items="[{ label: 'Gerenciar Ordens de Serviço' }]" />
    <div
      class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8"
    >
      <!-- Filters -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
          <!-- Filtros de Status -->
          <div class="flex flex-wrap gap-4 items-start mb-6">
            <div class="flex-1 min-w-[200px]">
              <label
                class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >Filtrar por Status</label
              >
              <div class="flex gap-2">
                <button
                  @click="filtroStatus = 'todas'"
                  :class="[
                    'px-4 py-2 rounded-lg font-medium transition',
                    filtroStatus === 'todas'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600',
                  ]"
                >
                  Todas ({{ ordensTotal }})
                </button>
                <button
                  @click="filtroStatus = 'abertas'"
                  :class="[
                    'px-4 py-2 rounded-lg font-medium transition',
                    filtroStatus === 'abertas'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600',
                  ]"
                >
                  Abertas ({{ ordensAbertas.length }})
                </button>
                <button
                  @click="filtroStatus = 'fechadas'"
                  :class="[
                    'px-4 py-2 rounded-lg font-medium transition',
                    filtroStatus === 'fechadas'
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600',
                  ]"
                >
                  Fechadas ({{ ordensFechadas.length }})
                </button>
              </div>
            </div>

            <!-- Filtro de Status de Manutenção -->
            <div class="flex-1 min-w-[200px]">
              <label
                class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >Status Manutenção</label
              >
              <div class="flex gap-2">
                <button
                  @click="filtroManutencao = 'todas'"
                  :class="[
                    'px-3 py-2 rounded-lg font-medium transition text-sm',
                    filtroManutencao === 'todas'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600',
                  ]"
                >
                  Todas
                </button>
                <button
                  @click="filtroManutencao = 'aguardando'"
                  :class="[
                    'px-3 py-2 rounded-lg font-medium transition text-sm',
                    filtroManutencao === 'aguardando'
                      ? 'bg-slate-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600',
                  ]"
                >
                  ⏳ Aguardando ({{ ordensAguardandoManutencao }})
                </button>
                <button
                  @click="filtroManutencao = 'preenchida'"
                  :class="[
                    'px-3 py-2 rounded-lg font-medium transition text-sm',
                    filtroManutencao === 'preenchida'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600',
                  ]"
                >
                  ✓ Preenchida ({{ ordensManutencaoPreenchida }})
                </button>
              </div>
            </div>

            <div class="flex-1 min-w-[200px]">
              <label
                class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >Buscar</label
              >
              <div class="relative">
                <input
                  v-model="busca"
                  type="text"
                  placeholder="Número ou sintoma/defeito..."
                  class="w-full px-4 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
                <div
                  v-if="buscando"
                  class="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <div
                    class="h-5 w-5 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Filtros Avançados -->
          <div class="border-t pt-4">
            <div class="flex items-center justify-between mb-4">
              <button
                @click="mostrarFiltrosAvancados = !mostrarFiltrosAvancados"
                class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium"
              >
                <span>{{ mostrarFiltrosAvancados ? "▼" : "▶" }}</span>
                Filtros Avançados
              </button>

              <button
                @click="exportarParaExcel"
                class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition font-medium"
              >
                <span>📊</span>
                Exportar para Excel
              </button>
            </div>

            <div
              v-if="mostrarFiltrosAvancados"
              class="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <!-- Filtro por Tipo -->
              <div>
                <label
                  class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >Tipo de OS</label
                >
                <select
                  v-model="filtroTipo"
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="">Todos</option>
                  <option value="PREVENTIVA">Preventiva</option>
                  <option value="CORRETIVA">Corretiva</option>
                </select>
              </div>

              <!-- Filtro por Categoria -->
              <div>
                <label
                  class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >Categoria</label
                >
                <select
                  v-model="filtroCategoria"
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="">Todas</option>
                  <option value="MECÂNICO">Mecânico</option>
                  <option value="ELÉTRICO">Elétrico</option>
                  <option value="HIDRÁULICO">Hidráulico</option>
                  <option value="MANUTENÇÃO PREDIAL">Manutenção Predial</option>
                  <option value="SOLDA">Solda</option>
                  <option value="OUTROS">Outros</option>
                </select>
              </div>

              <!-- Filtro por Data Início -->
              <div>
                <label
                  class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >Data Início</label
                >
                <input
                  v-model="filtroDataInicio"
                  type="date"
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <!-- Filtro por Data Fim -->
              <div>
                <label
                  class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >Data Fim</label
                >
                <input
                  v-model="filtroDataFim"
                  type="date"
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <!-- Botão Limpar Filtros -->
            <div v-if="mostrarFiltrosAvancados" class="mt-4 flex justify-end">
              <button
                @click="limparFiltrosAvancados"
                class="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        <!-- Loading Skeleton -->
        <SkeletonLoader v-if="carregando" :count="5" />

        <!-- Lista de Ordens -->
        <div v-else class="space-y-4">
          <div
            v-for="ordem in ordensFiltradas"
            :key="ordem.id"
            class="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition p-4 md:p-6"
          >
            <div
              class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
            >
              <div class="flex-1">
                <div class="flex flex-row items-center gap-3 mb-3">
                  <div class="flex flex-row items-center gap-2">
                    <div
                      :class="[
                        'flex flex-col items-center justify-center rounded-full font-bold',
                        ordem.data_liberacao
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800',
                        'w-14 h-14 text-xl',
                      ]"
                    >
                      <span class="text-xs font-normal">Nº</span>
                      <span class="leading-none text-2xl">{{
                        ordem.numero
                      }}</span>
                    </div>
                  </div>
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-semibold',
                      ordem.data_liberacao
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800',
                    ]"
                  >
                    {{ ordem.data_liberacao ? "FECHADA" : "ABERTA" }}
                  </span>
                  <!-- Status de Manutenção -->
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1',
                      ordem.dados_manutencao_preenchidos
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600',
                    ]"
                  >
                    <svg
                      v-if="ordem.dados_manutencao_preenchidos"
                      class="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <svg
                      v-else
                      class="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    {{
                      ordem.dados_manutencao_preenchidos
                        ? "MANUTENÇÃO OK"
                        : "AGUARDANDO MANUT."
                    }}
                  </span>
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-semibold',
                      ordem.tipo_os === 'PREVENTIVA'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800',
                    ]"
                  >
                    {{ ordem.tipo_os }}
                  </span>
                </div>

                <div
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  <div>
                    <p
                      class="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium"
                    >
                      Solicitante
                    </p>
                    <p
                      class="text-sm font-medium text-slate-800 dark:text-slate-200"
                    >
                      {{ ordem.solicitante?.nome || "—" }}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium"
                    >
                      Data de Solicitação
                    </p>
                    <p
                      class="text-sm font-medium text-slate-800 dark:text-slate-200"
                    >
                      {{ formatarData(ordem.data_solicitacao) }}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium"
                    >
                      Família / Ativo
                    </p>
                    <p
                      class="text-sm font-medium text-slate-800 dark:text-slate-200"
                    >
                      {{ ordem.familia?.familia || "—" }} /
                      {{ ordem.ativo?.nome || "—" }}
                    </p>
                  </div>
                  <div class="lg:col-span-3">
                    <p
                      class="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium"
                    >
                      Sintoma/Defeito
                    </p>
                    <p
                      class="text-sm text-slate-700 dark:text-slate-300 uppercase"
                    >
                      {{ ordem.sintoma_defeito || "—" }}
                    </p>
                  </div>
                  <div v-if="ordem.data_liberacao" class="lg:col-span-3">
                    <p
                      class="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium"
                    >
                      Fechamento
                    </p>
                    <p class="text-sm text-slate-700 dark:text-slate-300">
                      Data: {{ formatarData(ordem.data_liberacao) }} | Liberado:
                      {{ ordem.liberado_operacao ? "SIM" : "NÃO" }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-2 ml-4">
                <NuxtLink
                  v-if="ordem.data_liberacao"
                  :to="`/visualizar/${ordem.id}`"
                  class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition text-center whitespace-nowrap"
                >
                  📄 Visualizar
                </NuxtLink>
                <NuxtLink
                  :to="`/editar/${ordem.id}`"
                  class="px-4 py-2 bg-slate-600 text-white text-sm rounded-lg hover:bg-slate-700 transition text-center whitespace-nowrap"
                >
                  ✏️ Editar
                </NuxtLink>
                <NuxtLink
                  v-if="!ordem.data_liberacao && isManutencao"
                  :to="`/manutencao/${ordem.id}`"
                  class="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition text-center whitespace-nowrap"
                >
                  🔧 Manutenção
                </NuxtLink>
                <button
                  v-if="!ordem.data_liberacao"
                  @click="abrirModalFechar(ordem)"
                  class="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition whitespace-nowrap"
                >
                  ✓ Fechar OS
                </button>
                <button
                  v-else-if="isAdmin"
                  @click="reabrirOrdem(ordem)"
                  class="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition whitespace-nowrap"
                >
                  ↺ Reabrir
                </button>
                <button
                  v-if="isAdmin"
                  @click="excluirOrdem(ordem)"
                  class="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition whitespace-nowrap"
                >
                  🗑️ Excluir
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-if="ordensFiltradas.length === 0"
            class="text-center py-12 bg-white dark:bg-slate-800 rounded-xl"
          >
            <p class="text-slate-500 dark:text-slate-400 text-lg">
              Nenhuma ordem encontrada com os filtros aplicados
            </p>
          </div>

          <!-- Paginação -->
          <div
            v-if="totalPaginas > 1 && ordensFiltradas.length > 0"
            class="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mt-6"
          >
            <div class="text-sm text-slate-600 dark:text-slate-400">
              Mostrando
              <span class="font-medium">{{
                (paginaAtual - 1) * itensPorPagina + 1
              }}</span>
              a
              <span class="font-medium">{{
                Math.min(paginaAtual * itensPorPagina, totalRegistros)
              }}</span>
              de
              <span class="font-medium">{{ totalRegistros }}</span>
              resultados
            </div>

            <div class="flex gap-2">
              <!-- Primeira página -->
              <button
                @click="irParaPagina(1)"
                :disabled="paginaAtual === 1"
                class="px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-white"
                title="Primeira página"
              >
                «
              </button>

              <!-- Página anterior -->
              <button
                @click="irParaPagina(paginaAtual - 1)"
                :disabled="paginaAtual === 1"
                class="px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-white"
                title="Página anterior"
              >
                ‹
              </button>

              <!-- Números das páginas -->
              <button
                v-for="pagina in paginasVisiveis"
                :key="pagina"
                @click="irParaPagina(pagina)"
                :class="[
                  'px-4 py-2 text-sm rounded-lg border transition',
                  pagina === paginaAtual
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-white',
                ]"
              >
                {{ pagina }}
              </button>

              <!-- Próxima página -->
              <button
                @click="irParaPagina(paginaAtual + 1)"
                :disabled="paginaAtual === totalPaginas"
                class="px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-white"
                title="Próxima página"
              >
                ›
              </button>

              <!-- Última página -->
              <button
                @click="irParaPagina(totalPaginas)"
                :disabled="paginaAtual === totalPaginas"
                class="px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-white"
                title="Última página"
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Fechar OS -->
      <Teleport to="body">
        <div
          v-if="modalFechar"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          @click.self="fecharModal"
        >
          <div
            class="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl"
          >
            <h3 class="text-2xl font-bold text-slate-800 dark:text-white mb-4">
              Fechar Ordem de Serviço #{{ ordemSelecionada?.numero }}
            </h3>

            <form @submit.prevent="confirmarFechamento">
              <div class="space-y-4">
                <div>
                  <label
                    class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >Data de Liberação *</label
                  >
                  <input
                    v-model="formFechamento.data_liberacao"
                    type="date"
                    required
                    class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >Liberado para Operação? *</label
                  >
                  <div class="flex gap-4">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        v-model="formFechamento.liberado_operacao"
                        type="radio"
                        :value="true"
                        required
                        class="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <span
                        class="text-sm font-medium text-slate-700 dark:text-slate-300"
                        >SIM</span
                      >
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        v-model="formFechamento.liberado_operacao"
                        type="radio"
                        :value="false"
                        required
                        class="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <span
                        class="text-sm font-medium text-slate-700 dark:text-slate-300"
                        >NÃO</span
                      >
                    </label>
                  </div>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >Aprovado por *</label
                  >
                  <SearchableSelect
                    v-model="formFechamento.aprovado_por"
                    :options="solicitantesOptions"
                    placeholder="Selecione o responsável"
                    required
                  />
                </div>
              </div>

              <div class="flex gap-3 mt-6">
                <button
                  type="button"
                  @click="fecharModal"
                  class="flex-1 px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="salvando"
                  class="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
                >
                  {{ salvando ? "Fechando..." : "Confirmar Fechamento" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrdemServicoComRelacoes } from "~/types/ordem-servico";

definePageMeta({
  middleware: "auth",
});

const {
  listarOrdensPaginado,
  atualizarOrdem,
  deletarOrdem,
  listarSolicitantes,
} = useOrdemServico();
const { confirm: modalConfirm } = useModal();
const { success, error: showError } = useNotification();
const { isManutencao, isAdmin, refreshSession } = useAuth();

const ordens = ref<OrdemServicoComRelacoes[]>([]);
const solicitantes = ref<any[]>([]);
const carregando = ref(true);
const buscando = ref(false);
const filtroStatus = ref<"todas" | "abertas" | "fechadas">("todas");
const filtroManutencao = ref<"todas" | "aguardando" | "preenchida">("todas");
const busca = ref("");
const modalFechar = ref(false);
const ordemSelecionada = ref<OrdemServicoComRelacoes | null>(null);
const salvando = ref(false);

// Filtros avançados
const mostrarFiltrosAvancados = ref(false);
const filtroTipo = ref("");
const filtroCategoria = ref("");
const filtroDataInicio = ref("");
const filtroDataFim = ref("");

// Paginação
const paginaAtual = ref(1);
const itensPorPagina = ref(20);
const totalRegistros = ref(0);
const totalPaginas = ref(0);

const formFechamento = ref({
  data_liberacao: new Date().toISOString().split("T")[0],
  liberado_operacao: null as boolean | null,
  aprovado_por: undefined as number | undefined,
});

const solicitantesOptions = computed(() =>
  solicitantes.value.map((s) => ({ value: s.id, label: s.nome }))
);

// Ordensfiltradas - aplica filtro de manutenção localmente
const ordensFiltradas = computed(() => {
  let resultado = ordens.value;

  // Aplicar filtro de manutenção (apenas OS abertas)
  if (filtroManutencao.value === "aguardando") {
    // OS abertas sem dados de manutenção
    resultado = resultado.filter(
      (o) => !o.data_liberacao && !o.dados_manutencao_preenchidos
    );
  } else if (filtroManutencao.value === "preenchida") {
    // OS abertas COM dados de manutenção (prontas para fechar)
    resultado = resultado.filter(
      (o) => !o.data_liberacao && o.dados_manutencao_preenchidos
    );
  }

  return resultado;
});

// Contadores para badges dos botões de filtro
const contadorAbertas = ref(0);
const contadorFechadas = ref(0);

const ordensAbertas = computed(() =>
  ordens.value.filter((o) => !o.data_liberacao)
);
const ordensFechadas = computed(() =>
  ordens.value.filter((o) => o.data_liberacao)
);
const ordensTotal = computed(() => totalRegistros.value);

// Contadores de status de manutenção
// Aguardando: OS abertas sem dados de manutenção preenchidos
const ordensAguardandoManutencao = computed(
  () =>
    ordens.value.filter(
      (o) => !o.data_liberacao && !o.dados_manutencao_preenchidos
    ).length
);
// Preenchida: OS abertas COM dados de manutenção preenchidos (prontas para fechar)
const ordensManutencaoPreenchida = computed(
  () =>
    ordens.value.filter(
      (o) => !o.data_liberacao && o.dados_manutencao_preenchidos
    ).length
);

const formatarData = (data: string | undefined) => {
  if (!data) return "—";
  const d = new Date(data + "T00:00:00");
  return d.toLocaleDateString("pt-BR");
};

const irParaPagina = async (pagina: number) => {
  if (pagina < 1 || pagina > totalPaginas.value) return;
  paginaAtual.value = pagina;
  await carregarOrdens();
};

const paginasVisiveis = computed(() => {
  const paginas: number[] = [];
  const maxVisiveis = 5;
  let inicio = Math.max(1, paginaAtual.value - Math.floor(maxVisiveis / 2));
  let fim = Math.min(totalPaginas.value, inicio + maxVisiveis - 1);

  if (fim - inicio < maxVisiveis - 1) {
    inicio = Math.max(1, fim - maxVisiveis + 1);
  }

  for (let i = inicio; i <= fim; i++) {
    paginas.push(i);
  }

  return paginas;
});

// Debounce para busca
let searchTimeout: NodeJS.Timeout;
const debouncedSearch = (value: string) => {
  buscando.value = true;
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    paginaAtual.value = 1;
    await carregarOrdens();
    buscando.value = false;
  }, 500); // 500ms de debounce
};

// Watch para resetar página quando filtros mudarem
watch(filtroStatus, () => {
  paginaAtual.value = 1;
  carregarOrdens();
});

watch(busca, (newValue) => {
  debouncedSearch(newValue);
});

watch([filtroTipo, filtroCategoria, filtroDataInicio, filtroDataFim], () => {
  paginaAtual.value = 1;
  carregarOrdens();
});

const limparFiltrosAvancados = () => {
  filtroTipo.value = "";
  filtroCategoria.value = "";
  filtroDataInicio.value = "";
  filtroDataFim.value = "";
};

const abrirModalFechar = (ordem: OrdemServicoComRelacoes) => {
  ordemSelecionada.value = ordem;
  formFechamento.value = {
    data_liberacao: new Date().toISOString().split("T")[0],
    liberado_operacao: null,
    aprovado_por: undefined,
  };
  modalFechar.value = true;
};

const fecharModal = () => {
  modalFechar.value = false;
  ordemSelecionada.value = null;
};

const confirmarFechamento = async () => {
  if (!ordemSelecionada.value) return;

  // Validar se os dados de manutenção foram preenchidos
  if (!ordemSelecionada.value.dados_manutencao_preenchidos) {
    showError(
      "⚠️ Os dados de manutenção precisam ser preenchidos antes de fechar a OS. Clique no botão 'Manutenção' para preencher."
    );
    return;
  }

  salvando.value = true;
  try {
    await atualizarOrdem(ordemSelecionada.value.id!, {
      data_liberacao: formFechamento.value.data_liberacao,
      liberado_operacao: formFechamento.value.liberado_operacao!,
      aprovado_por: formFechamento.value.aprovado_por,
    });

    success(
      `Ordem de Serviço #${ordemSelecionada.value.numero} fechada com sucesso!`
    );
    fecharModal();
    await carregarOrdens();
  } catch (error) {
    showError("Erro ao fechar ordem de serviço");
    console.error(error);
  } finally {
    salvando.value = false;
  }
};

const reabrirOrdem = async (ordem: OrdemServicoComRelacoes) => {
  const confirmado = await modalConfirm(
    `Deseja reabrir a Ordem de Serviço #${ordem.numero}? Os dados de fechamento serão removidos.`
  );

  if (!confirmado) return;

  try {
    const resultado = await atualizarOrdem(ordem.id!, {
      data_liberacao: null,
      liberado_operacao: false,
      aprovado_por: null,
      custos_concluidos: false,
    });

    if (resultado) {
      success(`Ordem de Serviço #${ordem.numero} reaberta com sucesso!`);
      await carregarOrdens();
    } else {
      showError("Erro ao reabrir ordem de serviço");
    }
  } catch (error) {
    showError("Erro ao reabrir ordem de serviço");
    console.error("Erro ao reabrir:", error);
  }
};

const excluirOrdem = async (ordem: OrdemServicoComRelacoes) => {
  const confirmado = await modalConfirm(
    `⚠️ ATENÇÃO: Deseja realmente excluir a Ordem de Serviço #${ordem.numero}?\n\nEsta ação não pode ser desfeita!`
  );

  if (!confirmado) return;

  try {
    const sucesso = await deletarOrdem(ordem.id!);

    if (sucesso) {
      success(`Ordem de Serviço #${ordem.numero} excluída com sucesso!`);
      await carregarOrdens();
    } else {
      showError("Erro ao excluir ordem de serviço");
    }
  } catch (error) {
    showError("Erro ao excluir ordem de serviço");
    console.error(error);
  }
};

const carregarOrdens = async (tentativa = 1) => {
  carregando.value = true;

  // Timeout de 15 segundos
  const timeoutId = setTimeout(() => {
    if (carregando.value) {
      console.warn("Timeout ao carregar ordens");
      carregando.value = false;
      showError("Tempo excedido ao carregar. Tente novamente.");
    }
  }, 15000);

  try {
    const statusFiltro =
      filtroStatus.value === "todas"
        ? undefined
        : filtroStatus.value === "abertas"
        ? "aberta"
        : "fechada";

    const resultado = await listarOrdensPaginado(
      paginaAtual.value,
      itensPorPagina.value,
      statusFiltro,
      busca.value.trim() || undefined,
      filtroTipo.value || undefined,
      filtroCategoria.value || undefined,
      filtroDataInicio.value || undefined,
      filtroDataFim.value || undefined
    );

    ordens.value = resultado.data;
    totalRegistros.value = resultado.totalCount;
    totalPaginas.value = resultado.totalPages;
  } catch (error) {
    console.error("Erro ao carregar ordens:", error);

    // Se é a primeira tentativa, tentar renovar sessão e carregar novamente
    if (tentativa === 1) {
      console.log("Tentando renovar sessão...");
      const renewed = await refreshSession();
      if (renewed) {
        console.log("Sessão renovada, tentando novamente...");
        clearTimeout(timeoutId);
        return carregarOrdens(2);
      }
    }

    showError("Erro ao carregar ordens. Tente recarregar a página.");
  } finally {
    clearTimeout(timeoutId);
    carregando.value = false;
  }
};

const carregarSolicitantes = async () => {
  try {
    solicitantes.value = await listarSolicitantes();
  } catch (error) {
    console.error("Erro ao carregar solicitantes:", error);
  }
};

const exportarParaExcel = async () => {
  try {
    const XLSX = await import("xlsx");

    // Preparar dados para exportação
    const dadosExport = ordensFiltradas.value.map((ordem) => ({
      Número: ordem.numero,
      Tipo: ordem.tipo_os || "",
      Categoria: ordem.categoria_servico || "",
      Sintoma: ordem.sintoma_defeito ? ordem.sintoma_defeito.toUpperCase() : "",
      Família: ordem.familia
        ? `${ordem.familia.codigo} - ${ordem.familia.familia}`
        : "",
      Ativo: ordem.ativo ? `${ordem.ativo.codigo} - ${ordem.ativo.nome}` : "",
      Solicitante: ordem.solicitante?.nome || "",
      Data: ordem.data_solicitacao
        ? new Date(ordem.data_solicitacao).toLocaleDateString("pt-BR")
        : "",
      "Recebido por": ordem.recebido_por?.nome || "",
      Função: ordem.recebido_por?.funcao || "",
      Hora: ordem.hora_recebimento || "",
    }));

    // Criar workbook e worksheet
    const ws = XLSX.utils.json_to_sheet(dadosExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ordens de Serviço");

    // Ajustar larguras das colunas
    const colWidths = [
      { wch: 8 }, // Número
      { wch: 12 }, // Data Abertura
      { wch: 10 }, // Status
      { wch: 12 }, // Tipo
      { wch: 18 }, // Categoria
      { wch: 20 }, // Família
      { wch: 25 }, // Ativo
      { wch: 25 }, // Solicitante
      { wch: 40 }, // Sintoma/Defeito
      { wch: 20 }, // Executor
      { wch: 20 }, // Recebido por
      { wch: 12 }, // Data Fechamento
      { wch: 15 }, // Liberado Operação
    ];
    ws["!cols"] = colWidths;

    // Gerar nome do arquivo com data atual
    const dataAtual = new Date().toISOString().split("T")[0];
    const nomeArquivo = `OS_${filtroStatus.value}_${dataAtual}.xlsx`;

    // Download
    XLSX.writeFile(wb, nomeArquivo);

    success(`Exportadas ${dadosExport.length} ordens de serviço para Excel`);
  } catch (error) {
    console.error("Erro ao exportar:", error);
    showError("Erro ao exportar dados para Excel");
  }
};

onMounted(() => {
  carregarOrdens();
  carregarSolicitantes();
});
</script>
