export interface Familia {
  id: number;
  codigo: string;
  familia: string;
  codFamilia?: string;
  created_at?: string;
}

export interface Ativo {
  id: number;
  codigo: string;
  nome: string;
  familia_id: number;
  created_at?: string;
}

export interface Solicitante {
  id: number;
  nome: string;
  email?: string;
  created_at?: string;
}

export interface Funcionario {
  id: number;
  nome: string;
  funcao?: string;
  created_at?: string;
}

export interface Insumo {
  peca: string;
  quantidade: number;
  requisicao: string;
  custo: number;
}

export type TipoOS = "PREVENTIVA" | "CORRETIVA";
export type CategoriaServico =
  | "MECÂNICO"
  | "ELÉTRICO"
  | "HIDRÁULICO"
  | "MANUTENÇÃO PREDIAL"
  | "SOLDA"
  | "PINTURA";

export interface OrdemServico {
  id?: number;
  numero: number;

  // Preenchimento do Solicitante
  tipo_os: TipoOS;
  categoria_servico: CategoriaServico;
  sintoma_defeito: string;

  familia_id: number;
  ativo_id: number;
  solicitante_id: number;
  data_solicitacao: string;

  // Recebimento da Manutenção
  recebido_por_id?: number;
  data_recebimento?: string;
  hora_recebimento?: string;

  // Execução do Serviço
  descricao_servico?: string;
  executor_id?: number;

  // Insumos Utilizados
  insumos?: Insumo[];

  // Observações e Tempo
  observacoes?: string;
  data_inicio?: string;
  tempo_inicio?: string;
  data_fim?: string;
  tempo_fim?: string;

  // Manutenção
  dados_manutencao_preenchidos?: boolean;

  // Encerramento
  custos_concluidos?: boolean;
  custo_total?: number;
  liberado_operacao?: boolean;
  data_liberacao?: string;
  aprovado_por?: number;

  // Metadata
  created_at?: string;
  updated_at?: string;
}

export interface OrdemServicoComRelacoes extends OrdemServico {
  familia?: Familia;
  ativo?: Ativo;
  solicitante?: Solicitante;
  recebido_por?: Funcionario;
  executor?: Funcionario;
}
