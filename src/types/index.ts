export type UserRole = 'admin' | 'cliente' | 'prestador';

export interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Cliente extends User {
  role: 'cliente';
  cpf?: string;
  endereco?: Endereco;
}

export interface Prestador extends User {
  role: 'prestador';
  cnpj?: string;
  status: 'aprovado' | 'standby' | 'rejeitado';
  especialidades: string[];
  avaliacaoMedia: number;
  totalAvaliacoes: number;
  localizacao?: Localizacao;
  online: boolean;
}

export interface Endereco {
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  latitude?: number;
  longitude?: number;
}

export interface Localizacao {
  latitude: number;
  longitude: number;
  endereco: string;
}

export interface Servico {
  id: string;
  nome: string;
  descricao: string;
  imagem: string;
  valor: number;
  observacoes?: string;
  prazoUso: number; // em dias
  categoria: string;
  ativo: boolean;
  permitePacote: boolean;
  permiteRecorrencia: boolean;
}

export interface PacoteServico {
  id: string;
  servicoId: string;
  quantidade: number;
  bonus?: number; // ex: compra 10 ganha 11
  desconto?: number;
}

export interface Compra {
  id: string;
  clienteId: string;
  servicoId: string;
  servico: Servico;
  quantidade: number;
  valorTotal: number;
  formaPagamento: 'pix' | 'cartao' | 'boleto';
  parcelas?: number;
  recorrencia?: boolean;
  status: 'pendente' | 'paga' | 'cancelada';
  dataCompra: string;
  dataVencimento?: string;
  servicosUtilizados: number;
  servicosDisponiveis: number;
}

export interface Agendamento {
  id: string;
  compraId: string;
  clienteId: string;
  prestadorId: string;
  servicoId: string;
  dataHora: string;
  endereco: Endereco;
  status: 'pendente' | 'aceito' | 'em_andamento' | 'concluido' | 'cancelado';
  observacoes?: string;
  createdAt: string;
}

export interface ExecucaoServico {
  id: string;
  agendamentoId: string;
  fotosIniciais: string[];
  fotosDurante: string[];
  fotosFinais: string[];
  observacoesIniciais?: string;
  observacoesDurante?: string;
  observacoesFinais?: string;
  iniciadoEm?: string;
  finalizadoEm?: string;
  confirmadoPorCliente: boolean;
  confirmadoEm?: string;
}

export interface Avaliacao {
  id: string;
  agendamentoId: string;
  prestadorId: string;
  clienteId: string;
  nota: number; // 1 a 5
  comentario?: string;
  dataAvaliacao: string;
}

export interface Reclamacao {
  id: string;
  agendamentoId: string;
  clienteId: string;
  prestadorId: string;
  motivo: string;
  descricao: string;
  status: 'aberta' | 'em_analise' | 'resolvida' | 'fechada';
  dataAbertura: string;
  resolucao?: string;
}

export interface Mensagem {
  id: string;
  agendamentoId: string;
  remetenteId: string;
  destinatarioId: string;
  conteudo: string;
  tipo: 'texto' | 'whatsapp';
  dataEnvio: string;
  lida: boolean;
}

export interface TransacaoFinanceira {
  id: string;
  prestadorId: string;
  agendamentoId: string;
  valor: number;
  status: 'pendente' | 'pago' | 'cancelado';
  dataServico: string;
  dataPagamento?: string;
  observacoes?: string;
}

