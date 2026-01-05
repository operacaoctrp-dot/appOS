import type {
  OrdemServico,
  OrdemServicoComRelacoes,
  Familia,
  Ativo,
  Solicitante,
  Funcionario,
} from "~/types/ordem-servico";

export const useOrdemServico = () => {
  const supabase = useSupabase();
  const { refreshSession } = useAuth();

  // Helper para adicionar timeout a qualquer requisição do Supabase
  const withTimeout = async <T>(
    promise: Promise<T>,
    timeoutMs: number = 30000 // 30 segundos ao invés de 8
  ): Promise<T> => {
    const timeoutPromise = new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Requisição expirou após ${timeoutMs}ms`)),
        timeoutMs
      )
    );
    return Promise.race([promise, timeoutPromise]);
  };

  // Garantir que a sessão está válida antes de fazer requisição
  // Com timeout curto para não bloquear
  const ensureSessionBeforeRequest = async () => {
    try {
      // Timeout de 2 segundos - se não conseguir renovar, segue em frente
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 2000)
      );

      const sessionPromise = refreshSession();
      await Promise.race([sessionPromise, timeoutPromise]);
      console.log("Sessão renovada com sucesso");
    } catch (error) {
      // Se falhar ou timeout, apenas log e continua
      console.warn("Não foi possível renovar sessão, continuando...", error);
    }
  };

  // Buscar próximo número de OS
  const getProximoNumero = async (): Promise<number> => {
    const { data, error } = await supabase
      .from("ordens_servico")
      .select("numero")
      .order("numero", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Erro ao buscar próximo número:", error);
      return 1;
    }

    return data ? data.numero + 1 : 1;
  };

  // Listar todas as ordens de serviço com relações
  const listarOrdens = async (): Promise<OrdemServicoComRelacoes[]> => {
    console.log("Carregando lista de ordens...");

    // Garantir sessão válida antes de fazer a requisição
    await ensureSessionBeforeRequest();

    try {
      const { data, error } = await withTimeout(
        supabase
          .from("ordens_servico")
          .select(
            `
            *,
            familia:familias(*),
            ativo:ativos(*),
            solicitante:solicitantes(*),
            recebido_por:funcionarios!ordens_servico_recebido_por_id_fkey(*),
            executor:funcionarios!ordens_servico_executor_id_fkey(*)
          `
          )
          .order("numero", { ascending: false })
      );

      if (error) {
        console.error("Erro ao listar ordens:", error);
        return [];
      }

      return (data as OrdemServicoComRelacoes[]) || [];
    } catch (error) {
      console.error("Erro ao listar ordens (timeout ou erro):", error);
      return [];
    }
  };

  // Listar ordens de serviço com paginação e busca
  const listarOrdensPaginado = async (
    page: number = 1,
    pageSize: number = 20,
    filtroStatus?: "aberta" | "fechada",
    searchTerm?: string,
    filtroTipo?: string,
    filtroCategoria?: string,
    filtroDataInicio?: string,
    filtroDataFim?: string
  ): Promise<{
    data: OrdemServicoComRelacoes[];
    totalCount: number;
    totalPages: number;
  }> => {
    console.log(`Carregando página ${page} (${pageSize} itens)...`);

    // Garantir sessão válida antes de fazer a requisição
    await ensureSessionBeforeRequest();

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase.from("ordens_servico").select(
      `
        *,
        familia:familias(*),
        ativo:ativos(*),
        solicitante:solicitantes(*),
        recebido_por:funcionarios!ordens_servico_recebido_por_id_fkey(*),
        executor:funcionarios!ordens_servico_executor_id_fkey(*)
      `,
      { count: "exact" }
    );

    // Aplicar filtro de status
    if (filtroStatus === "aberta") {
      query = query.is("data_liberacao", null);
    } else if (filtroStatus === "fechada") {
      query = query.not("data_liberacao", "is", null);
    }

    // Aplicar filtro de tipo
    if (filtroTipo) {
      query = query.eq("tipo_os", filtroTipo);
    }

    // Aplicar filtro de categoria
    if (filtroCategoria) {
      query = query.eq("categoria_servico", filtroCategoria);
    }

    // Aplicar filtro de data início
    if (filtroDataInicio) {
      query = query.gte("data_abertura", filtroDataInicio);
    }

    // Aplicar filtro de data fim
    if (filtroDataFim) {
      query = query.lte("data_abertura", filtroDataFim);
    }

    // Aplicar busca textual (backend search)
    if (searchTerm && searchTerm.trim()) {
      // Busca por número (exato)
      if (!isNaN(Number(searchTerm))) {
        query = query.eq("numero", Number(searchTerm));
      } else {
        // Busca textual em sintoma_defeito
        query = query.ilike("sintoma_defeito", `%${searchTerm}%`);
      }
    }

    query = query.order("numero", { ascending: false }).range(from, to);

    try {
      const { data, error, count } = await withTimeout(query);

      if (error) {
        console.error("Erro ao listar ordens paginado:", error);
        return { data: [], totalCount: 0, totalPages: 0 };
      }

      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / pageSize);

      console.log(
        `Ordens carregadas: ${
          data?.length || 0
        } de ${totalCount} registros (página ${page}/${totalPages})`
      );

      return {
        data: (data as OrdemServicoComRelacoes[]) || [],
        totalCount,
        totalPages,
      };
    } catch (error) {
      console.error("Erro ao listar ordens (timeout ou erro):", error);
      return { data: [], totalCount: 0, totalPages: 0 };
    }
  };

  // Buscar ordem de serviço por ID
  const buscarOrdem = async (
    id: number
  ): Promise<OrdemServicoComRelacoes | null> => {
    // Garantir sessão válida antes de fazer a requisição
    await ensureSessionBeforeRequest();

    try {
      const { data, error } = await withTimeout(
        supabase
          .from("ordens_servico")
          .select(
            `
            *,
            familia:familias(*),
            ativo:ativos(*),
            solicitante:solicitantes(*),
            recebido_por:funcionarios!ordens_servico_recebido_por_id_fkey(*),
            executor:funcionarios!ordens_servico_executor_id_fkey(*)
          `
          )
          .eq("id", id)
          .single()
      );

      if (error) {
        console.error("Erro ao buscar ordem:", error);
        return null;
      }

      // Buscar executores da tabela de relacionamento
      if (data) {
        const { data: executoresData, error: execError } = await withTimeout(
          supabase
            .from("ordem_servico_executores")
            .select(
              `
            funcionario_id,
            ordem,
          funcionario:funcionarios(*)
        `
            )
            .eq("ordem_servico_id", id)
            .order("ordem")
        );

        if (!execError && executoresData) {
          (data as any).executores = executoresData.map(
            (e: any) => e.funcionario
          );
        }
      }

      return data;
    } catch (error) {
      console.error("Erro ao buscar ordem (timeout ou erro):", error);
      return null;
    }
  };

  // Criar nova ordem de serviço
  const criarOrdem = async (
    ordem: OrdemServico,
    executores?: number[]
  ): Promise<OrdemServico | null> => {
    console.log("Criando ordem:", ordem);
    console.log("Executores:", executores);

    const { data, error } = await supabase
      .from("ordens_servico")
      .insert([ordem])
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar ordem:", error);
      return null;
    }

    console.log("Ordem criada com sucesso:", data);

    // Salvar executores na tabela de relacionamento (se a tabela existir)
    if (data && executores && executores.length > 0) {
      const executoresValidos = executores.filter((id) => id !== undefined);
      if (executoresValidos.length > 0) {
        const executoresData = executoresValidos.map(
          (funcionario_id, index) => ({
            ordem_servico_id: data.id,
            funcionario_id,
            ordem: index + 1,
          })
        );

        try {
          const { error: execError } = await supabase
            .from("ordem_servico_executores")
            .insert(executoresData);

          if (execError) {
            console.warn(
              "Aviso: Não foi possível salvar executores na tabela de relacionamento. Execute a migration primeiro.",
              execError
            );
            // Não falha a operação principal
          } else {
            console.log("Executores salvos com sucesso");
          }
        } catch (e) {
          console.warn(
            "Tabela ordem_servico_executores não existe ainda. Execute a migration."
          );
        }
      }
    }

    return data;
  };

  // Atualizar ordem de serviço
  const atualizarOrdem = async (
    id: number,
    ordem: Partial<OrdemServico>
  ): Promise<boolean> => {
    console.log("Atualizando ordem:", id, "com dados:", ordem);

    const { data, error } = await supabase
      .from("ordens_servico")
      .update(ordem)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Erro ao atualizar ordem:", error);
      console.error("Detalhes do erro:", JSON.stringify(error, null, 2));
      return false;
    }

    console.log("Ordem atualizada com sucesso:", data);
    return true;
  };

  // Deletar ordem de serviço
  const deletarOrdem = async (id: number): Promise<boolean> => {
    console.log("Tentando deletar ordem com ID:", id);

    const { error } = await supabase
      .from("ordens_servico")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao deletar ordem:", error);
      return false;
    }

    console.log("Ordem deletada com sucesso!");
    return true;
  };

  // Buscar famílias
  const listarFamilias = async (): Promise<Familia[]> => {
    await ensureSessionBeforeRequest();
    try {
      const { data, error } = await withTimeout(
        supabase.from("familias").select("*").order("codigo")
      );

      if (error) {
        console.error("Erro ao listar famílias:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Erro ao listar famílias (timeout):", error);
      return [];
    }
  };

  // Buscar ativos por família
  const listarAtivosPorFamilia = async (
    familiaId: number
  ): Promise<Ativo[]> => {
    await ensureSessionBeforeRequest();
    try {
      const { data, error } = await withTimeout(
        supabase
          .from("ativos")
          .select("*")
          .eq("familia_id", familiaId)
          .order("codigo")
      );

      if (error) {
        console.error("Erro ao listar ativos:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Erro ao listar ativos (timeout):", error);
      return [];
    }
  };

  // Buscar todos os ativos
  const listarAtivos = async (): Promise<Ativo[]> => {
    const { data, error } = await supabase
      .from("ativos")
      .select("*")
      .order("codigo");

    if (error) {
      console.error("Erro ao listar ativos:", error);
      return [];
    }

    return data || [];
  };

  // Buscar solicitantes
  const listarSolicitantes = async (): Promise<Solicitante[]> => {
    try {
      const { data, error } = await withTimeout(
        supabase.from("solicitantes").select("*").order("nome")
      );

      if (error) {
        console.error("Erro ao listar solicitantes:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Erro ao listar solicitantes (timeout):", error);
      return [];
    }
  };

  // Buscar funcionários
  const listarFuncionarios = async (): Promise<Funcionario[]> => {
    try {
      const { data, error } = await withTimeout(
        supabase.from("funcionarios").select("*").order("nome")
      );

      if (error) {
        console.error("Erro ao listar funcionários:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Erro ao listar funcionários (timeout):", error);
      return [];
    }
  };

  return {
    getProximoNumero,
    listarOrdens,
    listarOrdensPaginado,
    buscarOrdem,
    criarOrdem,
    atualizarOrdem,
    deletarOrdem,
    listarFamilias,
    listarAtivos,
    listarAtivosPorFamilia,
    listarSolicitantes,
    listarFuncionarios,
  };
};
