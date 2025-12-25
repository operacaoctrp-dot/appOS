-- Script para adicionar suporte a múltiplos executores
-- Cria uma tabela de relacionamento entre ordens de serviço e executores

-- Criar tabela de relacionamento
CREATE TABLE IF NOT EXISTS public.ordem_servico_executores (
  id SERIAL NOT NULL,
  ordem_servico_id INTEGER NOT NULL,
  funcionario_id INTEGER NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT ordem_servico_executores_pkey PRIMARY KEY (id),
  CONSTRAINT ordem_servico_executores_ordem_fkey FOREIGN KEY (ordem_servico_id) REFERENCES ordens_servico (id) ON DELETE CASCADE,
  CONSTRAINT ordem_servico_executores_funcionario_fkey FOREIGN KEY (funcionario_id) REFERENCES funcionarios (id),
  CONSTRAINT unique_ordem_executor UNIQUE (ordem_servico_id, funcionario_id)
) TABLESPACE pg_default;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_ordem_servico_executores_ordem ON public.ordem_servico_executores USING btree (ordem_servico_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_ordem_servico_executores_funcionario ON public.ordem_servico_executores USING btree (funcionario_id) TABLESPACE pg_default;

-- Migrar dados existentes (se houver)
-- Copia o executor_id atual para a tabela de relacionamento
INSERT INTO public.ordem_servico_executores (ordem_servico_id, funcionario_id, ordem)
SELECT id, executor_id, 1
FROM public.ordens_servico
WHERE executor_id IS NOT NULL
ON CONFLICT (ordem_servico_id, funcionario_id) DO NOTHING;

-- Comentário: O campo executor_id na tabela ordens_servico pode ser mantido 
-- para compatibilidade, ou removido depois da migração estar completa
