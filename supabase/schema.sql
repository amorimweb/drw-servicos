-- ============================================
-- DRW SERVIÇOS - SCHEMA COMPLETO PARA SUPABASE
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- Habilitar extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABELAS
-- ============================================

-- 1. USERS
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'cliente', 'prestador')),
  avatar TEXT,
  cpf VARCHAR(14),
  cnpj VARCHAR(18),
  status VARCHAR(20) DEFAULT 'standby' CHECK (status IN ('aprovado', 'standby', 'rejeitado')),
  especialidades TEXT[],
  avaliacao_media DECIMAL(3,2) DEFAULT 0.00,
  total_avaliacoes INTEGER DEFAULT 0,
  online BOOLEAN DEFAULT false,
  localizacao_latitude DECIMAL(10,8),
  localizacao_longitude DECIMAL(11,8),
  localizacao_endereco TEXT,
  endereco_rua VARCHAR(255),
  endereco_numero VARCHAR(20),
  endereco_complemento VARCHAR(100),
  endereco_bairro VARCHAR(100),
  endereco_cidade VARCHAR(100),
  endereco_estado VARCHAR(2),
  endereco_cep VARCHAR(10),
  endereco_latitude DECIMAL(10,8),
  endereco_longitude DECIMAL(11,8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SERVICOS
CREATE TABLE servicos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  imagem TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  observacoes TEXT,
  prazo_uso INTEGER NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  permite_pacote BOOLEAN DEFAULT false,
  permite_recorrencia BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. COMPRAS
CREATE TABLE compras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE RESTRICT,
  quantidade INTEGER NOT NULL DEFAULT 1,
  valor_total DECIMAL(10,2) NOT NULL,
  forma_pagamento VARCHAR(20) NOT NULL CHECK (forma_pagamento IN ('pix', 'cartao', 'boleto')),
  parcelas INTEGER,
  recorrencia BOOLEAN DEFAULT false,
  status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'paga', 'cancelada')),
  data_compra TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_vencimento TIMESTAMP WITH TIME ZONE,
  servicos_utilizados INTEGER DEFAULT 0,
  servicos_disponiveis INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. AGENDAMENTOS
CREATE TABLE agendamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  compra_id UUID NOT NULL REFERENCES compras(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prestador_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE RESTRICT,
  data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
  endereco_rua VARCHAR(255) NOT NULL,
  endereco_numero VARCHAR(20) NOT NULL,
  endereco_complemento VARCHAR(100),
  endereco_bairro VARCHAR(100) NOT NULL,
  endereco_cidade VARCHAR(100) NOT NULL,
  endereco_estado VARCHAR(2) NOT NULL,
  endereco_cep VARCHAR(10) NOT NULL,
  endereco_latitude DECIMAL(10,8),
  endereco_longitude DECIMAL(11,8),
  status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aceito', 'em_andamento', 'concluido', 'cancelado')),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. EXECUCAO_SERVICOS
CREATE TABLE execucao_servicos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agendamento_id UUID UNIQUE NOT NULL REFERENCES agendamentos(id) ON DELETE CASCADE,
  fotos_iniciais TEXT[],
  fotos_durante TEXT[],
  fotos_finais TEXT[],
  observacoes_iniciais TEXT,
  observacoes_durante TEXT,
  observacoes_finais TEXT,
  iniciado_em TIMESTAMP WITH TIME ZONE,
  finalizado_em TIMESTAMP WITH TIME ZONE,
  confirmado_por_cliente BOOLEAN DEFAULT false,
  confirmado_em TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. AVALIACOES
CREATE TABLE avaliacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agendamento_id UUID UNIQUE NOT NULL REFERENCES agendamentos(id) ON DELETE CASCADE,
  prestador_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  data_avaliacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. RECLAMACOES
CREATE TABLE reclamacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agendamento_id UUID NOT NULL REFERENCES agendamentos(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prestador_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  motivo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'aberta' CHECK (status IN ('aberta', 'em_analise', 'resolvida', 'fechada')),
  resolucao TEXT,
  data_abertura TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_resolucao TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. MENSAGENS
CREATE TABLE mensagens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agendamento_id UUID NOT NULL REFERENCES agendamentos(id) ON DELETE CASCADE,
  remetente_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  destinatario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  conteudo TEXT NOT NULL,
  tipo VARCHAR(20) NOT NULL DEFAULT 'texto' CHECK (tipo IN ('texto', 'whatsapp')),
  lida BOOLEAN DEFAULT false,
  data_envio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. TRANSACOES_FINANCEIRAS
CREATE TABLE transacoes_financeiras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prestador_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  agendamento_id UUID NOT NULL REFERENCES agendamentos(id) ON DELETE CASCADE,
  valor DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'cancelado')),
  data_servico TIMESTAMP WITH TIME ZONE NOT NULL,
  data_pagamento TIMESTAMP WITH TIME ZONE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. PACOTES_SERVICOS
CREATE TABLE pacotes_servicos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
  quantidade INTEGER NOT NULL,
  bonus INTEGER DEFAULT 0,
  desconto DECIMAL(5,2) DEFAULT 0.00,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ÍNDICES
-- ============================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status) WHERE role = 'prestador';
CREATE INDEX idx_users_online ON users(online) WHERE role = 'prestador';

-- Servicos
CREATE INDEX idx_servicos_categoria ON servicos(categoria);
CREATE INDEX idx_servicos_ativo ON servicos(ativo);

-- Compras
CREATE INDEX idx_compras_cliente ON compras(cliente_id);
CREATE INDEX idx_compras_servico ON compras(servico_id);
CREATE INDEX idx_compras_status ON compras(status);
CREATE INDEX idx_compras_data_compra ON compras(data_compra);

-- Agendamentos
CREATE INDEX idx_agendamentos_cliente ON agendamentos(cliente_id);
CREATE INDEX idx_agendamentos_prestador ON agendamentos(prestador_id);
CREATE INDEX idx_agendamentos_compra ON agendamentos(compra_id);
CREATE INDEX idx_agendamentos_status ON agendamentos(status);
CREATE INDEX idx_agendamentos_data_hora ON agendamentos(data_hora);

-- Avaliacoes
CREATE INDEX idx_avaliacoes_prestador ON avaliacoes(prestador_id);
CREATE INDEX idx_avaliacoes_cliente ON avaliacoes(cliente_id);
CREATE INDEX idx_avaliacoes_agendamento ON avaliacoes(agendamento_id);

-- Mensagens
CREATE INDEX idx_mensagens_agendamento ON mensagens(agendamento_id);
CREATE INDEX idx_mensagens_remetente ON mensagens(remetente_id);
CREATE INDEX idx_mensagens_destinatario ON mensagens(destinatario_id);
CREATE INDEX idx_mensagens_lida ON mensagens(lida);
CREATE INDEX idx_mensagens_data_envio ON mensagens(data_envio);

-- Transacoes
CREATE INDEX idx_transacoes_prestador ON transacoes_financeiras(prestador_id);
CREATE INDEX idx_transacoes_status ON transacoes_financeiras(status);
CREATE INDEX idx_transacoes_data_servico ON transacoes_financeiras(data_servico);

-- ============================================
-- FUNÇÕES E TRIGGERS
-- ============================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_servicos_updated_at BEFORE UPDATE ON servicos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compras_updated_at BEFORE UPDATE ON compras FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agendamentos_updated_at BEFORE UPDATE ON agendamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_execucao_servicos_updated_at BEFORE UPDATE ON execucao_servicos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reclamacoes_updated_at BEFORE UPDATE ON reclamacoes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transacoes_financeiras_updated_at BEFORE UPDATE ON transacoes_financeiras FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pacotes_servicos_updated_at BEFORE UPDATE ON pacotes_servicos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para atualizar média de avaliações
CREATE OR REPLACE FUNCTION update_prestador_avaliacao()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET 
    avaliacao_media = (
      SELECT AVG(nota)::DECIMAL(3,2)
      FROM avaliacoes
      WHERE prestador_id = NEW.prestador_id
    ),
    total_avaliacoes = (
      SELECT COUNT(*)
      FROM avaliacoes
      WHERE prestador_id = NEW.prestador_id
    )
  WHERE id = NEW.prestador_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_prestador_avaliacao_trigger
  AFTER INSERT OR UPDATE ON avaliacoes
  FOR EACH ROW
  EXECUTE FUNCTION update_prestador_avaliacao();

-- Função para atualizar serviços utilizados
CREATE OR REPLACE FUNCTION update_servicos_utilizados()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'concluido' AND (OLD.status IS NULL OR OLD.status != 'concluido') THEN
    UPDATE compras
    SET 
      servicos_utilizados = servicos_utilizados + 1,
      servicos_disponiveis = servicos_disponiveis - 1
    WHERE id = NEW.compra_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_servicos_utilizados_trigger
  AFTER UPDATE ON agendamentos
  FOR EACH ROW
  EXECUTE FUNCTION update_servicos_utilizados();

-- Função para criar transação financeira
CREATE OR REPLACE FUNCTION create_transacao_financeira()
RETURNS TRIGGER AS $$
DECLARE
  valor_servico DECIMAL(10,2);
BEGIN
  IF NEW.status = 'concluido' AND (OLD.status IS NULL OR OLD.status != 'concluido') THEN
    SELECT s.valor INTO valor_servico
    FROM servicos s
    WHERE s.id = NEW.servico_id;
    
    INSERT INTO transacoes_financeiras (
      prestador_id,
      agendamento_id,
      valor,
      status,
      data_servico
    ) VALUES (
      NEW.prestador_id,
      NEW.id,
      valor_servico,
      'pendente',
      NEW.data_hora
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_transacao_financeira_trigger
  AFTER UPDATE ON agendamentos
  FOR EACH ROW
  EXECUTE FUNCTION create_transacao_financeira();

-- ============================================
-- DADOS INICIAIS
-- ============================================

-- Inserir usuário administrador padrão
INSERT INTO users (id, nome, email, telefone, role, status)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Administrador',
  'admin@drw.com',
  '(11) 99999-9999',
  'admin',
  'aprovado'
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- IMPORTANTE: Configure as políticas RLS conforme necessário
-- Veja DATABASE.md para políticas detalhadas

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE execucao_servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reclamacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacoes_financeiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacotes_servicos ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajuste conforme necessário)
-- Users podem ver seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Serviços ativos são públicos
CREATE POLICY "Active services are public"
  ON servicos FOR SELECT
  USING (ativo = true);

-- Clientes podem ver suas compras
CREATE POLICY "Clients can view own purchases"
  ON compras FOR SELECT
  USING (cliente_id = auth.uid());

-- Clientes podem criar compras
CREATE POLICY "Clients can create purchases"
  ON compras FOR INSERT
  WITH CHECK (cliente_id = auth.uid());

-- Clientes podem ver seus agendamentos
CREATE POLICY "Clients can view own appointments"
  ON agendamentos FOR SELECT
  USING (cliente_id = auth.uid());

-- Prestadores podem ver seus agendamentos
CREATE POLICY "Prestadores can view own appointments"
  ON agendamentos FOR SELECT
  USING (prestador_id = auth.uid());

-- Usuários podem ver mensagens onde participam
CREATE POLICY "Users can view own messages"
  ON mensagens FOR SELECT
  USING (remetente_id = auth.uid() OR destinatario_id = auth.uid());

-- Prestadores podem ver suas transações
CREATE POLICY "Prestadores can view own transactions"
  ON transacoes_financeiras FOR SELECT
  USING (prestador_id = auth.uid());

-- ============================================
-- FIM DO SCRIPT
-- ============================================

