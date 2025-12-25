import { defineStore } from "pinia";
import type { OrdemServicoComRelacoes } from "~/types/ordem-servico";

export const useOrdemServicoStore = defineStore("ordemServico", {
  state: () => ({
    ordens: [] as OrdemServicoComRelacoes[],
    solicitantes: [] as any[],
    funcionarios: [] as any[],
    familias: [] as any[],
    ativos: [] as any[],
    lastFetch: null as number | null,
    cacheTimeout: 5 * 60 * 1000, // 5 minutos em ms
  }),

  getters: {
    ordensAbertas: (state) => state.ordens.filter((o) => !o.data_liberacao),

    ordensFechadas: (state) => state.ordens.filter((o) => o.data_liberacao),

    totalOrdens: (state) => state.ordens.length,

    isCacheValid: (state) => {
      if (!state.lastFetch) return false;
      return Date.now() - state.lastFetch < state.cacheTimeout;
    },

    getOrdemById: (state) => {
      return (id: number) => state.ordens.find((o) => o.id === id);
    },

    getSolicitanteById: (state) => {
      return (id: number) => state.solicitantes.find((s) => s.id === id);
    },

    getFuncionarioById: (state) => {
      return (id: number) => state.funcionarios.find((f) => f.id === id);
    },
  },

  actions: {
    setOrdens(ordens: OrdemServicoComRelacoes[]) {
      this.ordens = ordens;
      this.lastFetch = Date.now();
    },

    setSolicitantes(solicitantes: any[]) {
      this.solicitantes = solicitantes;
    },

    setFuncionarios(funcionarios: any[]) {
      this.funcionarios = funcionarios;
    },

    setFamilias(familias: any[]) {
      this.familias = familias;
    },

    setAtivos(ativos: any[]) {
      this.ativos = ativos;
    },

    addOrdem(ordem: OrdemServicoComRelacoes) {
      this.ordens.unshift(ordem);
    },

    updateOrdem(id: number, updates: Partial<OrdemServicoComRelacoes>) {
      const index = this.ordens.findIndex((o) => o.id === id);
      if (index !== -1 && updates) {
        const ordem = this.ordens[index];
        if (ordem) {
          Object.assign(ordem, updates);
        }
      }
    },

    removeOrdem(id: number) {
      this.ordens = this.ordens.filter((o) => o.id !== id);
    },

    invalidateCache() {
      this.lastFetch = null;
    },

    clearAll() {
      this.$reset();
    },
  },
});
