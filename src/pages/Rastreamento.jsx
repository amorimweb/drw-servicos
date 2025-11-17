import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Navigation } from 'lucide-react';
import { mockAgendamentos, mockPrestadores } from '../data/mockData';
import RastreamentoPrestador from '../components/RastreamentoPrestador';

const Rastreamento = () => {
  const { agendamentoId } = useParams();
  const navigate = useNavigate();

  const agendamento = mockAgendamentos.find(a => a.id === agendamentoId);
  const prestador = agendamento 
    ? mockPrestadores.find(p => p.id === agendamento.prestadorId)
    : null;

  if (!agendamento || !prestador) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Agendamento não encontrado</h2>
        <button onClick={() => navigate('/meus-servicos')} className="btn-primary">
          Voltar para Meus Serviços
        </button>
      </div>
    );
  }

  // Só permite rastreamento se o prestador aceitou e está a caminho
  if (agendamento.status !== 'aceito' && agendamento.status !== 'em_andamento') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto card text-center">
          <h2 className="text-2xl font-bold mb-4">Rastreamento Indisponível</h2>
          <p className="text-gray-600 mb-6">
            O rastreamento em tempo real só está disponível quando o prestador aceitou o serviço e está a caminho.
          </p>
          <button onClick={() => navigate('/meus-servicos')} className="btn-primary">
            Voltar para Meus Serviços
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/meus-servicos')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar para Meus Serviços</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <Navigation className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Rastreamento em Tempo Real</h1>
            <p className="text-gray-600">
              Acompanhe o deslocamento de {prestador.nome} até o local do serviço
            </p>
          </div>
        </div>
      </div>

      <RastreamentoPrestador
        prestador={prestador}
        enderecoDestino={agendamento.endereco}
      />
    </div>
  );
};

export default Rastreamento;

