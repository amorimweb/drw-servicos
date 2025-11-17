import { Link } from 'react-router-dom';
import { ShoppingCart, Calendar, CheckCircle, Star, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockCompras, mockAgendamentos, mockAvaliacoes } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();

  const minhasCompras = mockCompras.filter(c => c.clienteId === user?.id);
  const meusAgendamentos = mockAgendamentos.filter(a => a.clienteId === user?.id);
  const minhasAvaliacoes = mockAvaliacoes.filter(a => a.clienteId === user?.id);

  const totalGasto = minhasCompras.reduce((acc, c) => acc + c.valorTotal, 0);
  const servicosConcluidos = meusAgendamentos.filter(a => a.status === 'concluido').length;
  const servicosPendentes = meusAgendamentos.filter(a => a.status === 'pendente' || a.status === 'aceito').length;

  // Dados para gráfico
  const chartData = [
    { mes: 'Jan', compras: 2, servicos: 1 },
    { mes: 'Fev', compras: 1, servicos: 2 },
    { mes: 'Mar', compras: 0, servicos: 0 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm mb-1">Total Gasto</p>
              <p className="text-3xl font-bold">R$ {totalGasto.toFixed(2).replace('.', ',')}</p>
            </div>
            <ShoppingCart className="w-12 h-12 text-primary-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Serviços Concluídos</p>
              <p className="text-3xl font-bold">{servicosConcluidos}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm mb-1">Serviços Pendentes</p>
              <p className="text-3xl font-bold">{servicosPendentes}</p>
            </div>
            <Calendar className="w-12 h-12 text-yellow-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Avaliações Feitas</p>
              <p className="text-3xl font-bold">{minhasAvaliacoes.length}</p>
            </div>
            <Star className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Atividade Mensal</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="compras" fill="#0ea5e9" name="Compras" />
            <Bar dataKey="servicos" fill="#10b981" name="Serviços" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <Link to="/loja" className="block btn-primary text-center">
              Comprar Novo Serviço
            </Link>
            <Link to="/meus-servicos" className="block btn-secondary text-center">
              Ver Meus Serviços
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Últimas Atividades</h3>
          <div className="space-y-3">
            {meusAgendamentos.slice(0, 3).map(agendamento => (
              <div key={agendamento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Agendamento #{agendamento.id.slice(0, 8)}</p>
                  <p className="text-xs text-gray-500">{agendamento.status}</p>
                </div>
                <Link to={`/chat/${agendamento.id}`} className="text-primary-600 text-sm">
                  Ver →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

