# DRW Serviços - Plataforma de Venda e Execução de Serviços

Sistema completo em React.js para venda, agendamento e execução de serviços. Conecta clientes e prestadores de forma simples e eficiente.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Como Funciona Cada Perfil](#-como-funciona-cada-perfil)
  - [👨‍💼 Administrador](#1-administrador-dono-da-plataforma)
  - [🧑‍🔧 Prestador de Serviço](#2-prestador-de-serviço-contrata-a-plataforma)
  - [👤 Cliente](#3-cliente-busca-e-contrata-serviços)
- [Rastreamento em Tempo Real](#-rastreamento-em-tempo-real)
- [Fluxo Completo de Exemplo](#-fluxo-completo-de-exemplo)
- [Banco de Dados](#-banco-de-dados)
- [Tecnologias](#️-tecnologias)
- [Instalação](#-instalação)
- [Credenciais de Demonstração](#-credenciais-de-demonstração)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Próximos Passos](#-próximos-passos)

---

## 🎯 Visão Geral

O sistema DRW Serviços é uma plataforma completa que conecta três tipos de usuários:

```
┌─────────────┐
│  ADMIN      │ ← Aprova prestadores
│             │ ← Cadastra serviços
│             │ ← Monitora tudo
└──────┬──────┘
       │
       ↓
┌─────────────┐      ┌─────────────┐
│ PRESTADOR   │ ←───→│  CLIENTE    │
│             │      │             │
│ Executa     │      │ Compra e    │
│ Serviços    │      │ Agenda      │
└─────────────┘      └─────────────┘
```

---

## 👥 Como Funciona Cada Perfil

### 1. 👨‍💼 Administrador (Dono da Plataforma)

O **Administrador** é quem gerencia a plataforma e controla o que é vendido.

#### 📊 Responsabilidades Principais:

**1. Dashboard Administrativo**
- Visão geral completa: total de clientes, prestadores, vendas e receita
- Gráficos de vendas e receita mensal
- Gráfico de pizza mostrando status dos prestadores (aprovados, pendentes, rejeitados)

**2. Gerenciamento de Prestadores**
- **Aprovação/Rejeição** de prestadores que se cadastram
- Visualização completa de dados: CNPJ, especialidades, avaliações
- Controle total sobre quem pode trabalhar na plataforma
- Status: `standby` → `aprovado` ou `rejeitado`

**3. Cadastro de Serviços**
- Criar novos serviços com:
  - Nome, descrição, imagem, valor
  - Prazo de uso (em dias)
  - Categoria
  - Opções: permite pacotes, permite recorrência
- Ativar/desativar serviços

**4. Monitoramento**
- Acompanhamento de todas as vendas
- Serviços concluídos
- Receita gerada pela plataforma

#### 🔄 Fluxo do Admin:

```
Login → Dashboard Admin → Ver indicadores
                         ↓
                    Gerenciar Prestadores (aprovar/rejeitar)
                         ↓
                    Cadastrar Serviços
                         ↓
                    Monitorar Vendas e Receita
```

---

### 2. 🧑‍🔧 Prestador de Serviço (Contrata a Plataforma)

O **Prestador** se cadastra na plataforma, é aprovado pelo admin e executa serviços para os clientes.

#### 🔄 Fluxo Completo:

**1. Cadastro Inicial**
- Preenche dados pessoais: nome, email, telefone
- Informa CNPJ (pode ser MEI)
- Define especialidades (ex: Elétrica, Hidráulica, Pintura)
- Status inicial: `standby` (aguardando aprovação do admin)

**2. Após Aprovação do Admin**
- Status muda para `aprovado`
- Pode receber agendamentos de clientes
- Aparece no mapa e na lista de prestadores disponíveis

**3. Dashboard do Prestador**
- **Total a Receber**: valores dos serviços executados
- **Serviços Pendentes**: aguardando aceite
- **Serviços em Andamento**: já aceitos e sendo executados
- **Avaliação Média**: nota média recebida dos clientes

**4. Recebimento de Agendamento**
- Cliente compra serviço e agenda com o prestador
- Prestador recebe notificação
- Status: `pendente` (aguardando aceite)

**5. Aceitar Serviço**
- Prestador visualiza detalhes: data, hora, endereço, observações
- Clica em "Aceitar"
- Status muda para `aceito`
- Pode iniciar comunicação via chat

**6. Execução do Serviço**
- **Pré-atendimento**: 
  - Tira fotos iniciais do local
  - Registra observações sobre o estado inicial
- **Durante a execução**:
  - Registra fotos do progresso
  - Adiciona observações sobre o trabalho
- **Finalização**:
  - Tira fotos finais
  - Adiciona observações finais
  - Cliente confirma a execução

**7. Pagamento**
- Após confirmação do cliente, valor fica como "a receber"
- Admin valida e libera pagamento
- Status: `pendente` → `pago`
- Prestador acompanha no painel financeiro

**8. Avaliações**
- Cliente avalia após conclusão do serviço
- Nota de 1 a 5 estrelas + comentário opcional
- Impacta diretamente na média do prestador

#### 🔄 Fluxo do Prestador:

```
Cadastro → Aguarda Aprovação (Admin)
              ↓
         Aprovado → Recebe Agendamentos
              ↓
         Aceita Serviço → Inicia Execução
              ↓
         Registra Fotos (antes/durante/depois)
              ↓
         Finaliza → Cliente Confirma
              ↓
         Recebe Avaliação → Pagamento Liberado
```

---

### 3. 👤 Cliente (Busca e Contrata Serviços)

O **Cliente** navega pela loja, compra serviços e agenda com prestadores.

#### 🔄 Fluxo Completo:

**1. Navegação na Loja**
- Visualiza todos os serviços disponíveis
- Busca por nome ou descrição
- Filtra por categoria (Elétrica, Hidráulica, Pintura, etc.)
- Ordena por: nome, valor ou prazo

**2. Detalhes do Serviço**
- Vê descrição completa
- Valor e prazo de uso
- Informações sobre pacotes e recorrência
- Observações importantes

**3. Compra**
- Escolhe quantidade (se permitir pacote)
- Seleciona forma de pagamento:
  - **PIX**: aprovação imediata
  - **Cartão**: parcelamento (até 12x)
  - **Boleto**: aprovação em até 2 dias úteis
- Opção de recorrência (se disponível)
- Finaliza compra

**4. Agendamento**
- **Escolhe prestador**:
  - Visualização no mapa (prestadores próximos)
  - Ou lista de prestadores disponíveis
  - Vê avaliações e especialidades
- **Seleciona data/hora**
- **Informa endereço** de execução
- **Adiciona observações** (portão, interfone, etc.)
- Confirma agendamento

**5. Comunicação**
- Chat integrado com o prestador
- Link para WhatsApp (mensagens também ficam no sistema)
- Troca de mensagens antes e durante o serviço

**6. Acompanhamento**
- **"Meus Serviços"**: histórico de todas as compras
- Status: pendente, aceito, em andamento, concluído
- Serviços utilizados vs disponíveis
- Prazo para usar cada serviço
- **Rastreamento em tempo real** do prestador (quando aceito)

**7. Rastreamento em Tempo Real** 🆕
- Acompanha o deslocamento do prestador até o local
- Visualização no mapa com atualização automática
- Distância restante e tempo estimado de chegada
- Barra de progresso da viagem
- Disponível apenas para agendamentos aceitos

**8. Confirmação e Avaliação**
- Prestador finaliza e envia fotos
- Cliente confirma a execução
- Avalia o prestador (1-5 estrelas + comentário)
- Serviço marcado como concluído

**8. Dashboard do Cliente**
- **Total Gasto**: soma de todas as compras
- **Serviços Concluídos**: quantidade finalizada
- **Serviços Pendentes**: aguardando execução
- **Gráfico de atividade mensal**

#### 🔄 Fluxo do Cliente:

```
Navega Loja → Vê Detalhes do Serviço
     ↓
Compra Serviço (PIX/Cartão/Boleto)
     ↓
Escolhe Prestador (Mapa/Lista)
     ↓
Agenda Data/Hora/Endereço
     ↓
Prestador Aceita → Chat Disponível
     ↓
Prestador Executa → Envia Fotos
     ↓
Cliente Confirma → Avalia Prestador
     ↓
Serviço Concluído
```

---

## 📍 Rastreamento em Tempo Real

Uma das funcionalidades mais inovadoras do sistema é o **rastreamento em tempo real** do prestador de serviço. O cliente pode acompanhar visualmente o deslocamento do prestador até o local do serviço.

### 🎯 Como Funciona

1. **Após o Prestador Aceitar o Serviço**
   - Quando o prestador aceita um agendamento, o status muda para `aceito` ou `em_andamento`
   - O cliente vê um botão **"Rastrear"** na página "Meus Serviços"

2. **Acesso ao Rastreamento**
   - Cliente clica no botão "Rastrear" no agendamento
   - Abre a página de rastreamento com mapa interativo

3. **Visualização em Tempo Real**
   - **Mapa interativo** mostrando:
     - 📍 Posição atual do prestador (marcador animado)
     - 🎯 Destino do serviço (marcador fixo)
     - 📏 Linha tracejada conectando prestador ao destino
   - **Informações em tempo real**:
     - Status: "A caminho" ou "Chegou ao destino"
     - Distância restante em km
     - Tempo estimado de chegada
     - Barra de progresso da viagem (%)

### ✨ Funcionalidades Técnicas

- **Atualização Automática**: Posição atualizada a cada 2 segundos
- **Simulação de Movimento**: Prestador se move em direção ao destino (~30 km/h)
- **Cálculo de Distância**: Usa fórmula de Haversine para calcular distância real
- **Animação Visual**: Marcador pulsa quando o prestador está em movimento
- **Rota Visual**: Linha tracejada azul mostrando o caminho
- **Ajuste Automático de Zoom**: Mapa se ajusta para mostrar prestador e destino

### 📱 Interface do Rastreamento

A página de rastreamento exibe:

```
┌─────────────────────────────────────┐
│  Status | Distância | Tempo Est.   │
│  A caminho | 2.5 km | 5 min        │
│  [████████░░] 75%                  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         MAPA INTERATIVO              │
│  🚗 Prestador → 📍 Destino          │
│  ────────────────────────            │
└─────────────────────────────────────┘
```

### 🔄 Fluxo do Rastreamento

```
Cliente agenda serviço
        ↓
Prestador aceita (status: aceito)
        ↓
Cliente acessa "Meus Serviços"
        ↓
Clica em "Rastrear"
        ↓
Visualiza mapa com prestador em movimento
        ↓
Acompanha até prestador chegar
        ↓
Prestador inicia execução do serviço
```

### 🎨 Detalhes Visuais

- **Marcador do Prestador**: 
  - Verde quando em movimento (com animação de pulso)
  - Cinza quando chegou ao destino
  - Ícone de navegação animado
  
- **Marcador do Destino**:
  - Vermelho padrão do Leaflet
  - Popup com endereço completo

- **Linha de Rota**:
  - Azul (#0ea5e9)
  - Tracejada (dashArray)
  - Opacidade de 70%

### 📊 Informações Exibidas

1. **Status da Viagem**
   - "A caminho" quando prestador está se movendo
   - "Chegou ao destino" quando chegou

2. **Distância Restante**
   - Calculada em tempo real
   - Exibida em quilômetros (km)
   - Atualizada a cada 2 segundos

3. **Tempo Estimado**
   - Baseado na velocidade média de 30 km/h
   - Exibido em minutos
   - Atualizado conforme o prestador se aproxima

4. **Barra de Progresso**
   - Mostra porcentagem da viagem concluída
   - Atualização suave com animação
   - 0% = início, 100% = chegada

### 🚀 Como Testar

1. Faça login como **Cliente** (`joao@email.com` / `123456`)
2. Vá para **"Meus Serviços"**
3. Localize o agendamento com status **"Aceito"** (agendamento `a1`)
4. Clique no botão **"Rastrear"** 🧭
5. Observe o prestador se movendo no mapa em tempo real!

### 🔮 Próximas Melhorias (Backend)

Quando integrar com backend real:

- ✅ **GPS Real**: Integração com localização GPS do dispositivo do prestador
- ✅ **Notificações Push**: Aviso quando prestador está próximo (ex: 500m)
- ✅ **Histórico de Rotas**: Salvar rotas percorridas para análise
- ✅ **Integração com APIs**: Google Maps Directions, Mapbox Routing
- ✅ **Tempo Real Real**: WebSockets para atualização instantânea
- ✅ **Múltiplos Prestadores**: Rastrear vários prestadores simultaneamente

---

## 🎬 Fluxo Completo de Exemplo

Vamos ver um exemplo prático de ponta a ponta:

1. **Admin** cadastra serviço "Instalação Elétrica" (R$ 1.500)
2. **Cliente** navega na loja, vê o serviço e compra via PIX
3. **Cliente** agenda: escolhe prestador "Carlos Eletricista" no mapa, define data/hora
4. **Prestador** recebe notificação e aceita o agendamento
5. **Prestador** vai ao local, registra fotos (antes/durante/depois)
6. **Prestador** finaliza e **Cliente** confirma
7. **Cliente** avalia: 5 estrelas + comentário positivo
8. **Admin** libera pagamento: R$ 1.500 para o prestador
9. **Prestador** recebe no painel financeiro

---

## 🗄️ Banco de Dados

O sistema utiliza **Supabase (PostgreSQL)** como banco de dados. A documentação completa do schema, tabelas, relacionamentos, índices e políticas RLS está disponível em:

📄 **[DATABASE.md](./DATABASE.md)** - Documentação completa do banco de dados

### Resumo das Tabelas

- **users** - Usuários (clientes, prestadores, administradores)
- **servicos** - Catálogo de serviços disponíveis
- **compras** - Registro de compras realizadas
- **agendamentos** - Agendamentos de execução de serviços
- **execucao_servicos** - Registro fotográfico e observações da execução
- **avaliacoes** - Avaliações dos prestadores pelos clientes
- **reclamacoes** - Reclamações sobre serviços
- **mensagens** - Chat entre cliente e prestador
- **transacoes_financeiras** - Controle financeiro dos prestadores
- **pacotes_servicos** - Configuração de pacotes promocionais

### Configuração no Supabase

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Crie um novo projeto
3. Acesse o **SQL Editor**
4. Execute o script completo disponível em `DATABASE.md`
5. Configure as variáveis de ambiente no frontend

---

## 🛠️ Tecnologias

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **React Router** para navegação
- **Tailwind CSS** para estilização
- **Recharts** para gráficos e dashboards
- **React Leaflet** para mapas interativos
- **Lucide React** para ícones
- **date-fns** para formatação de datas

---

## 📦 Instalação

1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd drw-servicos
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

4. **Acesse no navegador:**
```
http://localhost:5173
```

---

## 🔐 Credenciais de Demonstração

### 👤 Cliente
- **Email:** `joao@email.com`
- **Senha:** `123456`

### 🧑‍🔧 Prestador
- **Email:** `carlos@email.com`
- **Senha:** `123456`

### 👨‍💼 Administrador
- **Email:** `admin@drw.com`
- **Senha:** `123456`

> 💡 **Dica:** Use a página de login para preencher automaticamente as credenciais de cada perfil.

---

## 📂 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Header.tsx      # Cabeçalho com navegação
│   ├── Footer.tsx      # Rodapé
│   ├── Layout.tsx      # Layout principal
│   ├── PrivateRoute.tsx # Proteção de rotas
│   └── RastreamentoPrestador.tsx # Rastreamento em tempo real 🆕
├── pages/              # Páginas da aplicação
│   ├── Home.tsx        # Página inicial
│   ├── Login.tsx       # Autenticação
│   ├── Loja.tsx        # Catálogo de serviços
│   ├── Dashboard.tsx   # Dashboard do cliente
│   ├── DashboardPrestador.tsx
│   ├── DashboardAdmin.tsx
│   ├── Checkout.tsx    # Finalização de compra
│   ├── Agendamento.tsx # Agendamento com mapa
│   ├── Rastreamento.tsx # Página de rastreamento 🆕
│   ├── ExecucaoServico.tsx
│   ├── Chat.tsx        # Chat integrado
│   └── ...
├── context/            # Context API
│   └── AuthContext.tsx # Gerenciamento de autenticação
├── data/               # Dados mockados
│   └── mockData.ts     # Dados fictícios para demo
├── types/              # Tipos TypeScript
│   └── index.ts        # Definições de tipos
└── App.tsx             # Componente principal
```

---

## ✨ Diferenciais do Sistema

- ✅ **Multi-plataforma**: Funciona perfeitamente em mobile e desktop
- ✅ **Mapa interativo**: Visualização de prestadores próximos
- ✅ **Rastreamento em tempo real**: Cliente acompanha deslocamento do prestador 🆕
- ✅ **Chat integrado**: Comunicação dentro da plataforma
- ✅ **Registro fotográfico**: Antes, durante e depois do serviço
- ✅ **Painel financeiro**: Prestador acompanha valores a receber
- ✅ **Sistema de avaliações**: Reputação dos prestadores
- ✅ **Pacotes e recorrência**: Flexibilidade de compra
- ✅ **Múltiplas formas de pagamento**: PIX, Cartão, Boleto
- ✅ **Dashboard completo**: Indicadores e gráficos para todos os perfis

---

## 🚧 Próximos Passos

- [ ] Integração com backend (API REST)
- [ ] Integração com gateway de pagamento real
- [ ] Sistema de notificações em tempo real
- [ ] Upload real de imagens (cloud storage)
- [ ] Integração com WhatsApp API
- [ ] Sistema de cupons e descontos
- [ ] Programa de indicação com créditos
- [ ] Comprar serviços para presente
- [ ] Expansão para marketplace de serviços
- [ ] **Rastreamento**: GPS real do prestador via dispositivo móvel
- [ ] **Rastreamento**: Notificações quando prestador está próximo
- [ ] **Rastreamento**: Integração com APIs de roteamento (Google Maps, Mapbox)

---

## 📄 Licença

Este projeto é uma demonstração e está disponível para uso educacional.

---

**Desenvolvido com ❤️ para DRW Serviços**
