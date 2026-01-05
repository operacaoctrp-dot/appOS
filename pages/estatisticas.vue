<template>
  <div>
    <AppNavigation />
    <Breadcrumbs :items="[{ label: 'Estatísticas e Relatórios' }]" />
    <div
      class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📊 Estatísticas e Análises
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Visão geral e insights sobre as Ordens de Serviço
          </p>
        </div>

        <!-- Loading State -->
        <div
          v-if="carregando || erroCarregamento || !isOnline"
          class="text-center py-12"
        >
          <div
            v-if="carregando && !erroCarregamento && isOnline"
            class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"
          ></div>
          <p
            v-if="carregando && !erroCarregamento && isOnline"
            class="text-gray-600 dark:text-gray-400 mt-4"
          >
            Carregando estatísticas...
          </p>
          <div
            v-if="erroCarregamento && isOnline"
            class="text-red-600 dark:text-red-400 mt-4"
          >
            Erro ao carregar estatísticas. Tente novamente mais tarde.<br />
            <button
              @click="tentarNovamente"
              class="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Tentar novamente
            </button>
          </div>
          <div
            v-if="!isOnline"
            class="text-yellow-600 dark:text-yellow-400 mt-4"
          >
            Você está offline. Conecte-se à internet para visualizar as
            estatísticas.
          </div>
        </div>

        <div v-else>
          <!-- Cards de Resumo -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <!-- Total de OS -->
            <div
              class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-blue-100 text-sm font-medium uppercase">
                    Total de OS
                  </p>
                  <p class="text-4xl font-bold mt-2">{{ stats.total }}</p>
                </div>
                <div
                  class="bg-white bg-opacity-20 rounded-full p-4 backdrop-blur-sm"
                >
                  <svg
                    class="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <!-- OS Abertas -->
            <div
              class="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-amber-100 text-sm font-medium uppercase">
                    Abertas
                  </p>
                  <p class="text-4xl font-bold mt-2">{{ stats.abertas }}</p>
                  <p class="text-sm text-amber-100 mt-1">
                    {{ percentual(stats.abertas, stats.total) }}%
                  </p>
                </div>
                <div
                  class="bg-white bg-opacity-20 rounded-full p-4 backdrop-blur-sm"
                >
                  <svg
                    class="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <!-- OS Fechadas -->
            <div
              class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-green-100 text-sm font-medium uppercase">
                    Fechadas
                  </p>
                  <p class="text-4xl font-bold mt-2">{{ stats.fechadas }}</p>
                  <p class="text-sm text-green-100 mt-1">
                    {{ percentual(stats.fechadas, stats.total) }}%
                  </p>
                </div>
                <div
                  class="bg-white bg-opacity-20 rounded-full p-4 backdrop-blur-sm"
                >
                  <svg
                    class="w-8 h-8"
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
                </div>
              </div>
            </div>

            <!-- Taxa de Conclusão -->
            <div
              class="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-purple-100 text-sm font-medium uppercase">
                    Taxa de Conclusão
                  </p>
                  <p class="text-4xl font-bold mt-2">
                    {{ percentual(stats.fechadas, stats.total) }}%
                  </p>
                  <p class="text-sm text-purple-100 mt-1">
                    {{ stats.fechadas }} de {{ stats.total }}
                  </p>
                </div>
                <div
                  class="bg-white bg-opacity-20 rounded-full p-4 backdrop-blur-sm"
                >
                  <svg
                    class="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- ⏱️ ESTATÍSTICAS DE TEMPO -->
          <div class="mb-8">
            <h2
              class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center"
            >
              <span class="text-3xl mr-3">⏱️</span>
              Análise de Tempo
            </h2>

            <!-- Cards de Tempo -->
            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
            >
              <!-- Tempo Médio de Execução -->
              <div
                class="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-cyan-100 text-sm font-medium uppercase">
                      Tempo Médio Execução
                    </p>
                    <p class="text-3xl font-bold mt-2">
                      {{ tempoStats.tempoMedioExecucao }}
                    </p>
                    <p class="text-sm text-cyan-100 mt-1">
                      {{ tempoStats.osComTempoExecucao }} OS analisadas
                    </p>
                  </div>
                  <div
                    class="bg-white bg-opacity-20 rounded-full p-4 backdrop-blur-sm"
                  >
                    <svg
                      class="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Tempo Médio de Resposta -->
              <div
                class="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-violet-100 text-sm font-medium uppercase">
                      Tempo Médio Resposta
                    </p>
                    <p class="text-3xl font-bold mt-2">
                      {{ tempoStats.tempoMedioResposta }}
                    </p>
                    <p class="text-sm text-violet-100 mt-1">
                      Solicitação → Recebimento
                    </p>
                  </div>
                  <div
                    class="bg-white bg-opacity-20 rounded-full p-4 backdrop-blur-sm"
                  >
                    <svg
                      class="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- OS Mais Rápida -->
              <div
                class="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-emerald-100 text-sm font-medium uppercase">
                      OS Mais Rápida
                    </p>
                    <p class="text-3xl font-bold mt-2">
                      {{ tempoStats.osMaisRapida.tempo }}
                    </p>
                    <p class="text-sm text-emerald-100 mt-1">
                      OS #{{ tempoStats.osMaisRapida.numero }}
                    </p>
                  </div>
                  <div
                    class="bg-white bg-opacity-20 rounded-full p-4 backdrop-blur-sm"
                  >
                    <svg
                      class="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- OS Mais Demorada -->
              <div
                class="bg-gradient-to-br from-rose-500 to-red-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-rose-100 text-sm font-medium uppercase">
                      OS Mais Demorada
                    </p>
                    <p class="text-3xl font-bold mt-2">
                      {{ tempoStats.osMaisDemorada.tempo }}
                    </p>
                    <p class="text-sm text-rose-100 mt-1">
                      OS #{{ tempoStats.osMaisDemorada.numero }}
                    </p>
                  </div>
                  <div
                    class="bg-white bg-opacity-20 rounded-full p-4 backdrop-blur-sm"
                  >
                    <svg
                      class="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Gráficos de Tempo -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Distribuição por Faixa de Tempo -->
              <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3
                  class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center"
                >
                  <span class="text-2xl mr-2">📊</span>
                  Distribuição por Tempo de Execução
                </h3>
                <div class="space-y-3">
                  <div
                    v-for="faixa in tempoStats.distribuicaoTempo"
                    :key="faixa.label"
                    class="flex items-center"
                  >
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-1">
                        <span
                          class="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >{{ faixa.label }}</span
                        >
                        <span
                          class="text-sm font-bold text-gray-900 dark:text-white"
                          >{{ faixa.count }} OS</span
                        >
                      </div>
                      <div
                        class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3"
                      >
                        <div
                          :class="faixa.color"
                          class="h-3 rounded-full transition-all duration-500"
                          :style="{
                            width:
                              (tempoStats.osComTempoExecucao > 0
                                ? (faixa.count /
                                    tempoStats.osComTempoExecucao) *
                                  100
                                : 0) + '%',
                          }"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="tempoStats.osComTempoExecucao === 0"
                    class="text-center text-gray-500 dark:text-gray-400 py-4"
                  >
                    Nenhuma OS com tempo de execução registrado
                  </div>
                </div>
              </div>

              <!-- Tempo Médio por Categoria -->
              <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3
                  class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center"
                >
                  <span class="text-2xl mr-2">🏷️</span>
                  Tempo Médio por Categoria
                </h3>
                <div class="space-y-3">
                  <div
                    v-for="(cat, index) in tempoStats.tempoPorCategoria"
                    :key="cat.categoria"
                    class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
                  >
                    <div class="flex items-center space-x-3">
                      <div
                        :class="getCategoriaColor(index)"
                        class="w-3 h-3 rounded-full"
                      ></div>
                      <span
                        class="font-medium text-gray-900 dark:text-white text-sm"
                        >{{ cat.categoria }}</span
                      >
                    </div>
                    <div class="text-right">
                      <span class="font-bold text-gray-900 dark:text-white">{{
                        cat.tempoMedio
                      }}</span>
                      <span
                        class="text-xs text-gray-500 dark:text-gray-400 block"
                        >{{ cat.count }} OS</span
                      >
                    </div>
                  </div>
                  <div
                    v-if="tempoStats.tempoPorCategoria.length === 0"
                    class="text-center text-gray-500 dark:text-gray-400 py-4"
                  >
                    Nenhuma OS com tempo registrado
                  </div>
                </div>
              </div>
            </div>

            <!-- Tabela de OS por Tempo -->
            <div
              class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mt-6"
            >
              <h3
                class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center"
              >
                <span class="text-2xl mr-2">🏆</span>
                Ranking de Tempo de Execução
              </h3>
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <thead class="bg-gray-50 dark:bg-slate-700">
                    <tr>
                      <th
                        class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                      >
                        Pos
                      </th>
                      <th
                        class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                      >
                        OS
                      </th>
                      <th
                        class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                      >
                        Categoria
                      </th>
                      <th
                        class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                      >
                        Executor
                      </th>
                      <th
                        class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                      >
                        Tempo
                      </th>
                      <th
                        class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
                    <tr
                      v-for="(os, index) in tempoStats.rankingTempo"
                      :key="os.numero"
                      class="hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                    >
                      <td class="px-4 py-3">
                        <span
                          :class="{
                            'bg-yellow-100 text-yellow-800': index === 0,
                            'bg-gray-200 text-gray-800': index === 1,
                            'bg-orange-100 text-orange-800': index === 2,
                            'bg-gray-100 text-gray-600': index > 2,
                          }"
                          class="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm"
                        >
                          {{ index + 1 }}
                        </span>
                      </td>
                      <td
                        class="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white"
                      >
                        #{{ os.numero }}
                      </td>
                      <td
                        class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {{ os.categoria }}
                      </td>
                      <td
                        class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {{ os.executor || "—" }}
                      </td>
                      <td class="px-4 py-3">
                        <span
                          :class="{
                            'bg-green-100 text-green-800': os.minutos <= 30,
                            'bg-yellow-100 text-yellow-800':
                              os.minutos > 30 && os.minutos <= 120,
                            'bg-orange-100 text-orange-800':
                              os.minutos > 120 && os.minutos <= 480,
                            'bg-red-100 text-red-800': os.minutos > 480,
                          }"
                          class="px-2 py-1 rounded-full text-xs font-semibold"
                        >
                          {{ os.tempoFormatado }}
                        </span>
                      </td>
                      <td class="px-4 py-3 text-sm">
                        <span
                          :class="
                            os.fechada
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          "
                          class="px-2 py-1 rounded-full text-xs font-semibold"
                        >
                          {{ os.fechada ? "FECHADA" : "ABERTA" }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="tempoStats.rankingTempo.length === 0">
                      <td
                        colspan="6"
                        class="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                      >
                        Nenhuma OS com tempo de execução registrado
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Gráficos -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- Por Tipo -->
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3
                class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center"
              >
                <span class="text-2xl mr-2">🔧</span>
                Distribuição por Tipo
              </h3>
              <div class="space-y-4">
                <div
                  v-for="tipo in stats.porTipo"
                  :key="tipo.tipo"
                  class="flex items-center"
                >
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-1">
                      <span
                        class="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >{{ tipo.tipo }}</span
                      >
                      <span
                        class="text-sm font-bold text-gray-900 dark:text-white"
                        >{{ tipo.count }} ({{
                          percentual(tipo.count, stats.total)
                        }}%)</span
                      >
                    </div>
                    <div
                      class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3"
                    >
                      <div
                        :class="
                          tipo.tipo === 'PREVENTIVA'
                            ? 'bg-blue-500'
                            : 'bg-red-500'
                        "
                        class="h-3 rounded-full transition-all duration-500"
                        :style="{
                          width: percentual(tipo.count, stats.total) + '%',
                        }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Por Categoria -->
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3
                class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center"
              >
                <span class="text-2xl mr-2">📋</span>
                Distribuição por Categoria
              </h3>
              <div class="space-y-3">
                <div
                  v-for="(cat, index) in stats.porCategoria"
                  :key="cat.categoria"
                  class="flex items-center"
                >
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-1">
                      <span
                        class="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >{{ cat.categoria }}</span
                      >
                      <span
                        class="text-sm font-bold text-gray-900 dark:text-white"
                        >{{ cat.count }}</span
                      >
                    </div>
                    <div
                      class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2"
                    >
                      <div
                        :class="getCategoriaColor(index)"
                        class="h-2 rounded-full transition-all duration-500"
                        :style="{
                          width: percentual(cat.count, stats.total) + '%',
                        }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabelas -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Top Solicitantes -->
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3
                class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center"
              >
                <span class="text-2xl mr-2">👥</span>
                Top 5 Solicitantes
              </h3>
              <div class="space-y-3">
                <div
                  v-for="(sol, index) in stats.topSolicitantes"
                  :key="sol.nome"
                  class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                >
                  <div class="flex items-center space-x-3">
                    <div
                      class="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm"
                    >
                      {{ index + 1 }}
                    </div>
                    <span class="font-medium text-gray-900 dark:text-white">{{
                      sol.nome
                    }}</span>
                  </div>
                  <span
                    class="flex flex-col items-center justify-center w-16 h-16 mx-auto rounded-full bg-indigo-100 text-indigo-700 font-bold text-lg"
                    style="min-width: 4rem; min-height: 4rem"
                  >
                    <span class="leading-none">{{ sol.count }}</span>
                    <span class="text-xs font-normal">OS</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Top Executores -->
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3
                class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center"
              >
                <span class="text-2xl mr-2">⚙️</span>
                Top 5 Executores
              </h3>
              <div class="space-y-3">
                <div
                  v-for="(exec, index) in stats.topExecutores"
                  :key="exec.nome"
                  class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                >
                  <div class="flex items-center space-x-3">
                    <div
                      class="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold text-sm"
                    >
                      {{ index + 1 }}
                    </div>
                    <span class="font-medium text-gray-900 dark:text-white">{{
                      exec.nome
                    }}</span>
                  </div>
                  <span
                    class="flex flex-col items-center justify-center w-16 h-16 mx-auto rounded-full bg-green-100 text-green-700 font-bold text-lg"
                    style="min-width: 4rem; min-height: 4rem"
                  >
                    <span class="leading-none">{{ exec.count }}</span>
                    <span class="text-xs font-normal">OS</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Top Recebedores -->
          <div class="grid grid-cols-1 lg:grid-cols-1 gap-6 mt-6">
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3
                class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center"
              >
                <span class="text-2xl mr-2">📥</span>
                Top 5 Recebedores de OS
              </h3>
              <div class="space-y-3">
                <div
                  v-for="(rec, index) in stats.topRecebedores"
                  :key="rec.nome"
                  class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                >
                  <div class="flex items-center space-x-3">
                    <div
                      class="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600 font-bold text-sm"
                    >
                      {{ index + 1 }}
                    </div>
                    <span class="font-medium text-gray-900 dark:text-white">{{
                      rec.nome
                    }}</span>
                  </div>
                  <span
                    class="flex flex-col items-center justify-center w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-700 font-bold text-lg"
                    style="min-width: 4rem; min-height: 4rem"
                  >
                    <span class="leading-none">{{ rec.count }}</span>
                    <span class="text-xs font-normal">OS</span>
                  </span>
                </div>
                <div
                  v-if="stats.topRecebedores.length === 0"
                  class="text-center text-gray-500 dark:text-gray-400 py-4"
                >
                  Nenhuma OS recebida ainda
                </div>
              </div>
            </div>
          </div>

          <!-- OS Recentes -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mt-6">
            <h3
              class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between"
            >
              <span class="flex items-center">
                <span class="text-2xl mr-2">🕒</span>
                Ordens Mais Recentes
              </span>
              <NuxtLink
                to="/gerenciar"
                class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
              >
                Ver todas →
              </NuxtLink>
            </h3>
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead class="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                    >
                      OS
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                    >
                      Tipo
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                    >
                      Solicitante
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                    >
                      Data
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
                  <tr
                    v-for="ordem in stats.recentes"
                    :key="ordem.id"
                    class="hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                  >
                    <td
                      class="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white"
                    >
                      #{{ ordem.numero }}
                    </td>
                    <td class="px-4 py-3 text-sm">
                      <span
                        :class="
                          ordem.tipo_os === 'PREVENTIVA'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        "
                        class="px-2 py-1 rounded-full text-xs font-semibold"
                      >
                        {{ ordem.tipo_os }}
                      </span>
                    </td>
                    <td
                      class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {{ ordem.solicitante?.nome || "—" }}
                    </td>
                    <td
                      class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {{ formatarData(ordem.data_solicitacao) }}
                    </td>
                    <td class="px-4 py-3 text-sm">
                      <span
                        :class="
                          ordem.data_liberacao
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        "
                        class="px-2 py-1 rounded-full text-xs font-semibold"
                      >
                        {{ ordem.data_liberacao ? "FECHADA" : "ABERTA" }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrdemServicoComRelacoes } from "~/types/ordem-servico";

definePageMeta({
  middleware: "auth",
});

import { useOffline } from "~/composables/useOffline";
const { listarOrdens } = useOrdemServico();
const { isOnline } = useOffline();
const { ensureValidSession } = useAuth();
const ordens = ref<OrdemServicoComRelacoes[]>([]);
const carregando = ref(true);
const erroCarregamento = ref(false);

const stats = computed(() => {
  const total = ordens.value.length;
  const abertas = ordens.value.filter((o) => !o.data_liberacao).length;
  const fechadas = ordens.value.filter((o) => o.data_liberacao).length;

  // Por Tipo
  const porTipo = [
    {
      tipo: "PREVENTIVA",
      count: ordens.value.filter((o) => o.tipo_os === "PREVENTIVA").length,
    },
    {
      tipo: "CORRETIVA",
      count: ordens.value.filter((o) => o.tipo_os === "CORRETIVA").length,
    },
  ];

  // Por Categoria
  const categorias = new Map<string, number>();
  ordens.value.forEach((o) => {
    categorias.set(
      o.categoria_servico,
      (categorias.get(o.categoria_servico) || 0) + 1
    );
  });
  const porCategoria = Array.from(categorias.entries())
    .map(([categoria, count]) => ({ categoria, count }))
    .sort((a, b) => b.count - a.count);

  // Top Solicitantes
  const solicitantes = new Map<string, number>();
  ordens.value.forEach((o) => {
    if (o.solicitante?.nome) {
      solicitantes.set(
        o.solicitante.nome,
        (solicitantes.get(o.solicitante.nome) || 0) + 1
      );
    }
  });
  const topSolicitantes = Array.from(solicitantes.entries())
    .map(([nome, count]) => ({ nome, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Top Executores
  const executores = new Map<string, number>();
  ordens.value.forEach((o) => {
    if (o.executor?.nome) {
      executores.set(
        o.executor.nome,
        (executores.get(o.executor.nome) || 0) + 1
      );
    }
  });
  const topExecutores = Array.from(executores.entries())
    .map(([nome, count]) => ({ nome, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Top Recebedores (pessoas que mais receberam OS)
  const recebedores = new Map<string, number>();
  ordens.value.forEach((o) => {
    if (o.recebido_por?.nome) {
      recebedores.set(
        o.recebido_por.nome,
        (recebedores.get(o.recebido_por.nome) || 0) + 1
      );
    }
  });
  const topRecebedores = Array.from(recebedores.entries())
    .map(([nome, count]) => ({ nome, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // OS Recentes
  const recentes = [...ordens.value]
    .sort((a, b) => b.numero - a.numero)
    .slice(0, 10);

  return {
    total,
    abertas,
    fechadas,
    porTipo,
    porCategoria,
    topSolicitantes,
    topExecutores,
    topRecebedores,
    recentes,
  };
});

const percentual = (valor: number, total: number) => {
  if (total === 0) return 0;
  return Math.round((valor / total) * 100);
};

const getCategoriaColor = (index: number) => {
  const colors = [
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-rose-500",
  ];
  return colors[index % colors.length];
};

const formatarData = (data: string) => {
  if (!data) return "—";
  const d = new Date(data + "T00:00:00");
  return d.toLocaleDateString("pt-BR");
};

// Função auxiliar para calcular tempo em minutos entre início e fim
const calcularTempoMinutos = (
  dataInicio: string | undefined,
  tempoInicio: string | undefined,
  dataFim: string | undefined,
  tempoFim: string | undefined
): number | null => {
  if (!dataInicio || !tempoInicio || !dataFim || !tempoFim) return null;

  try {
    // Normalizar formato de tempo (pode vir como HH:MM ou HH:MM:SS do Supabase)
    const normalizeTime = (time: string) => {
      // Se já tem segundos (HH:MM:SS), usar direto
      if (time.split(":").length === 3) return time;
      // Se só tem HH:MM, adicionar :00
      return `${time}:00`;
    };

    const inicio = new Date(`${dataInicio}T${normalizeTime(tempoInicio)}`);
    const fim = new Date(`${dataFim}T${normalizeTime(tempoFim)}`);

    // Verificar se as datas são válidas
    if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
      console.warn("Data inválida:", {
        dataInicio,
        tempoInicio,
        dataFim,
        tempoFim,
      });
      return null;
    }

    const diffMs = fim.getTime() - inicio.getTime();
    if (diffMs < 0) return null;
    return Math.round(diffMs / (1000 * 60)); // minutos
  } catch (e) {
    console.error("Erro ao calcular tempo:", e);
    return null;
  }
};

// Função para formatar minutos em texto legível
const formatarTempo = (minutos: number): string => {
  if (minutos < 60) {
    return `${minutos}min`;
  } else if (minutos < 1440) {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return mins > 0 ? `${horas}h ${mins}min` : `${horas}h`;
  } else {
    const dias = Math.floor(minutos / 1440);
    const horasRestantes = Math.floor((minutos % 1440) / 60);
    return horasRestantes > 0 ? `${dias}d ${horasRestantes}h` : `${dias}d`;
  }
};

// Estatísticas de Tempo
const tempoStats = computed(() => {
  // Debug: log das OS com campos de tempo
  const osComCamposTempo = ordens.value.filter(
    (o) => o.data_inicio || o.tempo_inicio || o.data_fim || o.tempo_fim
  );
  if (osComCamposTempo.length > 0) {
    console.log(
      "OS com campos de tempo:",
      osComCamposTempo.map((o) => ({
        numero: o.numero,
        data_inicio: o.data_inicio,
        tempo_inicio: o.tempo_inicio,
        data_fim: o.data_fim,
        tempo_fim: o.tempo_fim,
      }))
    );
  }

  // Calcular tempo de execução para cada OS
  const ordensComTempo = ordens.value
    .map((o) => ({
      numero: o.numero,
      categoria: o.categoria_servico,
      executor: o.executor?.nome || null,
      fechada: !!o.data_liberacao,
      minutos: calcularTempoMinutos(
        o.data_inicio,
        o.tempo_inicio,
        o.data_fim,
        o.tempo_fim
      ),
    }))
    .filter((o) => o.minutos !== null && o.minutos > 0) as Array<{
    numero: number;
    categoria: string;
    executor: string | null;
    fechada: boolean;
    minutos: number;
  }>;

  const osComTempoExecucao = ordensComTempo.length;

  // Tempo médio de execução
  const tempoMedioExecucaoMin =
    osComTempoExecucao > 0
      ? Math.round(
          ordensComTempo.reduce((sum, o) => sum + o.minutos, 0) /
            osComTempoExecucao
        )
      : 0;
  const tempoMedioExecucao =
    osComTempoExecucao > 0 ? formatarTempo(tempoMedioExecucaoMin) : "—";

  // Tempo médio de resposta (data_solicitacao → data_recebimento)
  const ordensComResposta = ordens.value.filter(
    (o) => o.data_solicitacao && o.data_recebimento
  );
  let tempoMedioResposta = "—";
  if (ordensComResposta.length > 0) {
    const temposResposta = ordensComResposta.map((o) => {
      const solicitacao = new Date(o.data_solicitacao + "T00:00:00");
      const recebimento = new Date(o.data_recebimento + "T00:00:00");
      return Math.max(
        0,
        Math.round(
          (recebimento.getTime() - solicitacao.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      ); // dias
    });
    const mediaDias = Math.round(
      temposResposta.reduce((a, b) => a + b, 0) / temposResposta.length
    );
    tempoMedioResposta =
      mediaDias === 0
        ? "Mesmo dia"
        : mediaDias === 1
        ? "1 dia"
        : `${mediaDias} dias`;
  }

  // OS mais rápida e mais demorada
  const ordenadas = [...ordensComTempo].sort((a, b) => a.minutos - b.minutos);
  const osMaisRapida =
    ordenadas.length > 0
      ? {
          numero: ordenadas[0].numero,
          tempo: formatarTempo(ordenadas[0].minutos),
        }
      : { numero: "—", tempo: "—" };
  const osMaisDemorada =
    ordenadas.length > 0
      ? {
          numero: ordenadas[ordenadas.length - 1].numero,
          tempo: formatarTempo(ordenadas[ordenadas.length - 1].minutos),
        }
      : { numero: "—", tempo: "—" };

  // Distribuição por faixa de tempo
  const distribuicaoTempo = [
    { label: "Até 30 min", min: 0, max: 30, count: 0, color: "bg-green-500" },
    {
      label: "30 min - 2h",
      min: 31,
      max: 120,
      count: 0,
      color: "bg-yellow-500",
    },
    { label: "2h - 8h", min: 121, max: 480, count: 0, color: "bg-orange-500" },
    { label: "8h - 24h", min: 481, max: 1440, count: 0, color: "bg-red-500" },
    {
      label: "Mais de 24h",
      min: 1441,
      max: Infinity,
      count: 0,
      color: "bg-purple-500",
    },
  ];

  ordensComTempo.forEach((o) => {
    const faixa = distribuicaoTempo.find(
      (f) => o.minutos >= f.min && o.minutos <= f.max
    );
    if (faixa) faixa.count++;
  });

  // Tempo médio por categoria
  const temposPorCategoria = new Map<string, number[]>();
  ordensComTempo.forEach((o) => {
    if (!temposPorCategoria.has(o.categoria)) {
      temposPorCategoria.set(o.categoria, []);
    }
    temposPorCategoria.get(o.categoria)!.push(o.minutos);
  });

  const tempoPorCategoria = Array.from(temposPorCategoria.entries())
    .map(([categoria, tempos]) => ({
      categoria,
      count: tempos.length,
      tempoMedioMin: Math.round(
        tempos.reduce((a, b) => a + b, 0) / tempos.length
      ),
      tempoMedio: formatarTempo(
        Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length)
      ),
    }))
    .sort((a, b) => a.tempoMedioMin - b.tempoMedioMin);

  // Ranking de tempo (top 10 mais rápidas)
  const rankingTempo = ordenadas.slice(0, 10).map((o) => ({
    ...o,
    tempoFormatado: formatarTempo(o.minutos),
  }));

  return {
    tempoMedioExecucao,
    tempoMedioResposta,
    osComTempoExecucao,
    osMaisRapida,
    osMaisDemorada,
    distribuicaoTempo,
    tempoPorCategoria,
    rankingTempo,
  };
});

let timeoutId: any = null;
const carregarDados = async (tentativa = 1) => {
  carregando.value = true;
  erroCarregamento.value = false;
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    if (carregando.value) {
      erroCarregamento.value = true;
      carregando.value = false;
    }
  }, 10000); // 10 segundos
  try {
    ordens.value = await listarOrdens();
  } catch (error) {
    console.error("Erro ao carregar dados:", error);

    // Se é a primeira tentativa, tentar novamente
    if (tentativa === 1) {
      console.log("Erro ao carregar, tentando novamente...");
      clearTimeout(timeoutId);
      return carregarDados(2);
    }

    erroCarregamento.value = true;
  } finally {
    carregando.value = false;
    clearTimeout(timeoutId);
  }
};

const tentarNovamente = () => {
  carregarDados();
};

onMounted(() => {
  carregarDados();
});
</script>
