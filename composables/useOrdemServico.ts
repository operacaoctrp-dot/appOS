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

    const { data, error } = await supabase
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
      .order("numero", { ascending: false });

    if (error) {
      console.error("Erro ao listar ordens:", error);
      return [];
    }

    return (data as OrdemServicoComRelacoes[]) || [];
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

    const { data, error, count } = await query;

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
  };

  // Buscar ordem de serviço por ID
  const buscarOrdem = async (
    id: number
  ): Promise<OrdemServicoComRelacoes | null> => {
    try {
      console.log(`[buscarOrdem] Iniciando busca da ordem com ID: ${id}`);

      // Primeira query: dados principais - query simples
      console.log("[buscarOrdem] Query 1: Buscando dados principais...");
      console.time("[buscarOrdem] Query 1 tempo");
      
      const { data: mainData, error: mainError, status } = await supabase
        .from("ordens_servico")
        .select("id,numero,sintoma_defeito,familia_id,ativo_id,solicitante_id,recebido_por_id,executor_id,descricao_servico,insumos,observacoes,data_inicio,tempo_inicio,data_fim,tempo_fim,dados_manutencao_preenchidos")
        .eq("id", id)
        .maybeSingle();

      console.timeEnd("[buscarOrdem] Query 1 tempo");
      console.log("[buscarOrdem] Query 1 status:", status);

      if (mainError) {
        console.error("[buscarOrdem] Erro na query principal:", mainError);
        console.error("[buscarOrdem] Erro detalhado:", JSON.stringify(mainError));
        return null;
      }

      if (!mainData) {
        console.error(
          "[buscarOrdem] Ordem de serviço não encontrada para ID:",
          id
        );
        return null;
      }

      console.log("[buscarOrdem] Dados principais encontrados:", mainData);
      let resultado: any = mainData;

      // Segunda query: familia
      console.log("[buscarOrdem] Query 2: Buscando família...");
      if (mainData.familia_id) {
        const { data: familiaData } = await supabase
          .from("familias")
          .select("*")
          .eq("id", mainData.familia_id)
          .maybeSingle();
        if (familiaData) {
          resultado.familia = familiaData;
          console.log("[buscarOrdem] Família encontrada");
        }
      }

      // Terceira query: ativo
      console.log("[buscarOrdem] Query 3: Buscando ativo...");
      if (mainData.ativo_id) {
        const { data: ativoData } = await supabase
          .from("ativos")
          .select("*")
          .eq("id", mainData.ativo_id)
          .maybeSingle();
        if (ativoData) {
          resultado.ativo = ativoData;
          console.log("[buscarOrdem] Ativo encontrado");
        }
      }

      // Quarta query: solicitante
      console.log("[buscarOrdem] Query 4: Buscando solicitante...");
      if (mainData.solicitante_id) {
        const { data: solicitanteData } = await supabase
          .from("solicitantes")
          .select("*")
          .eq("id", mainData.solicitante_id)
          .maybeSingle();
        if (solicitanteData) {
          resultado.solicitante = solicitanteData;
          console.log("[buscarOrdem] Solicitante encontrado");
        }
      }

      // Quinta query: recebido por
      console.log("[buscarOrdem] Query 5: Buscando quem recebeu...");
      if (mainData.recebido_por_id) {
        const { data: recebidoData } = await supabase
          .from("funcionarios")
          .select("*")
          .eq("id", mainData.recebido_por_id)
          .maybeSingle();
        if (recebidoData) {
          resultado.recebido_por = recebidoData;
          console.log("[buscarOrdem] Recebido por encontrado");
        }
      }

      // Sexta query: executor
      console.log("[buscarOrdem] Query 6: Buscando executor...");
      if (mainData.executor_id) {
        const { data: executorData } = await supabase
          .from("funcionarios")
          .select("*")
          .eq("id", mainData.executor_id)
          .maybeSingle();
        if (executorData) {
          resultado.executor = executorData;
          console.log("[buscarOrdem] Executor encontrado");
        }
      }

      // Sétima query: executores da tabela de relacionamento
      console.log("[buscarOrdem] Query 7: Carregando executores...");
      const { data: executoresData, error: execError } = await supabase
        .from("ordem_servico_executores")
        .select(
          `
          funcionario_id,
          ordem,
          funcionario:funcionarios(*)
        `
        )
        .eq("ordem_servico_id", id)
        .order("ordem");

      if (execError) {
        console.warn("[buscarOrdem] Erro ao carregar executores:", execError);
      } else if (executoresData && executoresData.length > 0) {
        console.log(
          "[buscarOrdem] Executores carregados:",
          executoresData.length
        );
        resultado.executores = executoresData.map((e: any) => e.funcionario);
      } else {
        console.log("[buscarOrdem] Nenhum executor encontrado");
      }

      console.log("[buscarOrdem] Retornando ordem com sucesso");
      return resultado as OrdemServicoComRelacoes;
    } catch (err) {
      console.error("[buscarOrdem] Exceção:", err);
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
    const { data, error } = await supabase
      .from("familias")
      .select("*")
      .order("codigo");

    if (error) {
      console.error("Erro ao listar famílias:", error);
      return [];
    }

    return data || [];
  };

  // Buscar ativos por família
  const listarAtivosPorFamilia = async (
    familiaId: number
  ): Promise<Ativo[]> => {
    const { data, error } = await supabase
      .from("ativos")
      .select("*")
      .eq("familia_id", familiaId)
      .order("codigo");

    if (error) {
      console.error("Erro ao listar ativos:", error);
      return [];
    }

    return data || [];
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
    const { data, error } = await supabase
      .from("solicitantes")
      .select("*")
      .order("nome");

    if (error) {
      console.error("Erro ao listar solicitantes:", error);
      return [];
    }

    return data || [];
  };

  // Buscar funcionários
  const listarFuncionarios = async (): Promise<Funcionario[]> => {
    const { data, error } = await supabase
      .from("funcionarios")
      .select("*")
      .order("nome");

    if (error) {
      console.error("Erro ao listar funcionários:", error);
      return [];
    }

    return data || [];
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
