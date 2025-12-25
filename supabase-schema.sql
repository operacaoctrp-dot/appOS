-- Schema para o Sistema de Ordem de Serviço
-- Execute este SQL no Supabase SQL Editor

-- Remover tabelas existentes se necessário (cuidado em produção!)
DROP TABLE IF EXISTS ordens_servico CASCADE;
DROP TABLE IF EXISTS ativos CASCADE;
DROP TABLE IF EXISTS familias CASCADE;
DROP TABLE IF EXISTS solicitantes CASCADE;
DROP TABLE IF EXISTS funcionarios CASCADE;

-- Tabela de Famílias
CREATE TABLE IF NOT EXISTS familias (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabela de Ativos
CREATE TABLE IF NOT EXISTS ativos (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  familia_id INTEGER REFERENCES familias(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabela de Solicitantes
CREATE TABLE IF NOT EXISTS solicitantes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabela de Funcionários/Executores
CREATE TABLE IF NOT EXISTS funcionarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  funcao VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabela de Ordens de Serviço
CREATE TABLE IF NOT EXISTS ordens_servico (
  id SERIAL PRIMARY KEY,
  numero INTEGER UNIQUE NOT NULL,
  
  -- Preenchimento do Solicitante
  tipo_os VARCHAR(20) CHECK (tipo_os IN ('PREVENTIVA', 'CORRETIVA')),
  categoria_servico VARCHAR(50) CHECK (categoria_servico IN ('MECÂNICO', 'ELÉTRICO', 'HIDRÁULICO', 'MANUTENÇÃO PREDIAL', 'SOLDA', 'PINTURA')),
  sintoma_defeito TEXT,
  
  familia_id INTEGER REFERENCES familias(id),
  ativo_id INTEGER REFERENCES ativos(id),
  solicitante_id INTEGER REFERENCES solicitantes(id),
  data_solicitacao DATE NOT NULL,
  
  -- Recebimento da Manutenção
  recebido_por_id INTEGER REFERENCES funcionarios(id),
  data_recebimento DATE,
  hora_recebimento TIME,
  
  -- Execução do Serviço
  descricao_servico TEXT,
  executor_id INTEGER REFERENCES funcionarios(id),
  
  -- Insumos Utilizados
  insumos JSONB DEFAULT '[]'::jsonb,
  
  -- Observações e Tempo
  observacoes TEXT,
  tempo_inicio TIME,
  tempo_fim TIME,
  
  -- Encerramento
  custos_concluidos BOOLEAN DEFAULT false,
  custo_total DECIMAL(10,2),
  liberado_operacao BOOLEAN DEFAULT false,
  data_liberacao DATE,
  aprovado_por VARCHAR(255),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Inserir dados de exemplo
INSERT INTO familias (codigo, nome) VALUES 
  ('38', '38 - PREDIAL'),
  ('40', '40 - EQUIPAMENTOS'),
  ('50', '50 - VEÍCULOS');

INSERT INTO ativos (codigo, nome, familia_id) VALUES 
  ('38.001', '38.001 - PREDIAL', 1),
  ('40.001', '40.001 - BOMBA POÇO', 1),
  ('50.001', '50.001 - CAMINHÃO', 3);

INSERT INTO solicitantes (nome, email) VALUES 
  ('LORENA SANTOS QUEIROZ', 'lorena@marquiseambiental.com'),
  ('RAIMUNDO VIEIRA DE OLIVEIRA', 'raimundo@marquiseambiental.com');

INSERT INTO funcionarios (nome, funcao) VALUES 
  ('RAIMUNDO VIEIRA DE OLIVEIRA', 'MECÂNICO II'),
  ('JOÃO SILVA', 'ELETRICISTA'),
  ('MARIA SANTOS', 'MECÂNICO I');

-- Criar índices para melhor performance
CREATE INDEX idx_ordens_servico_numero ON ordens_servico(numero);
CREATE INDEX idx_ordens_servico_data ON ordens_servico(data_solicitacao);
CREATE INDEX idx_ativos_familia ON ativos(familia_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ordens_servico_updated_at BEFORE UPDATE ON ordens_servico
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - Opcional
ALTER TABLE ordens_servico ENABLE ROW LEVEL SECURITY;
ALTER TABLE familias ENABLE ROW LEVEL SECURITY;
ALTER TABLE ativos ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público (ajuste conforme necessário)
CREATE POLICY "Enable read access for all users" ON ordens_servico FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON ordens_servico FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON ordens_servico FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON familias FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON ativos FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON solicitantes FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON funcionarios FOR SELECT USING (true);
