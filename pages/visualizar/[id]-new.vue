<template>
  <div class="print-container" v-if="ordem">
    <!-- Botões de ação (não imprime) -->
    <div class="no-print action-buttons">
      <button @click="imprimir" class="btn-print">🖨️ Imprimir</button>
      <button @click="$router.push('/')" class="btn-back">Voltar</button>
    </div>

    <!-- Página de impressão -->
    <div class="page">
      <!-- Header -->
      <table class="header-table">
        <tbody>
          <tr>
            <td rowspan="2" class="logo-cell">
              <div class="logo">MARQUISE<br />AMBIENTAL</div>
            </td>
            <td colspan="3" class="title-cell">
              CENTRO DE TRATAMENTO DE RESÍDUOS PERIGOSOS - CTRP
            </td>
            <td class="info-label">Código</td>
            <td class="info-label">Revisão</td>
            <td class="info-label">Data</td>
          </tr>
          <tr>
            <td colspan="3" class="address-cell">
              Estrada do Itaperi, 725 - Jangurussu - CEP: 60862-220
            </td>
            <td class="info-value">REG - SASFOR -88</td>
            <td class="info-value">01</td>
            <td class="info-value">10/3/2020</td>
          </tr>
        </tbody>
      </table>

      <!-- Título OS -->
      <table class="os-title-table">
        <tbody>
          <tr>
            <td class="os-title">ORDEM DE SERVIÇO</td>
            <td class="os-number">N° {{ ordem.numero }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Preenchimento do Solicitante -->
      <table class="section-table">
        <tbody>
          <tr>
            <td colspan="8" class="section-header">
              PREENCHIMENTO DO SOLICITANTE
            </td>
          </tr>
          <tr>
            <td colspan="2" class="label-cell">TIPO DE O.S.:</td>
            <td colspan="6" class="label-cell">CATEGORIA DO SERVIÇO:</td>
          </tr>
          <tr>
            <td colspan="2" class="data-cell">
              {{ ordem.tipo_os || "N/A" }}
            </td>
            <td colspan="6" class="data-cell">
              {{ ordem.categoria_servico || "N/A" }}
            </td>
          </tr>
          <tr>
            <td colspan="8" class="label-cell">SINTOMA/DEFEITO:</td>
          </tr>
          <tr>
            <td colspan="8" class="data-cell">
              {{ ordem.sintoma_defeito || "N/A" }}
            </td>
          </tr>
          <tr>
            <td class="label-cell">FAMÍLIA:</td>
            <td colspan="3" class="data-cell">
              {{ ordem.familia?.codigo }} - {{ ordem.familia?.familia }}
            </td>
            <td class="label-cell">SOLICITANTE:</td>
            <td colspan="3" class="data-cell">{{ ordem.solicitante?.nome }}</td>
          </tr>
          <tr>
            <td class="label-cell">ATIVO:</td>
            <td colspan="3" class="data-cell">
              {{ ordem.ativo?.codigo }} - {{ ordem.ativo?.nome }}
            </td>
            <td class="label-cell">DATA:</td>
            <td colspan="3" class="data-cell">
              {{ formatarData(ordem.data_solicitacao) }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Preenchimento da Manutenção -->
      <table class="section-table">
        <tbody>
          <tr>
            <td colspan="8" class="section-header">
              PREENCHIMENTO DA MANUTENÇÃO
            </td>
          </tr>
          <tr>
            <td colspan="8" class="subsection-header">RECEBIMENTO DE O.S.</td>
          </tr>
          <tr>
            <td class="label-cell">NOME:</td>
            <td colspan="2" class="data-cell">
              {{ ordem.recebido_por?.nome || "N/A" }}
            </td>
            <td class="label-cell">DATA:</td>
            <td class="data-cell">
              {{ formatarData(ordem.data_recebimento) }}
            </td>
            <td class="label-cell">HORA:</td>
            <td class="data-cell">{{ ordem.hora_recebimento || "N/A" }}</td>
            <td></td>
          </tr>
          <tr>
            <td class="label-cell">FUNÇÃO:</td>
            <td colspan="7" class="data-cell">
              {{ ordem.recebido_por?.funcao || "N/A" }}
            </td>
          </tr>
          <tr>
            <td colspan="5" class="label-cell">DESCRIÇÃO DO SERVIÇO</td>
            <td colspan="3" class="label-cell">EXECUTOR</td>
          </tr>
          <tr>
            <td colspan="5" rowspan="6" class="data-cell description-cell">
              {{ ordem.descricao_servico || "N/A" }}
            </td>
            <td colspan="3" class="data-cell executor-cell">
              <div v-if="ordem.executores && ordem.executores.length > 0">
                <div v-for="(executor, index) in ordem.executores" :key="index">
                  {{ index + 1 }}. {{ executor?.nome || "N/A" }}
                </div>
              </div>
              <div v-else>
                {{ ordem.executor?.nome || "N/A" }}
              </div>
            </td>
          </tr>
          <tr></tr>
          <tr></tr>
          <tr></tr>
          <tr></tr>
          <tr></tr>
        </tbody>
      </table>

      <!-- Insumos -->
      <table class="section-table">
        <tbody>
          <tr>
            <td colspan="8" class="subsection-header">INSUMOS UTILIZADOS</td>
          </tr>
          <tr>
            <td colspan="4" class="label-cell-small">
              PEÇAS A UTILIZAR E/OU SOBRANTES
            </td>
            <td class="label-cell-small">QUANT.</td>
            <td colspan="2" class="label-cell-small">REQUISIÇÃO</td>
            <td class="label-cell-small">CUSTO (R$)</td>
          </tr>
          <tr
            v-for="(insumo, index) in (ordem.insumos || []).slice(0, 6)"
            :key="index"
          >
            <td colspan="4" class="data-cell-small">{{ insumo.peca || "" }}</td>
            <td class="data-cell-small">{{ insumo.quantidade || "" }}</td>
            <td colspan="2" class="data-cell-small">
              {{ insumo.requisicao || "" }}
            </td>
            <td class="data-cell-small">
              {{ insumo.custo ? formatarMoeda(insumo.custo) : "" }}
            </td>
          </tr>
          <tr
            v-for="n in Math.max(0, 6 - (ordem.insumos || []).length)"
            :key="'empty-' + n"
          >
            <td colspan="4" class="data-cell-small">&nbsp;</td>
            <td class="data-cell-small">&nbsp;</td>
            <td colspan="2" class="data-cell-small">&nbsp;</td>
            <td class="data-cell-small">&nbsp;</td>
          </tr>
          <tr>
            <td colspan="5" class="label-cell-small">OBSERVAÇÕES</td>
            <td colspan="3" class="label-cell-small">TEMPO DE EXECUÇÃO</td>
          </tr>
          <tr>
            <td
              colspan="5"
              rowspan="2"
              class="data-cell-small observations-cell"
            >
              {{ ordem.observacoes || "" }}
            </td>
            <td class="label-cell-small">INÍCIO:</td>
            <td colspan="2" class="data-cell-small">
              {{ ordem.tempo_inicio || "  /  /  às" }}
            </td>
          </tr>
          <tr>
            <td class="label-cell-small">FIM:</td>
            <td colspan="2" class="data-cell-small">
              {{ ordem.tempo_fim || "  /  /  às" }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Encerramento -->
      <table class="section-table">
        <tbody>
          <tr>
            <td colspan="8" class="section-header">
              PREENCHIMENTO DO ENCARREGADO/ESPECIALISTA
            </td>
          </tr>
          <tr>
            <td colspan="2" class="label-cell-small">
              CONCLUÍDO O LANÇAMENTOS DE CUSTOS?
            </td>
            <td colspan="6" class="label-cell-small">APROVAÇÃO DO SERVIÇO</td>
          </tr>
          <tr>
            <td colspan="2" class="data-cell-small">
              {{
                ordem.custos_concluidos === true
                  ? "SIM"
                  : ordem.custos_concluidos === false
                  ? "NÃO"
                  : "N/A"
              }}
              <br />
              CUSTO TOTAL: {{ formatarMoeda(ordem.custo_total) }}
            </td>
            <td colspan="3" class="data-cell-small">
              {{ ordem.liberado_operacao === true ? "SIM" : "NÃO" }}
              <br />
              LIBERADO PARA OPERAÇÃO
            </td>
            <td colspan="3" rowspan="2" class="data-cell-small">
              O DO ENCARREGADO OU SOLICITANTE
            </td>
          </tr>
          <tr>
            <td class="label-cell-small">DATA:</td>
            <td colspan="4" class="data-cell-small">
              {{ formatarData(ordem.data_liberacao) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-else class="loading">
    <div class="spinner"></div>
    <p>Carregando ordem de serviço...</p>
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

const carregarOrdem = async () => {
  const id = parseInt(route.params.id as string);
  if (id) {
    try {
      // Garantir sessão válida antes de carregar dados
      console.log(`Tentativa ${tentativa}: Verificando sessão...`);
      const sessionValid = await ensureValidSession();
      if (!sessionValid && tentativa === 1) {
        console.warn("Sessão inválida, tentando novamente...");
        return carregarOrdem(2);
      }

      ordem.value = await buscarOrdem(id);
      if (!ordem.value) {
        alert("Ordem de serviço não encontrada!");
        router.push("/");
      }
    } catch (error) {
      console.error("Erro ao carregar ordem:", error);
      if (tentativa === 1) {
        console.log("Erro ao carregar, tentando novamente...");
        return carregarOrdem(2);
      }
      alert("Erro ao carregar ordem de serviço");
      router.push("/");
    }
  }
};

const formatarData = (data: string | undefined) => {
  if (!data) return "  /  /  ";
  const d = new Date(data + "T00:00:00");
  return d.toLocaleDateString("pt-BR");
};

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
/* Estilos gerais */
.print-container {
  background: #f0f0f0;
  min-height: 100vh;
  padding-top: 100px;
  padding-bottom: 40px;
  padding-left: 20px;
  padding-right: 20px;
}

.page {
  background: white;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 5mm;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Botões de ação */
.no-print {
  margin-bottom: 20px;
  text-align: center;
}

.action-buttons {
  max-width: 210mm;
  margin: 0 auto 20px;
}

.btn-print,
.btn-back {
  padding: 10px 20px;
  margin: 0 5px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

.btn-print {
  background: #2563eb;
  color: white;
}

.btn-back {
  background: #6b7280;
  color: white;
}

/* Tabelas */
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2mm;
}

td {
  border: 1px solid #000;
  padding: 1mm 2mm;
  font-size: 9pt;
  vertical-align: top;
}

/* Header */
.header-table td {
  text-align: center;
  font-size: 8pt;
}

.logo-cell {
  width: 20%;
  border: 3px solid #000;
  background: white;
}

.logo {
  font-weight: bold;
  font-size: 16pt;
  text-align: center;
  padding: 5mm;
  background: white;
}

.title-cell {
  font-weight: bold;
  font-size: 12pt;
  border: 2px solid #000;
}

.address-cell {
  font-size: 10pt;
  border: 2px solid #000;
}

.info-label {
  font-weight: bold;
  background: #d3d3d3;
  border: 1px solid #000;
  width: 10%;
}

.info-value {
  border: 1px solid #000;
  width: 10%;
}

/* Título OS */
.os-title-table {
  margin: 3mm 0;
}

.os-title {
  font-weight: bold;
  font-style: italic;
  font-size: 14pt;
  text-align: center;
  background: #e0e0e0;
  border: 2px solid #000;
  padding: 2mm;
}

.os-number {
  font-weight: bold;
  font-size: 18pt;
  text-align: center;
  border: 2px solid #000;
  width: 15%;
}

/* Seções */
.section-table {
  margin-bottom: 2mm;
}

.section-header {
  font-weight: bold;
  text-align: center;
  background: #d3d3d3;
  border: 2px solid #000;
  padding: 1mm;
  font-size: 10pt;
}

.subsection-header {
  font-weight: bold;
  text-align: center;
  background: #e8e8e8;
  border: 1px solid #000;
  padding: 1mm;
  font-size: 9pt;
}

.label-cell {
  font-weight: bold;
  background: #f5f5f5;
  width: 12%;
  padding: 1mm 2mm;
}

.label-cell-small {
  font-weight: bold;
  background: #f5f5f5;
  font-size: 8pt;
  text-align: center;
  padding: 1mm;
}

.data-cell {
  padding: 1mm 2mm;
  font-size: 9pt;
}

.data-cell-small {
  padding: 0.5mm 1mm;
  font-size: 8pt;
  min-height: 5mm;
}

.description-cell {
  vertical-align: top;
  min-height: 30mm;
  white-space: pre-wrap;
}

.executor-cell {
  vertical-align: top;
  min-height: 30mm;
}

.observations-cell {
  white-space: pre-wrap;
  min-height: 15mm;
}

/* Checkboxes */
.checkbox-label {
  display: inline-flex;
  align-items: center;
  margin-right: 8px;
  font-size: 9pt;
}

.radio-circle {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2.5px solid #000;
  border-radius: 50%;
  margin-right: 5px;
  vertical-align: middle;
  box-sizing: border-box;
}

.radio-circle.filled {
  border-width: 7px;
}

/* Loading */
.loading {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #16a34a;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Print styles */
@media print {
  @page {
    size: A4;
    margin: 20mm 15mm;
  }

  .print-container {
    padding: 0;
  }

  .page {
    width: 100%;
    min-height: 100%;
    margin: 0;
    padding: 0;
    box-shadow: none;
  }

  .no-print {
    display: none !important;
  }

  table {
    page-break-inside: avoid;
  }
}
</style>
