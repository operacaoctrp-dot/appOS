<template>
  <div class="screen-only" v-if="ordem">
    <!-- Breadcrumbs (visível apenas na tela) -->
    <AppNavigation class="print:hidden" />
    <Breadcrumbs
      class="print:hidden"
      :items="[
        { label: 'Gerenciar OS', to: '/gerenciar' },
        { label: `Visualizar OS #${ordem.numero}` },
      ]"
    />

    <!-- Botões de ação (visível apenas na tela) -->
    <div class="p-4 bg-white shadow-md mb-4 no-print">
      <div class="max-w-7xl mx-auto flex justify-end space-x-3">
        <button
          @click="imprimir"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          🖨️ Imprimir
        </button>
        <button
          @click="router.push('/gerenciar')"
          class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
        >
          Voltar
        </button>
      </div>
    </div>

    <!-- Documento para impressão -->
    <main class="print-container">
      <!-- CABEÇALHO -->
      <table class="header-table">
        <tbody>
          <tr>
            <td rowspan="2" class="logo-cell">
              <img
                src="/marquise-logo.jpg"
                alt="Marquise Ambiental"
                class="logo-img"
              />
            </td>
            <td class="title-cell">
              CENTRO DE TRATAMENTO DE RESÍDUOS PERIGOSOS - CTRP
            </td>
            <td class="code-cell">Código<br />REG-SASFOR-66</td>
          </tr>
          <tr>
            <td class="address-cell">
              Estrada do Itaperi, 725 - Jangurussu - CEP: 60862-220
            </td>
            <td class="revision-cell">Revisão: 01<br />10/3/2020</td>
          </tr>
        </tbody>
      </table>

      <!-- TÍTULO OS -->
      <table class="os-title-table">
        <tbody>
          <tr>
            <td class="os-label">ORDEM DE SERVIÇO</td>
            <td class="os-number">N° {{ ordem.numero }}</td>
          </tr>
        </tbody>
      </table>

      <!-- SEÇÃO SOLICITANTE -->
      <table class="section-table">
        <tbody>
          <tr>
            <th colspan="10" class="section-header">
              PREENCHIMENTO DO SOLICITANTE
            </th>
          </tr>
          <tr>
            <td colspan="2" class="label-cell">TIPO DE O.S.:</td>
            <td colspan="8" class="label-cell">CATEGORIA DO SERVIÇO:</td>
          </tr>
          <tr>
            <td colspan="2" class="data-cell">
              {{ ordem.tipo_os || "N/A" }}
            </td>
            <td colspan="8" class="data-cell">
              {{ ordem.categoria_servico || "N/A" }}
            </td>
          </tr>
          <tr>
            <td colspan="10" class="label-cell">SINTOMA/DEFEITO:</td>
          </tr>
          <tr>
            <td colspan="10" class="data-cell sintoma-cell">
              {{ sintomaUpperCase }}
            </td>
          </tr>
          <tr>
            <td colspan="2" class="label-cell">FAMÍLIA:</td>
            <td colspan="3" class="label-cell">ATIVO:</td>
            <td colspan="3" class="label-cell">SOLICITANTE:</td>
            <td colspan="2" class="label-cell">DATA:</td>
          </tr>
          <tr>
            <td colspan="2" class="data-cell">
              {{ ordem.familia?.familia || "" }}
            </td>
            <td colspan="3" class="data-cell">
              {{ ordem.ativo?.nome || "" }}
            </td>
            <td colspan="3" class="data-cell">
              {{ ordem.solicitante?.nome || "" }}
            </td>
            <td colspan="2" class="data-cell">
              {{ formatarData(ordem.data_solicitacao) }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- SEÇÃO MANUTENÇÃO -->
      <table class="section-table">
        <tbody>
          <tr>
            <th colspan="10" class="section-header">
              PREENCHIMENTO DA MANUTENÇÃO
            </th>
          </tr>
          <tr>
            <td colspan="10" class="subsection-label">RECEBIMENTO DE O.S.</td>
          </tr>
          <tr>
            <td colspan="1" class="label-cell">NOME:</td>
            <td colspan="3" class="data-cell">
              {{ ordem.recebido_por?.nome || "" }}
            </td>
            <td colspan="1" class="label-cell">FUNÇÃO:</td>
            <td colspan="1" class="data-cell">
              {{ ordem.recebido_por?.funcao || "" }}
            </td>
            <td colspan="1" class="label-cell">DATA:</td>
            <td colspan="1" class="data-cell">
              {{ formatarData(ordem.data_recebimento) }}
            </td>
            <td colspan="1" class="label-cell">HORA:</td>
            <td colspan="1" class="data-cell">
              {{ ordem.hora_recebimento || "" }}
            </td>
          </tr>
          <tr>
            <td colspan="5" class="label-cell">DESCRIÇÃO DO SERVIÇO:</td>
            <td colspan="5" rowspan="7" class="executor-cell">
              <div class="label-text">EXECUTOR(ES):</div>
              <div
                v-if="ordem.executores && ordem.executores.length > 0"
                class="executor-list"
              >
                <div
                  v-for="(executor, index) in ordem.executores.slice(0, 6)"
                  :key="index"
                  class="executor-item"
                >
                  {{ index + 1 }}. {{ executor?.nome || "" }}
                </div>
              </div>
              <div v-else class="executor-list">
                <div class="executor-item">
                  {{ ordem.executor?.nome || "" }}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td
              colspan="5"
              rowspan="6"
              class="description-cell description-uppercase"
            >
              {{ ordem.descricao_servico || "" }}
            </td>
          </tr>
          <tr></tr>
          <tr></tr>
          <tr></tr>
          <tr></tr>
          <tr></tr>
        </tbody>
      </table>

      <!-- INSUMOS UTILIZADOS -->
      <table class="insumos-table">
        <tbody>
          <tr>
            <th colspan="10" class="subsection-label">INSUMOS UTILIZADOS</th>
          </tr>
          <tr>
            <th colspan="5" class="insumo-header">
              PEÇAS A UTILIZAR E/OU SOBRANTES
            </th>
            <th colspan="2" class="insumo-header">QUANT.</th>
            <th colspan="2" class="insumo-header">REQUISIÇÃO</th>
            <th colspan="1" class="insumo-header">CUSTO (R$)</th>
          </tr>
          <template v-if="ordem.insumos && ordem.insumos.length > 0">
            <tr
              v-for="(insumo, index) in ordem.insumos.slice(0, 6)"
              :key="index"
            >
              <td colspan="5" class="insumo-cell">{{ insumo.peca }}</td>
              <td colspan="2" class="insumo-cell">{{ insumo.quantidade }}</td>
              <td colspan="2" class="insumo-cell">{{ insumo.requisicao }}</td>
              <td colspan="1" class="insumo-cell">
                {{ formatarMoeda(insumo.custo) }}
              </td>
            </tr>
            <tr
              v-for="i in Math.max(0, 6 - ordem.insumos.length)"
              :key="`empty-${i}`"
            >
              <td colspan="5" class="insumo-cell">&nbsp;</td>
              <td colspan="2" class="insumo-cell">&nbsp;</td>
              <td colspan="2" class="insumo-cell">&nbsp;</td>
              <td colspan="1" class="insumo-cell">&nbsp;</td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="i in 6" :key="`empty-${i}`">
              <td colspan="5" class="insumo-cell">&nbsp;</td>
              <td colspan="2" class="insumo-cell">&nbsp;</td>
              <td colspan="2" class="insumo-cell">&nbsp;</td>
              <td colspan="1" class="insumo-cell">&nbsp;</td>
            </tr>
          </template>
        </tbody>
      </table>

      <!-- OBSERVAÇÕES E TEMPO -->
      <table class="obs-tempo-table">
        <tbody>
          <tr>
            <td class="obs-header">OBSERVAÇÕES</td>
            <td class="tempo-header">TEMPO DE EXECUÇÃO</td>
          </tr>
          <tr>
            <td rowspan="2" class="observation-cell">
              {{ ordem.observacoes || "" }}
            </td>
            <td class="time-full">
              INÍCIO: {{ formatarDataCompleta(ordem.data_inicio) }} às
              {{ ordem.tempo_inicio || "_____ : _____" }}
            </td>
          </tr>
          <tr>
            <td class="time-full">
              FIM: {{ formatarDataCompleta(ordem.data_fim) }} às
              {{ ordem.tempo_fim || "_____ : _____" }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- SEÇÃO ENCERRAMENTO -->
      <table class="section-table">
        <tbody>
          <tr>
            <th colspan="10" class="section-header">
              PREENCHIMENTO DO ENCARREGADO/ESPECIALISTA
            </th>
          </tr>
          <tr>
            <td colspan="3" class="section-header">
              CONCLUÍDO O LANÇAMENTOS DE CUSTOS?
            </td>
            <td colspan="7" class="section-header">APROVAÇÃO DO SERVIÇO</td>
          </tr>
          <tr>
            <td colspan="3" rowspan="2" class="data-cell">
              <div class="radio-group">
                <label class="radio-item">
                  <span
                    class="checkbox"
                    :class="{ checked: ordem.custos_concluidos }"
                  ></span>
                  SIM
                </label>
                <label class="radio-item">
                  <span
                    class="checkbox"
                    :class="{ checked: !ordem.custos_concluidos }"
                  ></span>
                  NÃO
                </label>
              </div>
              <div v-if="ordem.custos_concluidos" class="custo-total">
                <span class="label-text">CUSTO TOTAL:</span>
                {{ formatarMoeda(ordem.custo_total) }}
              </div>
            </td>
            <td colspan="3" class="label-cell" style="text-align: center">
              LIBERADO PARA OPERAÇÃO
            </td>
            <td colspan="2" class="label-cell" style="text-align: center">
              DATA
            </td>
            <td colspan="2" class="label-cell" style="text-align: center">
              VISTO DO ENCARREGADO OU SOLICITANTE
            </td>
          </tr>
          <tr>
            <td colspan="3" class="data-cell" style="text-align: center">
              <div class="checkbox-grid" style="justify-content: center">
                <label class="radio-item">
                  <span
                    class="checkbox"
                    :class="{ checked: ordem.liberado_operacao }"
                  ></span>
                  SIM
                </label>
                <label class="radio-item">
                  <span
                    class="checkbox"
                    :class="{ checked: !ordem.liberado_operacao }"
                  ></span>
                  NÃO
                </label>
              </div>
            </td>
            <td colspan="2" class="data-cell" style="text-align: center">
              ___ / ___ / ___
            </td>
            <td colspan="2" class="data-cell" style="text-align: center"></td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>

  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"
      ></div>
      <p class="mt-4 text-gray-600">Carregando ordem de serviço...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrdemServicoComRelacoes } from "~/types/ordem-servico";

definePageMeta({
  layout: false,
});

const route = useRoute();
const router = useRouter();
const { buscarOrdem } = useOrdemServico();
const { ensureValidSession } = useAuth();

const ordem = ref<OrdemServicoComRelacoes | null>(null);

const { error: modalError } = useModal();

const carregarOrdem = async (tentativa = 1) => {
  const id = parseInt(route.params.id as string);
  if (id) {
    try {
      ordem.value = await buscarOrdem(id);

      if (!ordem.value) {
        return;
      }

      // Verificar se a OS está fechada
      if (!ordem.value.data_liberacao) {
        await modalError(
          "Esta OS ainda não foi fechada! A visualização só está disponível para OS fechadas."
        );
        router.push("/gerenciar");
      }
    } catch (error) {
      console.error("Erro ao carregar ordem:", error);
      if (tentativa === 1) {
        console.log("Erro ao carregar, tentando novamente...");
        return carregarOrdem(2);
      }
    }
  }
};

const formatarData = (data: string | undefined) => {
  if (!data) return "";
  const d = new Date(data + "T00:00:00");
  return d.toLocaleDateString("pt-BR");
};

const formatarDataCompleta = (data: string | undefined) => {
  if (!data) return "_____ / _____ / _____";
  const d = new Date(data + "T00:00:00");
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  return `${dia} / ${mes} / ${ano}`;
};

const sintomaUpperCase = computed(() => {
  return ordem.value?.sintoma_defeito?.toUpperCase() || "";
});

const formatarMoeda = (valor: number | undefined) => {
  if (valor === undefined || valor === null) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};

const imprimir = () => {
  window.print();
};

onMounted(() => {
  carregarOrdem();
});
</script>

<style scoped>
/* ESTILOS PARA TELA */
.screen-only {
  background-color: #f9fafb;
  min-height: 100vh;
  padding-bottom: 2rem;
}

.print-container {
  max-width: 210mm;
  margin: 0 auto;
  background: white;
  padding: 5mm;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* ESTILOS DE TABELA */
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2mm;
}

td,
th {
  border: 1px solid #000;
  padding: 1mm;
  font-size: 7pt;
  vertical-align: top;
}

/* CABEÇALHO */
.header-table {
  margin-bottom: 1mm;
}

.logo-cell {
  width: 30mm;
  text-align: center;
  font-weight: bold;
  font-size: 10pt;
  background: white;
  padding: 1.5mm;
}

.logo-img {
  max-width: 100%;
  max-height: 18mm;
  object-fit: contain;
}

.title-cell {
  font-weight: bold;
  font-size: 12pt;
  padding: 1mm 2mm;
}

.address-cell {
  font-size: 10pt;
  padding: 1mm 2mm;
}

.code-cell,
.revision-cell {
  width: 25mm;
  text-align: center;
  font-size: 7pt;
  font-weight: bold;
}

/* TÍTULO OS */
.os-title-table {
  margin-bottom: 1mm;
}

.os-label {
  font-size: 12pt;
  font-weight: bold;
  font-style: normal;
  background: #e5e7eb;
  padding: 1mm 2mm;
  text-align: center;
  padding-left: 30mm;
}

.os-number {
  width: 30mm;
  text-align: center;
  font-size: 14pt;
  font-weight: bold;
  background: #e5e7eb;
}

/* SEÇÕES */
.section-table,
.insumos-table {
  margin-bottom: 1mm;
}

.section-header {
  background: #e5e7eb;
  font-weight: bold;
  font-size: 8pt;
  text-align: center;
  padding: 1mm 2mm;
}

.subsection-label {
  background: #f3f4f6;
  font-weight: bold;
  font-size: 7pt;
  padding: 1mm 2mm;
  text-align: center;
}

.label-cell {
  background: #f9fafb;
  font-weight: bold;
  font-size: 6.5pt;
  padding: 0.5mm 1mm;
}

.data-cell {
  font-size: 7pt;
  padding: 1mm;
}

.sintoma-cell {
  height: 10mm;
  padding: 1mm;
  text-transform: uppercase !important;
}

.description-cell {
  height: 25mm;
  padding: 1mm;
  white-space: pre-wrap;
}

.description-uppercase {
  text-transform: uppercase;
}

.executor-cell {
  padding: 1mm;
}

.executor-cell .label-text {
  font-weight: bold;
  font-size: 6.5pt;
  margin-bottom: 0.5mm;
}

.executor-list {
  display: flex;
  flex-direction: column;
  gap: 0.5mm;
}

.executor-item {
  font-size: 7pt;
  padding: 0.5mm 0;
}

/* INSUMOS */
.insumo-header {
  background: #f3f4f6;
  font-weight: bold;
  font-size: 6.5pt;
  text-align: left;
  padding: 0.5mm 1mm;
}

.insumo-cell {
  font-size: 7pt;
  padding: 0.5mm 1mm;
  height: 5mm;
}

/* OBSERVAÇÕES */
.observation-cell {
  height: 12mm;
  padding: 1mm;
  white-space: pre-wrap;
  vertical-align: top;
}

.time-label {
  background: #f9fafb;
  font-weight: bold;
  font-size: 6.5pt;
  padding: 0.5mm 1mm;
  text-align: right;
}

.time-label-small {
  font-size: 6.5pt;
  padding: 0.5mm 1mm;
  text-align: center;
}

.time-input {
  font-size: 7pt;
  padding: 0.5mm;
  text-align: center;
  width: 8mm;
}

.time-data {
  font-size: 7pt;
  padding: 0.5mm 1mm;
  text-align: center;
}

.time-hora {
  font-size: 7pt;
  padding: 0.5mm 1mm;
  text-align: center;
}

.time-combined {
  font-size: 7pt;
  padding: 0.5mm 1mm;
  text-align: left;
}

.time-full {
  font-size: 6.5pt;
  padding: 0.5mm;
  text-align: left;
  font-weight: bold;
  width: 50mm;
  white-space: nowrap;
}

.obs-tempo-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1mm;
  table-layout: fixed;
}

.obs-tempo-table .observation-cell {
  width: 150mm;
  height: 12mm;
  padding: 1mm;
  white-space: pre-wrap;
  vertical-align: top;
}

.obs-header {
  background: #f3f4f6;
  font-weight: bold;
  font-size: 7pt;
  padding: 1mm 2mm;
  text-align: center;
  width: 150mm;
}

.tempo-header {
  background: #f3f4f6;
  font-weight: bold;
  font-size: 7pt;
  padding: 1mm 2mm;
  text-align: center;
  width: 50mm;
}

.time-field {
  font-size: 7pt;
  padding: 0.5mm 1mm;
  text-align: center;
}

/* RADIO BUTTONS E CHECKBOXES */
.radio-group,
.checkbox-grid,
.categoria-grid {
  display: flex;
  flex-direction: column;
  gap: 1mm;
}

.checkbox-grid {
  flex-direction: row;
  flex-wrap: wrap;
}

.categoria-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1mm;
  column-gap: 3mm;
}

.radio-item,
.checkbox-item {
  display: flex;
  align-items: center;
  font-size: 7pt;
  gap: 1mm;
}

.checkbox-item {
  width: 48%;
}

.radio {
  width: 3mm;
  height: 3mm;
  border: 1px solid #000;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.radio.checked::after {
  content: "";
  width: 1.5mm;
  height: 1.5mm;
  background: #000;
  border-radius: 50%;
}

.checkbox {
  width: 3mm;
  height: 3mm;
  border: 1px solid #000;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.checkbox.checked::after {
  content: "✓";
  font-size: 7pt;
  font-weight: bold;
  line-height: 1;
}

.custo-total {
  margin-top: 2mm;
  font-size: 7pt;
}

.custo-total .label-text {
  font-weight: bold;
  font-size: 6.5pt;
}

/* IMPRESSÃO */
@media print {
  @page {
    size: A4 portrait;
    margin: 5mm;
  }

  body {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .no-print {
    display: none !important;
  }

  .screen-only {
    background: none;
    padding: 0;
    min-height: auto;
  }

  .print-container {
    box-shadow: none;
    padding: 0;
    margin: 0;
    max-width: 100%;
  }

  table {
    page-break-inside: avoid;
  }

  /* Forçar cores no print */
  .logo-cell {
    background: #000 !important;
    color: #fff !important;
  }

  .section-header {
    background: #d1d5db !important;
  }

  .subsection-label,
  .insumo-header {
    background: #e5e7eb !important;
  }

  .label-cell,
  .time-label {
    background: #f3f4f6 !important;
  }

  .os-label,
  .os-number {
    background: #e5e7eb !important;
  }
}
</style>
