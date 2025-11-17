import { Link } from 'react-router-dom';
import { Calendar, MapPin, Navigation } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockCompras, mockAgendamentos, mockServicos } from '../data/mockData';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

const MeusServicos = () => {
  const { user } = useAuth();

  // Filtrar compras e agendamentos do usuário
  const minhasCompras = mockCompras.filter(c => c.clienteId === user?.id);
  const meusAgendamentos = mockAgendamentos.filter(a => a.clienteId === user?.id);

  const getStatusBadge = (status: string) => {
    const styles = {
      pendente: 'bg-yellow-100 text-yellow-800',
      aceito: 'bg-blue-100 text-blue-800',
      em_andamento: 'bg-purple-100 text-purple-800',
      concluido: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
      paga: 'bg-green-100 text-green-800',
    };

    const labels = {
      pendente: 'Pendente',
      aceito: 'Aceito',
      em_andamento: 'Em Andamento',
      concluido: 'Concluído',
      cancelado: 'Cancelado',
      paga: 'Paga',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Meus Serviços</h1>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card bg-primary-50">
          <div className="text-2xl font-bold text-primary-600">{minhasCompras.length}</div>
          <div className="text-sm text-gray-600">Compras Realizadas</div>
        </div>
        <div className="card bg-blue-50">
          <div className="text-2xl font-bold text-blue-600">
            {meusAgendamentos.filter(a => a.status === 'aceito' || a.status === 'em_andamento').length}
          </div>
          <div className="text-sm text-gray-600">Agendamentos Ativos</div>
        </div>
        <div className="card bg-green-50">
          <div className="text-2xl font-bold text-green-600">
            {meusAgendamentos.filter(a => a.status === 'concluido').length}
          </div>
          <div className="text-sm text-gray-600">Serviços Concluídos</div>
        </div>
        <div className="card bg-yellow-50">
          <div className="text-2xl font-bold text-yellow-600">
            {minhasCompras.reduce((acc, c) => acc + c.servicosDisponiveis, 0)}
          </div>
          <div className="text-sm text-gray-600">Serviços Disponíveis</div>
        </div>
      </div>

      {/* Compras */}
      <div className="card mb-8">
        <h2 className="text-2xl font-semibold mb-6">Minhas Compras</h2>
        <div className="space-y-4">
          {minhasCompras.map(compra => (
            <div key={compra.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={compra.servico.imagem}
                    alt={compra.servico.nome}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{compra.servico.nome}</h3>
                    <p className="text-sm text-gray-600">{compra.servico.categoria}</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm">
                      <span>Quantidade: {compra.quantidade}</span>
                      <span className="font-semibold text-primary-600">
                        R$ {compra.valorTotal.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>
                {getStatusBadge(compra.status)}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <p>Utilizados: {compra.servicosUtilizados} / Disponíveis: {compra.servicosDisponiveis}</p>
                  <p className="mt-1">
                    Comprado em: {format(new Date(compra.dataCompra), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
                {compra.servicosDisponiveis > 0 && (
                  <Link
                    to={`/agendamento/${compra.id}`}
                    className="btn-primary text-sm"
                  >
                    Agendar Serviço
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agendamentos */}
      <div className="card">
        <h2 className="text-2xl font-semibold mb-6">Meus Agendamentos</h2>
        <div className="space-y-4">
          {meusAgendamentos.length > 0 ? (
            meusAgendamentos.map(agendamento => {
              const servico = mockServicos.find(s => s.id === agendamento.servicoId);
              return (
                <div key={agendamento.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{servico?.nome || 'Serviço'}</h3>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {format(new Date(agendamento.dataHora), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                        <p className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {agendamento.endereco.rua}, {agendamento.endereco.numero} - {agendamento.endereco.bairro}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(agendamento.status)}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      {agendamento.observacoes && (
                        <p>Observações: {agendamento.observacoes}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {(agendamento.status === 'aceito' || agendamento.status === 'em_andamento') && (
                        <>
                          <Link
                            to={`/rastreamento/${agendamento.id}`}
                            className="btn-primary text-sm flex items-center space-x-1"
                          >
                            <Navigation className="w-4 h-4" />
                            <span>Rastrear</span>
                          </Link>
                          <Link
                            to={`/chat/${agendamento.id}`}
                            className="btn-secondary text-sm"
                          >
                            Chat
                          </Link>
                        </>
                      )}
                      {agendamento.status === 'concluido' && (
                        <Link
                          to={`/dashboard`}
                          className="btn-primary text-sm"
                        >
                          Avaliar
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhum agendamento encontrado</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeusServicos;

