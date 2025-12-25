import type { OrdemServicoComRelacoes } from "~/types/ordem-servico";

export const useOrdemServicoCache = () => {
  const store = useOrdemServicoStore();
  const {
    listarOrdens,
    listarSolicitantes,
    listarFuncionarios,
    listarFamilias,
  } = useOrdemServico();

  const carregarOrdensComCache = async (
    forceRefresh = false
  ): Promise<OrdemServicoComRelacoes[]> => {
    // Se o cache é válido e não forçou refresh, retorna do cache
    if (!forceRefresh && store.isCacheValid && store.ordens.length > 0) {
      console.log("📦 Retornando ordens do cache");
      return store.ordens;
    }

    console.log("🔄 Buscando ordens do servidor");
    const ordens = await listarOrdens();
    store.setOrdens(ordens);
    return ordens;
  };

  const carregarSolicitantesComCache = async (forceRefresh = false) => {
    if (!forceRefresh && store.solicitantes.length > 0) {
      console.log("📦 Retornando solicitantes do cache");
      return store.solicitantes;
    }

    console.log("🔄 Buscando solicitantes do servidor");
    const solicitantes = await listarSolicitantes();
    store.setSolicitantes(solicitantes);
    return solicitantes;
  };

  const carregarFuncionariosComCache = async (forceRefresh = false) => {
    if (!forceRefresh && store.funcionarios.length > 0) {
      console.log("📦 Retornando funcionários do cache");
      return store.funcionarios;
    }

    console.log("🔄 Buscando funcionários do servidor");
    const funcionarios = await listarFuncionarios();
    store.setFuncionarios(funcionarios);
    return funcionarios;
  };

  const carregarFamiliasComCache = async (forceRefresh = false) => {
    if (!forceRefresh && store.familias.length > 0) {
      console.log("📦 Retornando famílias do cache");
      return store.familias;
    }

    console.log("🔄 Buscando famílias do servidor");
    const familias = await listarFamilias();
    store.setFamilias(familias);
    return familias;
  };

  return {
    store,
    carregarOrdensComCache,
    carregarSolicitantesComCache,
    carregarFuncionariosComCache,
    carregarFamiliasComCache,
  };
};
