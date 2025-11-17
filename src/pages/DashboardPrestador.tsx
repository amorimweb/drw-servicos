import { Link } from 'react-router-dom';
import { Calendar, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockAgendamentos, mockTransacoes, mockAvaliacoes } from '../data/mockData';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

const DashboardPrestador = () => {
  const { user } = useAuth();

  const meusAgendamentos = mockAgendamentos.filter(a => a.prestadorId === user?.id);
  const minhasTransacoes = mockTransacoes.filter(t => t.prestadorId === user?.id);
  const minhasAvaliacoes = mockAvaliacoes.filter(a => a.prestadorId === user?.id);

  const agendamentosPendentes = meusAgendamentos.filter(a => a.status === 'pendente').length;
  const agendamentosAceitos = meusAgendamentos.filter(a => a.status === 'aceito' || a.status === 'em_andamento').length;
  const agendamentosConcluidos = meusAgendamentos.filter(a => a.status === 'concluido').length;
  const totalReceber = minhasTransacoes
    .filter(t => t.status === 'pendente' || t.status === 'pago')
    .reduce((acc, t) => acc + t.valor, 0);
  const totalRecebido = minhasTransacoes
    .filter(t => t.status === 'pago')
    .reduce((acc, t) => acc + t.valor, 0);

  const avaliacaoMedia = minhasAvaliacoes.length > 0
    ? minhasAvaliacoes.reduce((acc, a) => acc + a.nota, 0) / minhasAvaliacoes.length
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard do Prestador</h1>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Total a Receber</p>
              <p className="text-3xl font-bold">R$ {totalReceber.toFixed(2).replace('.', ',')}</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Serviços Pendentes</p>
              <p className="text-3xl font-bold">{agendamentosPendentes}</p>
            </div>
            <Clock className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Em Andamento</p>
              <p className="text-3xl font-bold">{agendamentosAceitos}</p>
            </div>
            <Calendar className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm mb-1">Avaliação Média</p>
              <p className="text-3xl font-bold">{avaliacaoMedia.toFixed(1)}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-yellow-200" />
          </div>
        </div>
      </div>

      {/* Agendamentos */}
      <div className="card mb-8">
        <h2 className="text-2xl font-semibold mb-6">Meus Agendamentos</h2>
        <div className="space-y-4">
          {meusAgendamentos.length > 0 ? (
            meusAgendamentos.map(agendamento => (
              <div key={agendamento.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Agendamento #{agendamento.id.slice(0, 8)}</h3>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {format(new Date(agendamento.dataHora), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                      <p className="flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {agendamento.endereco.rua}, {agendamento.endereco.numero}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    agendamento.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                    agendamento.status === 'aceito' ? 'bg-blue-100 text-blue-800' :
                    agendamento.status === 'concluido' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {agendamento.status === 'pendente' ? 'Pendente' :
                     agendamento.status === 'aceito' ? 'Aceito' :
                     agendamento.status === 'concluido' ? 'Concluído' : agendamento.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    {agendamento.observacoes && (
                      <p>Observações: {agendamento.observacoes}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {agendamento.status === 'pendente' && (
                      <button className="btn-primary text-sm">
                        Aceitar
                      </button>
                    )}
                    {agendamento.status === 'aceito' && (
                      <Link
                        to={`/execucao/${agendamento.id}`}
                        className="btn-primary text-sm"
                      >
                        Iniciar Execução
                      </Link>
                    )}
                    <Link
                      to={`/chat/${agendamento.id}`}
                      className="btn-secondary text-sm"
                    >
                      Chat
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhum agendamento encontrado</p>
          )}
        </div>
      </div>

      {/* Avaliações Recentes */}
      {minhasAvaliacoes.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6">Últimas Avaliações</h2>
          <div className="space-y-4">
            {minhasAvaliacoes.slice(0, 5).map(avaliacao => (
              <div key={avaliacao.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < avaliacao.nota ? 'text-yellow-400' : 'text-gray-300'}>
                          ⭐
                        </span>
                      ))}
                      <span className="font-semibold">{avaliacao.nota}/5</span>
                    </div>
                    {avaliacao.comentario && (
                      <p className="text-gray-700">{avaliacao.comentario}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      {format(new Date(avaliacao.dataAvaliacao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPrestador;

