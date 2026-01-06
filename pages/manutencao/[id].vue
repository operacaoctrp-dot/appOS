<template>
  <div>
    <AppNavigation />
    <Breadcrumbs
      :items="[
        { label: 'Gerenciar OS', to: '/gerenciar' },
        { label: `OS #${ordem?.numero || id}`, to: `/visualizar/${id}` },
        { label: 'Preencher Manutenção' },
      ]"
    />

    <div
      class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8"
    >
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading -->
        <div v-if="carregando" class="text-center py-12">
          <div
            class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
          ></div>
          <p class="text-slate-600 dark:text-slate-400 mt-4">Carregando...</p>
        </div>

        <!-- Erro -->
        <div
          v-else-if="erro"
          class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center"
        >
          <svg
            class="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4"
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
          <p class="text-red-700 dark:text-red-300">{{ erro }}</p>
          <button
            @click="$router.push('/gerenciar')"
            class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Voltar
          </button>
        </div>

        <!-- Formulário -->
        <div v-else-if="ordem" class="space-y-6">
          <!-- Header -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h1
                  class="text-2xl font-bold text-slate-900 dark:text-white mb-2"
                >
                  Preencher Dados da Manutenção
                </h1>
                <p class="text-slate-600 dark:text-slate-300">
                  OS #{{ ordem.numero }} - {{ ordem.ativo?.nome }}
                </p>
              </div>
              <div class="text-right">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    !ordem.data_liberacao
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                  ]"
                >
                  {{ !ordem.data_liberacao ? "ABERTA" : "FECHADA" }}
                </span>
              </div>
            </div>

            <!-- Sintoma -->
            <div
              class="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
            >
              <label
                class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1"
              >
                Sintoma/Defeito:
              </label>
              <p class="text-sm text-slate-900 dark:text-white uppercase">
                {{ ordem.sintoma_defeito || "Não informado" }}
              </p>
            </div>
          </div>

          <!-- Mensagens -->
          <div
            v-if="mensagem"
            :class="[
              'p-4 rounded-lg flex items-start gap-3',
              mensagem.tipo === 'sucesso'
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800',
            ]"
          >
            <svg
              :class="[
                'w-5 h-5 flex-shrink-0 mt-0.5',
                mensagem.tipo === 'sucesso'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400',
              ]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                v-if="mensagem.tipo === 'sucesso'"
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
                mensagem.tipo === 'sucesso'
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-red-700 dark:text-red-300',
              ]"
            >
              {{ mensagem.texto }}
            </p>
          </div>

          <form @submit.prevent="salvar" class="space-y-6">
            <!-- Descrição do Serviço e Executor -->
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
              <div class="grid md:grid-cols-2 gap-6">
                <!-- Descrição do Serviço -->
                <div>
                  <label
                    class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    DESCRIÇÃO DO SERVIÇO:
                  </label>
                  <textarea
                    v-model="formData.descricao_servico"
                    rows="6"
                    required
                    class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                    placeholder="Descreva o serviço executado..."
                  ></textarea>
                </div>

                <!-- Executores -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <label
                      class="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      EXECUTORES:
                    </label>
                    <button
                      type="button"
                      @click="adicionarExecutor"
                      class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"
                    >
                      <span>+ incluir</span>
                    </button>
                  </div>
                  <div class="space-y-2">
                    <div
                      v-for="(exec, index) in formData.executores"
                      :key="index"
                      class="flex gap-2"
                    >
                      <select
                        v-model="formData.executores[index]"
                        :required="index === 0"
                        class="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecione um executor...</option>
                        <option
                          v-for="executor in executores"
                          :key="executor.id"
                          :value="executor.id"
                        >
                          {{ executor.nome }}
                        </option>
                      </select>
                      <button
                        v-if="formData.executores.length > 1"
                        type="button"
                        @click="removerExecutor(index)"
                        class="px-3 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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
                </div>
              </div>
            </div>

            <!-- Insumos Utilizados -->
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
              <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">
                INSUMOS UTILIZADOS
              </h2>

              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="border-b border-slate-200 dark:border-slate-700">
                      <th
                        class="text-left py-3 px-2 text-sm font-medium text-slate-700 dark:text-slate-300"
                      >
                        PEÇAS A UTILIZAR E/OU SOBRANTES
                      </th>
                      <th
                        class="text-center py-3 px-2 text-sm font-medium text-slate-700 dark:text-slate-300 w-24"
                      >
                        QUANT.
                      </th>
                      <th
                        class="text-left py-3 px-2 text-sm font-medium text-slate-700 dark:text-slate-300 w-32"
                      >
                        REQUISIÇÃO
                      </th>
                      <th
                        class="text-right py-3 px-2 text-sm font-medium text-slate-700 dark:text-slate-300 w-32"
                      >
                        CUSTO (R$)
                      </th>
                      <th class="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(insumo, index) in formData.insumos"
                      :key="index"
                      class="border-b border-slate-100 dark:border-slate-700"
                    >
                      <td class="py-2 px-2">
                        <input
                          v-model="insumo.peca"
                          type="text"
                          class="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nome da peça..."
                        />
                      </td>
                      <td class="py-2 px-2">
                        <input
                          v-model.number="insumo.quantidade"
                          type="number"
                          min="0"
                          class="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td class="py-2 px-2">
                        <input
                          v-model="insumo.requisicao"
                          type="text"
                          class="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nº requisição"
                        />
                      </td>
                      <td class="py-2 px-2">
                        <input
                          v-model.number="insumo.custo"
                          type="number"
                          min="0"
                          step="0.01"
                          class="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      </td>
                      <td class="py-2 px-2 text-center">
                        <button
                          type="button"
                          @click="removerInsumo(index)"
                          class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                @click="adicionarInsumo"
                class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <span>+ Adicionar Insumo</span>
              </button>
            </div>

            <!-- Observações e Tempo de Execução -->
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
              <div class="grid md:grid-cols-2 gap-6">
                <!-- Observações -->
                <div>
                  <label
                    class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    OBSERVAÇÕES:
                  </label>
                  <textarea
                    v-model="formData.observacoes"
                    rows="4"
                    class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Observações adicionais..."
                  ></textarea>
                </div>

                <!-- Tempo de Execução -->
                <div>
                  <label
                    class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    TEMPO DE EXECUÇÃO:
                  </label>
                  <div class="space-y-3">
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          class="block text-xs text-slate-600 dark:text-slate-400 mb-1"
                          >DATA INÍCIO:</label
                        >
                        <input
                          v-model="formData.data_inicio"
                          type="date"
                          required
                          class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label
                          class="block text-xs text-slate-600 dark:text-slate-400 mb-1"
                          >INÍCIO:</label
                        >
                        <input
                          v-model="formData.tempo_inicio"
                          type="time"
                          required
                          class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          class="block text-xs text-slate-600 dark:text-slate-400 mb-1"
                          >DATA FIM:</label
                        >
                        <input
                          v-model="formData.data_fim"
                          type="date"
                          required
                          class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label
                          class="block text-xs text-slate-600 dark:text-slate-400 mb-1"
                          >FIM:</label
                        >
                        <input
                          v-model="formData.tempo_fim"
                          type="time"
                          required
                          class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botões de Ação -->
            <div class="flex gap-4 justify-end">
              <button
                type="button"
                @click="$router.back()"
                class="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="salvando"
                class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg
                  v-if="salvando"
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
                <span>{{ salvando ? "Salvando..." : "Salvar Dados" }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrdemServicoComRelacoes } from "~/types/ordem-servico";

definePageMeta({
  middleware: "manutencao",
});

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;
const { buscarOrdem, atualizarOrdem } = useOrdemServico();
const supabase = useSupabase();
const { success, error: showError } = useNotification();
const { ensureValidSession } = useAuth();

const ordem = ref<OrdemServicoComRelacoes | null>(null);
const executores = ref<any[]>([]);
const carregando = ref(true);
const salvando = ref(false);
const erro = ref("");
const mensagem = ref<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

const formData = reactive({
  descricao_servico: "",
  executores: [""] as any[],
  insumos: [] as any[],
  observacoes: "",
  data_inicio: "",
  tempo_inicio: "",
  data_fim: "",
  tempo_fim: "",
});

// Carregar dados
const carregar = async (tentativa = 1) => {
  try {
    carregando.value = true;
    erro.value = "";

    console.log(`=== Tentativa ${tentativa} de carregar dados ===`);

    // Garantir sessão válida antes de carregar dados
    console.log("Passo 1: Verificando sessão...");
    let sessionValid = false;
    try {
      // Criar promise que resolve com timeout
      const sessionPromise = ensureValidSession();
      const timeoutPromise = new Promise<boolean>((resolve) =>
        setTimeout(() => {
          console.warn(
            "Timeout ao verificar sessão, continuando mesmo assim..."
          );
          resolve(true);
        }, 5000)
      );

      sessionValid = await Promise.race([sessionPromise, timeoutPromise]);
    } catch (sessErr) {
      console.error("Erro ao verificar sessão:", sessErr);
      sessionValid = true; // Assumir que está válido e continuar
    }

    console.log(`Sessão válida: ${sessionValid}`);

    if (!sessionValid && tentativa === 1) {
      console.warn("Sessão inválida, tentando novamente...");
      return carregar(2);
    }

    if (!sessionValid && tentativa >= 2) {
      erro.value = "Sessão expirada. Por favor, recarregue a página.";
      carregando.value = false;
      return;
    }

    console.log("Passo 2: Buscando ordem...");
    console.log("ID da rota:", id);

    // TESTE ULTRA SIMPLES - Testar se Supabase está respondendo
    console.log("=== TESTE CONEXÃO SUPABASE ===");
    console.log("Supabase URL:", supabase.supabaseUrl);
    console.log(
      "Supabase Key (primeiros 20 chars):",
      supabase.supabaseKey?.substring(0, 20) + "..."
    );

    try {
      console.time("Teste ping Supabase");
      const response = await fetch(`${supabase.supabaseUrl}/rest/v1/`, {
        headers: {
          apikey: supabase.supabaseKey || "",
          Authorization: `Bearer ${supabase.supabaseKey || ""}`,
        },
      });
      console.timeEnd("Teste ping Supabase");
      console.log("Status da resposta:", response.status);
      console.log("Supabase está respondendo!");
    } catch (pingError) {
      console.error("Erro ao pingar Supabase:", pingError);
    }

    // TESTE QUERY DIRETA
    console.log("=== TESTE QUERY DIRETA ===");

    // SOLUÇÃO: Usar FETCH direto em vez do SDK do Supabase
    console.log("Teste: Usando fetch direto (bypass SDK)...");
    console.time("Fetch direto");
    try {
      const fetchResponse = await fetch(
        `${supabase.supabaseUrl}/rest/v1/ordens_servico?id=eq.${id}&select=id,numero&limit=1`,
        {
          headers: {
            'apikey': supabase.supabaseKey || '',
            'Authorization': `Bearer ${supabase.supabaseKey || ''}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          }
        }
      );
      const fetchData = await fetchResponse.json();
      console.timeEnd("Fetch direto");
      console.log("Resultado fetch direto:", fetchData);
      console.log("Status fetch:", fetchResponse.status);
      
      if (fetchData && fetchData.length > 0) {
        console.log("✅ FETCH DIRETO FUNCIONOU!");
        // Aqui podemos usar os dados
      }
    } catch (fetchErr) {
      console.error("Erro no fetch direto:", fetchErr);
    }
    
    // Teste 1: COUNT simples (via SDK - para comparação)
    console.log("Teste 1 (SDK): Contando registros na tabela...");
        .from("ordens_servico")
        .select("*", { count: "exact", head: true });
      console.timeEnd("Count query");
      console.log("Total de registros:", count);
      console.log("Erro no count:", countError);
    } catch (countErr) {
      console.error("Exceção no count:", countErr);
    }

    // Teste 2: SELECT simples sem WHERE
    console.log("Teste 2: SELECT sem filtro (limit 1)...");
    console.time("Select sem filtro");
    try {
      const { data: dataNoFilter, error: errorNoFilter } = await supabase
        .from("ordens_servico")
        .select("id")
        .limit(1);
      console.timeEnd("Select sem filtro");
      console.log("Resultado sem filtro:", dataNoFilter);
      console.log("Erro sem filtro:", errorNoFilter);
    } catch (noFilterErr) {
      console.error("Exceção sem filtro:", noFilterErr);
    }

    // Teste 3: SELECT com WHERE
    console.log("Teste 3: SELECT com WHERE id =", id);
    console.time("Query direta Supabase");

    const { data: testDirect, error: testError } = await supabase
      .from("ordens_servico")
      .select("id, numero")
      .eq("id", Number(id))
      .limit(1);

    console.timeEnd("Query direta Supabase");

    console.timeEnd("Query direta Supabase");
    console.log("Resultado query direta:", testDirect);
    console.log("Erro query direta:", testError);

    if (testError || !testDirect || testDirect.length === 0) {
      erro.value = testError?.message || "Ordem não encontrada";
      carregando.value = false;
      return;
    }

    console.log("=== Query direta OK! Continuando... ===");

    // Buscar ordem com timeout
    let ordemData: OrdemServicoComRelacoes | null = null;
    try {
      const ordemPromise = buscarOrdem(Number(id));
      const ordemTimeoutPromise = new Promise<OrdemServicoComRelacoes | null>(
        (resolve) =>
          setTimeout(() => {
            console.warn(
              "Timeout ao buscar ordem (20s), continuando com erro..."
            );
            resolve(null);
          }, 20000)
      );

      ordemData = await Promise.race([ordemPromise, ordemTimeoutPromise]);
    } catch (ordemErr) {
      console.error("Erro ao buscar ordem:", ordemErr);
    }

    console.log("Ordem carregada:", ordemData);
    if (!ordemData) {
      erro.value = "Ordem de serviço não encontrada";
      carregando.value = false;
      return;
    }

    console.log("Passo 3: Preenchendo formulário...");
    ordem.value = ordemData;

    // Preencher formulário se já tiver dados
    if (ordemData.descricao_servico) {
      formData.descricao_servico = ordemData.descricao_servico;
      formData.executores = ordemData.executor_id
        ? [ordemData.executor_id.toString()]
        : [""];
      formData.observacoes = ordemData.observacoes || "";
      formData.data_inicio = ordemData.data_inicio || "";
      formData.tempo_inicio = ordemData.tempo_inicio || "";
      formData.data_fim = ordemData.data_fim || "";
      formData.tempo_fim = ordemData.tempo_fim || "";

      if (ordemData.insumos && ordemData.insumos.length > 0) {
        formData.insumos = [...ordemData.insumos];
      } else {
        adicionarInsumo();
      }
    } else {
      adicionarInsumo();
    }

    // Buscar executores (apenas funcionários da manutenção)
    console.log("Passo 4: Carregando executores...");
    try {
      const { data: execData, error: execError } = await supabase
        .from("funcionarios")
        .select("*")
        .or(
          "funcao.ilike.%manutenção%,funcao.ilike.%manutencao%,funcao.ilike.%auxiliar%,funcao.ilike.%mecânico%,funcao.ilike.%mecanico%,funcao.ilike.%eletricista%"
        )
        .order("nome");

      if (execError) {
        console.warn("Erro ao carregar executores:", execError);
      }

      if (execData) {
        console.log("Executores carregados:", execData.length);
        executores.value = execData;
      }
    } catch (execErr) {
      console.error("Exceção ao carregar executores:", execErr);
      // Continuar mesmo sem executores
    }

    console.log("=== Carregamento completado com sucesso ===");
  } catch (error) {
    console.error("Erro ao carregar:", error);

    // Se é a primeira tentativa, tentar novamente
    if (tentativa === 1) {
      console.log("Erro ao carregar, tentando novamente...");
      return carregar(2);
    }

    erro.value = "Erro ao carregar dados";
  } finally {
    carregando.value = false;
  }
};

const adicionarInsumo = () => {
  formData.insumos.push({
    peca: "",
    quantidade: 1,
    requisicao: "",
    custo: 0,
  });
};

const removerInsumo = (index: number) => {
  formData.insumos.splice(index, 1);
};

const adicionarExecutor = () => {
  formData.executores.push("");
};

const removerExecutor = (index: number) => {
  formData.executores.splice(index, 1);
};

const salvar = async () => {
  try {
    salvando.value = true;
    mensagem.value = null;

    // Validação de datas/horas
    if (formData.data_inicio && formData.data_fim) {
      const dataInicio = new Date(
        formData.data_inicio + "T" + (formData.tempo_inicio || "00:00")
      );
      const dataFim = new Date(
        formData.data_fim + "T" + (formData.tempo_fim || "00:00")
      );
      if (dataFim < dataInicio) {
        mensagem.value = {
          tipo: "erro",
          texto:
            "A data/hora de fim não pode ser menor que a data/hora de início.",
        };
        salvando.value = false;
        showError(
          "A data/hora de fim não pode ser menor que a data/hora de início."
        );
        return;
      }
    }

    // Filtrar insumos vazios
    const insumosValidos = formData.insumos.filter((i) => i.peca.trim() !== "");

    // Pegar primeiro executor válido
    const primeiroExecutor = formData.executores.find((id) => id !== "");

    const updates = {
      descricao_servico: formData.descricao_servico,
      executor_id: primeiroExecutor ? Number(primeiroExecutor) : undefined,
      insumos: insumosValidos,
      observacoes: formData.observacoes,
      data_inicio: formData.data_inicio,
      tempo_inicio: formData.tempo_inicio,
      data_fim: formData.data_fim,
      tempo_fim: formData.tempo_fim,
      dados_manutencao_preenchidos: true,
    };

    console.log("Salvando ordem de serviço...", updates);
    const sucesso = await atualizarOrdem(Number(id), updates);
    console.log("Resultado da atualização:", sucesso);

    if (!sucesso) {
      throw new Error("Falha ao atualizar ordem de serviço");
    }

    // Salvar executores na tabela de relacionamento
    const executoresValidos = formData.executores.filter((id) => id !== "");
    console.log("Executores válidos:", executoresValidos);

    if (executoresValidos.length > 0) {
      console.log("Salvando executores...", executoresValidos);

      // Primeiro, deletar executores existentes
      console.log("Deletando executores antigos...");
      const { error: deleteError } = await supabase
        .from("ordem_servico_executores")
        .delete()
        .eq("ordem_servico_id", Number(id));

      if (deleteError) {
        console.error("Erro ao deletar executores:", deleteError);
        // Não lançar erro, apenas logar - pode ser que não existam executores
      }

      // Depois, inserir os novos executores
      console.log("Inserindo novos executores...");
      const executoresData = executoresValidos.map((funcionario_id, index) => ({
        ordem_servico_id: Number(id),
        funcionario_id: Number(funcionario_id),
        ordem: index + 1,
      }));

      const { error: insertError } = await supabase
        .from("ordem_servico_executores")
        .insert(executoresData);

      if (insertError) {
        console.error("Erro ao inserir executores:", insertError);
        // Não lançar erro - ordem já foi salva
      }

      console.log("Executores salvos!");
    }

    console.log("Dados salvos com sucesso! Preparando redirecionamento...");

    // Exibir toast de sucesso ANTES de definir mensagem
    success("Dados salvos com sucesso!");

    mensagem.value = {
      tipo: "sucesso",
      texto: "Dados salvos com sucesso! Redirecionando...",
    };

    // Atualizar ordem local
    if (ordem.value) {
      Object.assign(ordem.value, updates);
    }

    console.log("Redirecionando em 800ms...");
    // Redirecionar para gerenciar após um tempo menor
    setTimeout(() => {
      console.log("Redirecionando agora...");
      router.push("/gerenciar");
    }, 800);
  } catch (error: any) {
    console.error("Erro ao salvar:", error);

    let mensagemErro = "Erro ao salvar dados.";
    if (error?.message) {
      mensagemErro += ` ${error.message}`;
    }

    mensagem.value = {
      tipo: "erro",
      texto: mensagemErro,
    };

    // Exibir toast de erro
    showError(mensagemErro);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } finally {
    salvando.value = false;
  }
};

onMounted(() => {
  carregar();
});

useHead({
  title: `Manutenção OS #${id} - appOS`,
});
</script>
