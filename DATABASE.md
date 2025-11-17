# 📊 Documentação do Banco de Dados - DRW Serviços

Documentação completa do schema do banco de dados Supabase para o sistema DRW Serviços.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Estrutura do Banco](#-estrutura-do-banco)
- [Tabelas](#-tabelas)
  - [users](#1-users)
  - [servicos](#2-servicos)
  - [compras](#3-compras)
  - [agendamentos](#4-agendamentos)
  - [execucao_servicos](#5-execucao_servicos)
  - [avaliacoes](#6-avaliacoes)
  - [reclamacoes](#7-reclamacoes)
  - [mensagens](#8-mensagens)
  - [transacoes_financeiras](#9-transacoes_financeiras)
  - [pacotes_servicos](#10-pacotes_servicos)
- [Relacionamentos](#-relacionamentos)
- [Índices](#-índices)
- [Políticas RLS (Row Level Security)](#-políticas-rls-row-level-security)
- [Triggers e Funções](#-triggers-e-funções)
- [Scripts SQL](#-scripts-sql)

---

## 🎯 Visão Geral

O banco de dados utiliza **PostgreSQL** (Supabase) e segue os princípios de normalização. O sistema suporta três tipos de usuários: **Clientes**, **Prestadores** e **Administradores**.

### Diagrama de Relacionamentos

```
users (1) ──< (N) compras
users (1) ──< (N) agendamentos
users (1) ──< (N) avaliacoes
users (1) ──< (N) reclamacoes
users (1) ──< (N) mensagens
users (1) ──< (N) transacoes_financeiras

servicos (1) ──< (N) compras
servicos (1) ──< (N) agendamentos
servicos (1) ──< (N) pacotes_servicos

compras (1) ──< (N) agendamentos

agendamentos (1) ──< (1) execucao_servicos
agendamentos (1) ──< (N) mensagens
agendamentos (1) ──< (1) avaliacoes
agendamentos (1) ──< (N) reclamacoes
agendamentos (1) ──< (1) transacoes_financeiras
```

---

## 🗄️ Estrutura do Banco

### Extensões Necessárias

```sql
-- Habilitar extensões do Supabase
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

---

## 📦 Tabelas

### 1. users

Tabela principal de usuários (clientes, prestadores e administradores).

```sql
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

-- Comentários
COMMENT ON TABLE users IS 'Tabela de usuários do sistema (clientes, prestadores e administradores)';
COMMENT ON COLUMN users.role IS 'Tipo de usuário: admin, cliente ou prestador';
COMMENT ON COLUMN users.status IS 'Status do prestador: aprovado, standby ou rejeitado';
COMMENT ON COLUMN users.especialidades IS 'Array de especialidades do prestador';
COMMENT ON COLUMN users.avaliacao_media IS 'Média das avaliações recebidas (0.00 a 5.00)';
```

### 2. servicos

Tabela de serviços/produtos disponíveis na plataforma.

```sql
CREATE TABLE servicos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  imagem TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  observacoes TEXT,
  prazo_uso INTEGER NOT NULL COMMENT 'Prazo de uso em dias',
  categoria VARCHAR(100) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  permite_pacote BOOLEAN DEFAULT false,
  permite_recorrencia BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comentários
COMMENT ON TABLE servicos IS 'Catálogo de serviços disponíveis na plataforma';
COMMENT ON COLUMN servicos.prazo_uso IS 'Prazo em dias para usar o serviço após a compra';
COMMENT ON COLUMN servicos.permite_pacote IS 'Se permite venda em pacotes com desconto';
COMMENT ON COLUMN servicos.permite_recorrencia IS 'Se permite assinatura recorrente';
```

### 3. compras

Tabela de compras realizadas pelos clientes.

```sql
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

-- Comentários
COMMENT ON TABLE compras IS 'Registro de compras de serviços pelos clientes';
COMMENT ON COLUMN compras.servicos_utilizados IS 'Quantidade de serviços já utilizados desta compra';
COMMENT ON COLUMN compras.servicos_disponiveis IS 'Quantidade de serviços ainda disponíveis para uso';
```

### 4. agendamentos

Tabela de agendamentos de serviços.

```sql
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

-- Comentários
COMMENT ON TABLE agendamentos IS 'Agendamentos de execução de serviços';
COMMENT ON COLUMN agendamentos.status IS 'Status do agendamento: pendente, aceito, em_andamento, concluido, cancelado';
```

### 5. execucao_servicos

Tabela de registro da execução do serviço pelo prestador.

```sql
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

-- Comentários
COMMENT ON TABLE execucao_servicos IS 'Registro completo da execução do serviço com fotos e observações';
COMMENT ON COLUMN execucao_servicos.fotos_iniciais IS 'Array de URLs das fotos tiradas antes do serviço';
COMMENT ON COLUMN execucao_servicos.fotos_durante IS 'Array de URLs das fotos tiradas durante o serviço';
COMMENT ON COLUMN execucao_servicos.fotos_finais IS 'Array de URLs das fotos tiradas após o serviço';
```

### 6. avaliacoes

Tabela de avaliações dos prestadores pelos clientes.

```sql
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

-- Comentários
COMMENT ON TABLE avaliacoes IS 'Avaliações dos prestadores feitas pelos clientes';
COMMENT ON COLUMN avaliacoes.nota IS 'Nota de 1 a 5 estrelas';
```

### 7. reclamacoes

Tabela de reclamações sobre serviços.

```sql
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

-- Comentários
COMMENT ON TABLE reclamacoes IS 'Reclamações dos clientes sobre serviços';
COMMENT ON COLUMN reclamacoes.status IS 'Status da reclamação: aberta, em_analise, resolvida, fechada';
```

### 8. mensagens

Tabela de mensagens entre cliente e prestador.

```sql
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

-- Comentários
COMMENT ON TABLE mensagens IS 'Mensagens trocadas entre cliente e prestador';
COMMENT ON COLUMN mensagens.tipo IS 'Tipo de mensagem: texto (plataforma) ou whatsapp';
```

### 9. transacoes_financeiras

Tabela de transações financeiras dos prestadores.

```sql
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

-- Comentários
COMMENT ON TABLE transacoes_financeiras IS 'Transações financeiras dos prestadores';
COMMENT ON COLUMN transacoes_financeiras.status IS 'Status do pagamento: pendente, pago, cancelado';
```

### 10. pacotes_servicos

Tabela de configuração de pacotes de serviços (opcional).

```sql
CREATE TABLE pacotes_servicos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
  quantidade INTEGER NOT NULL,
  bonus INTEGER DEFAULT 0 COMMENT 'Ex: compra 10 ganha 11',
  desconto DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Desconto em porcentagem',
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comentários
COMMENT ON TABLE pacotes_servicos IS 'Configuração de pacotes promocionais de serviços';
COMMENT ON COLUMN pacotes_servicos.bonus IS 'Quantidade de serviços bônus (ex: compra 10 ganha 11)';
COMMENT ON COLUMN pacotes_servicos.desconto IS 'Desconto em porcentagem para o pacote';
```

---

## 🔗 Relacionamentos

### Chaves Estrangeiras

```sql
-- users
ALTER TABLE compras ADD CONSTRAINT fk_compras_cliente 
  FOREIGN KEY (cliente_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE agendamentos ADD CONSTRAINT fk_agendamentos_cliente 
  FOREIGN KEY (cliente_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE agendamentos ADD CONSTRAINT fk_agendamentos_prestador 
  FOREIGN KEY (prestador_id) REFERENCES users(id) ON DELETE RESTRICT;

ALTER TABLE avaliacoes ADD CONSTRAINT fk_avaliacoes_prestador 
  FOREIGN KEY (prestador_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE avaliacoes ADD CONSTRAINT fk_avaliacoes_cliente 
  FOREIGN KEY (cliente_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE reclamacoes ADD CONSTRAINT fk_reclamacoes_cliente 
  FOREIGN KEY (cliente_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE reclamacoes ADD CONSTRAINT fk_reclamacoes_prestador 
  FOREIGN KEY (prestador_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE mensagens ADD CONSTRAINT fk_mensagens_remetente 
  FOREIGN KEY (remetente_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE mensagens ADD CONSTRAINT fk_mensagens_destinatario 
  FOREIGN KEY (destinatario_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE transacoes_financeiras ADD CONSTRAINT fk_transacoes_prestador 
  FOREIGN KEY (prestador_id) REFERENCES users(id) ON DELETE CASCADE;

-- servicos
ALTER TABLE compras ADD CONSTRAINT fk_compras_servico 
  FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE RESTRICT;

ALTER TABLE agendamentos ADD CONSTRAINT fk_agendamentos_servico 
  FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE RESTRICT;

ALTER TABLE pacotes_servicos ADD CONSTRAINT fk_pacotes_servico 
  FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE CASCADE;

-- compras
ALTER TABLE agendamentos ADD CONSTRAINT fk_agendamentos_compra 
  FOREIGN KEY (compra_id) REFERENCES compras(id) ON DELETE CASCADE;

-- agendamentos
ALTER TABLE execucao_servicos ADD CONSTRAINT fk_execucao_agendamento 
  FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id) ON DELETE CASCADE;

ALTER TABLE avaliacoes ADD CONSTRAINT fk_avaliacoes_agendamento 
  FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id) ON DELETE CASCADE;

ALTER TABLE reclamacoes ADD CONSTRAINT fk_reclamacoes_agendamento 
  FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id) ON DELETE CASCADE;

ALTER TABLE mensagens ADD CONSTRAINT fk_mensagens_agendamento 
  FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id) ON DELETE CASCADE;

ALTER TABLE transacoes_financeiras ADD CONSTRAINT fk_transacoes_agendamento 
  FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id) ON DELETE CASCADE;
```

---

## 📇 Índices

Índices para otimizar consultas frequentes.

```sql
-- users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status) WHERE role = 'prestador';
CREATE INDEX idx_users_online ON users(online) WHERE role = 'prestador';
CREATE INDEX idx_users_localizacao ON users USING GIST (
  point(localizacao_longitude, localizacao_latitude)
) WHERE role = 'prestador' AND localizacao_latitude IS NOT NULL;

-- servicos
CREATE INDEX idx_servicos_categoria ON servicos(categoria);
CREATE INDEX idx_servicos_ativo ON servicos(ativo);
CREATE INDEX idx_servicos_permite_pacote ON servicos(permite_pacote);
CREATE INDEX idx_servicos_permite_recorrencia ON servicos(permite_recorrencia);

-- compras
CREATE INDEX idx_compras_cliente ON compras(cliente_id);
CREATE INDEX idx_compras_servico ON compras(servico_id);
CREATE INDEX idx_compras_status ON compras(status);
CREATE INDEX idx_compras_data_compra ON compras(data_compra);

-- agendamentos
CREATE INDEX idx_agendamentos_cliente ON agendamentos(cliente_id);
CREATE INDEX idx_agendamentos_prestador ON agendamentos(prestador_id);
CREATE INDEX idx_agendamentos_compra ON agendamentos(compra_id);
CREATE INDEX idx_agendamentos_status ON agendamentos(status);
CREATE INDEX idx_agendamentos_data_hora ON agendamentos(data_hora);

-- avaliacoes
CREATE INDEX idx_avaliacoes_prestador ON avaliacoes(prestador_id);
CREATE INDEX idx_avaliacoes_cliente ON avaliacoes(cliente_id);
CREATE INDEX idx_avaliacoes_agendamento ON avaliacoes(agendamento_id);

-- mensagens
CREATE INDEX idx_mensagens_agendamento ON mensagens(agendamento_id);
CREATE INDEX idx_mensagens_remetente ON mensagens(remetente_id);
CREATE INDEX idx_mensagens_destinatario ON mensagens(destinatario_id);
CREATE INDEX idx_mensagens_lida ON mensagens(lida);
CREATE INDEX idx_mensagens_data_envio ON mensagens(data_envio);

-- transacoes_financeiras
CREATE INDEX idx_transacoes_prestador ON transacoes_financeiras(prestador_id);
CREATE INDEX idx_transacoes_status ON transacoes_financeiras(status);
CREATE INDEX idx_transacoes_data_servico ON transacoes_financeiras(data_servico);
```

---

## 🔒 Políticas RLS (Row Level Security)

### Habilitar RLS

```sql
-- Habilitar RLS em todas as tabelas
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
```

### Políticas para users

```sql
-- Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Admins podem ver todos os usuários
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Prestadores aprovados podem ser vistos por todos
CREATE POLICY "Approved prestadores are public"
  ON users FOR SELECT
  USING (role = 'prestador' AND status = 'aprovado');
```

### Políticas para servicos

```sql
-- Serviços ativos são públicos
CREATE POLICY "Active services are public"
  ON servicos FOR SELECT
  USING (ativo = true);

-- Admins podem gerenciar serviços
CREATE POLICY "Admins can manage services"
  ON servicos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Políticas para compras

```sql
-- Clientes podem ver suas próprias compras
CREATE POLICY "Clients can view own purchases"
  ON compras FOR SELECT
  USING (cliente_id = auth.uid());

-- Clientes podem criar compras
CREATE POLICY "Clients can create purchases"
  ON compras FOR INSERT
  WITH CHECK (cliente_id = auth.uid());

-- Admins podem ver todas as compras
CREATE POLICY "Admins can view all purchases"
  ON compras FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Políticas para agendamentos

```sql
-- Clientes podem ver seus agendamentos
CREATE POLICY "Clients can view own appointments"
  ON agendamentos FOR SELECT
  USING (cliente_id = auth.uid());

-- Prestadores podem ver seus agendamentos
CREATE POLICY "Prestadores can view own appointments"
  ON agendamentos FOR SELECT
  USING (prestador_id = auth.uid());

-- Clientes podem criar agendamentos
CREATE POLICY "Clients can create appointments"
  ON agendamentos FOR INSERT
  WITH CHECK (cliente_id = auth.uid());

-- Prestadores podem atualizar agendamentos
CREATE POLICY "Prestadores can update appointments"
  ON agendamentos FOR UPDATE
  USING (prestador_id = auth.uid());
```

### Políticas para mensagens

```sql
-- Usuários podem ver mensagens onde são remetente ou destinatário
CREATE POLICY "Users can view own messages"
  ON mensagens FOR SELECT
  USING (
    remetente_id = auth.uid() OR 
    destinatario_id = auth.uid()
  );

-- Usuários podem criar mensagens
CREATE POLICY "Users can create messages"
  ON mensagens FOR INSERT
  WITH CHECK (remetente_id = auth.uid());
```

### Políticas para transacoes_financeiras

```sql
-- Prestadores podem ver suas transações
CREATE POLICY "Prestadores can view own transactions"
  ON transacoes_financeiras FOR SELECT
  USING (prestador_id = auth.uid());

-- Admins podem gerenciar transações
CREATE POLICY "Admins can manage transactions"
  ON transacoes_financeiras FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## ⚙️ Triggers e Funções

### Atualizar updated_at automaticamente

```sql
-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em todas as tabelas com updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_servicos_updated_at
  BEFORE UPDATE ON servicos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compras_updated_at
  BEFORE UPDATE ON compras
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agendamentos_updated_at
  BEFORE UPDATE ON agendamentos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_execucao_servicos_updated_at
  BEFORE UPDATE ON execucao_servicos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reclamacoes_updated_at
  BEFORE UPDATE ON reclamacoes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transacoes_financeiras_updated_at
  BEFORE UPDATE ON transacoes_financeiras
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pacotes_servicos_updated_at
  BEFORE UPDATE ON pacotes_servicos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Atualizar média de avaliações

```sql
-- Função para atualizar média de avaliações do prestador
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

-- Trigger para atualizar avaliação ao inserir/atualizar avaliação
CREATE TRIGGER update_prestador_avaliacao_trigger
  AFTER INSERT OR UPDATE ON avaliacoes
  FOR EACH ROW
  EXECUTE FUNCTION update_prestador_avaliacao();
```

### Atualizar servicos utilizados

```sql
-- Função para atualizar contador de serviços utilizados
CREATE OR REPLACE FUNCTION update_servicos_utilizados()
RETURNS TRIGGER AS $$
BEGIN
  -- Quando um agendamento é concluído, incrementa serviços utilizados
  IF NEW.status = 'concluido' AND OLD.status != 'concluido' THEN
    UPDATE compras
    SET 
      servicos_utilizados = servicos_utilizados + 1,
      servicos_disponiveis = servicos_disponiveis - 1
    WHERE id = NEW.compra_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar contadores
CREATE TRIGGER update_servicos_utilizados_trigger
  AFTER UPDATE ON agendamentos
  FOR EACH ROW
  EXECUTE FUNCTION update_servicos_utilizados();
```

### Criar transação financeira ao concluir serviço

```sql
-- Função para criar transação financeira
CREATE OR REPLACE FUNCTION create_transacao_financeira()
RETURNS TRIGGER AS $$
DECLARE
  valor_servico DECIMAL(10,2);
BEGIN
  -- Quando agendamento é concluído, criar transação
  IF NEW.status = 'concluido' AND OLD.status != 'concluido' THEN
    -- Buscar valor do serviço
    SELECT s.valor INTO valor_servico
    FROM servicos s
    WHERE s.id = NEW.servico_id;
    
    -- Criar transação financeira
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

-- Trigger para criar transação
CREATE TRIGGER create_transacao_financeira_trigger
  AFTER UPDATE ON agendamentos
  FOR EACH ROW
  EXECUTE FUNCTION create_transacao_financeira();
```

---

## 📝 Scripts SQL

### Script Completo de Criação

✅ **Script SQL pronto para uso:** [`supabase/schema.sql`](../supabase/schema.sql)

Este arquivo contém todo o schema completo e pode ser executado diretamente no Supabase SQL Editor.

**Como usar:**

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá para **SQL Editor**
4. Clique em **New Query**
5. Copie e cole o conteúdo de `supabase/schema.sql`
6. Clique em **Run** ou pressione `Ctrl+Enter`

O script inclui:
- ✅ Todas as 10 tabelas
- ✅ Todos os índices
- ✅ Todas as funções e triggers
- ✅ Políticas RLS básicas
- ✅ Dados iniciais (usuário admin)

### Dados Iniciais (Seed)

```sql
-- Inserir usuário administrador
INSERT INTO users (id, nome, email, telefone, role, status)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Administrador',
  'admin@drw.com',
  '(11) 99999-9999',
  'admin',
  'aprovado'
);

-- Inserir categorias de serviços (opcional - pode ser enum)
-- Ou criar tabela separada de categorias
```

---

## 🔍 Views Úteis

### View de Prestadores com Estatísticas

```sql
CREATE VIEW prestadores_stats AS
SELECT 
  u.id,
  u.nome,
  u.email,
  u.avaliacao_media,
  u.total_avaliacoes,
  COUNT(DISTINCT a.id) as total_agendamentos,
  COUNT(DISTINCT CASE WHEN a.status = 'concluido' THEN a.id END) as servicos_concluidos,
  COALESCE(SUM(tf.valor), 0) as total_recebido
FROM users u
LEFT JOIN agendamentos a ON a.prestador_id = u.id
LEFT JOIN transacoes_financeiras tf ON tf.prestador_id = u.id AND tf.status = 'pago'
WHERE u.role = 'prestador' AND u.status = 'aprovado'
GROUP BY u.id, u.nome, u.email, u.avaliacao_media, u.total_avaliacoes;
```

### View de Clientes com Estatísticas

```sql
CREATE VIEW clientes_stats AS
SELECT 
  u.id,
  u.nome,
  u.email,
  COUNT(DISTINCT c.id) as total_compras,
  SUM(c.valor_total) as total_gasto,
  COUNT(DISTINCT a.id) as total_agendamentos,
  COUNT(DISTINCT CASE WHEN a.status = 'concluido' THEN a.id END) as servicos_concluidos
FROM users u
LEFT JOIN compras c ON c.cliente_id = u.id
LEFT JOIN agendamentos a ON a.cliente_id = u.id
WHERE u.role = 'cliente'
GROUP BY u.id, u.nome, u.email;
```

---

## 📊 Estatísticas e Relatórios

### Queries Úteis

```sql
-- Total de vendas por mês
SELECT 
  DATE_TRUNC('month', data_compra) as mes,
  COUNT(*) as total_vendas,
  SUM(valor_total) as receita_total
FROM compras
WHERE status = 'paga'
GROUP BY DATE_TRUNC('month', data_compra)
ORDER BY mes DESC;

-- Prestadores mais avaliados
SELECT 
  u.nome,
  u.avaliacao_media,
  u.total_avaliacoes,
  COUNT(DISTINCT a.id) as total_servicos
FROM users u
LEFT JOIN agendamentos a ON a.prestador_id = u.id
WHERE u.role = 'prestador' AND u.status = 'aprovado'
GROUP BY u.id, u.nome, u.avaliacao_media, u.total_avaliacoes
ORDER BY u.avaliacao_media DESC, u.total_avaliacoes DESC
LIMIT 10;

-- Serviços mais vendidos
SELECT 
  s.nome,
  s.categoria,
  COUNT(c.id) as total_vendas,
  SUM(c.valor_total) as receita_total
FROM servicos s
LEFT JOIN compras c ON c.servico_id = s.id AND c.status = 'paga'
WHERE s.ativo = true
GROUP BY s.id, s.nome, s.categoria
ORDER BY total_vendas DESC;
```

---

## 🚀 Próximos Passos

1. **Executar o script SQL** no Supabase SQL Editor
2. **Configurar autenticação** do Supabase no frontend
3. **Criar funções de API** (opcional) para lógica complexa
4. **Configurar storage** para upload de imagens
5. **Testar políticas RLS** com diferentes usuários
6. **Criar backups** regulares do banco

---

## 📚 Referências

- [Documentação Supabase](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Última atualização:** 2024

