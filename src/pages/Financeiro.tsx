import { DollarSign, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockTransacoes } from '../data/mockData';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Financeiro = () => {
  const { user } = useAuth();

  const minhasTransacoes = mockTransacoes.filter(t => t.prestadorId === user?.id);
  
  const totalReceber = minhasTransacoes
    .filter(t => t.status === 'pendente')
    .reduce((acc, t) => acc + t.valor, 0);
  
  const totalRecebido = minhasTransacoes
    .filter(t => t.status === 'pago')
    .reduce((acc, t) => acc + t.valor, 0);

  const transacoesPendentes = minhasTransacoes.filter(t => t.status === 'pendente');
  const transacoesPagas = minhasTransacoes.filter(t => t.status === 'pago');

  // Dados para gráfico
  const chartData = [
    { mes: 'Jan', recebido: 0, pendente: 0 },
    { mes: 'Fev', recebido: totalRecebido, pendente: totalReceber },
    { mes: 'Mar', recebido: 0, pendente: 0 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Painel Financeiro</h1>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Total Recebido</p>
              <p className="text-3xl font-bold">R$ {totalRecebido.toFixed(2).replace('.', ',')}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm mb-1">A Receber</p>
              <p className="text-3xl font-bold">R$ {totalReceber.toFixed(2).replace('.', ',')}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Geral</p>
              <p className="text-3xl font-bold">R$ {(totalRecebido + totalReceber).toFixed(2).replace('.', ',')}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Evolução Financeira</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="recebido" stroke="#10b981" name="Recebido" />
            <Line type="monotone" dataKey="pendente" stroke="#f59e0b" name="Pendente" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Transações Pendentes */}
      <div className="card mb-8">
        <h2 className="text-2xl font-semibold mb-6">Valores a Receber</h2>
        <div className="space-y-4">
          {transacoesPendentes.length > 0 ? (
            transacoesPendentes.map(transacao => (
              <div key={transacao.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Serviço #{transacao.agendamentoId.slice(0, 8)}</p>
                    <p className="text-sm text-gray-600">
                      Data do serviço: {format(new Date(transacao.dataServico), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                    {transacao.observacoes && (
                      <p className="text-sm text-gray-500 mt-1">{transacao.observacoes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-600">
                      R$ {transacao.valor.toFixed(2).replace('.', ',')}
                    </p>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      Pendente
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhum valor pendente</p>
          )}
        </div>
      </div>

      {/* Transações Pagas */}
      <div className="card">
        <h2 className="text-2xl font-semibold mb-6">Histórico de Pagamentos</h2>
        <div className="space-y-4">
          {transacoesPagas.length > 0 ? (
            transacoesPagas.map(transacao => (
              <div key={transacao.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Serviço #{transacao.agendamentoId.slice(0, 8)}</p>
                    <p className="text-sm text-gray-600">
                      Pago em: {transacao.dataPagamento && format(new Date(transacao.dataPagamento), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      R$ {transacao.valor.toFixed(2).replace('.', ',')}
                    </p>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Pago
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhum pagamento registrado</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Financeiro;

