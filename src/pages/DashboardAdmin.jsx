import { Link } from 'react-router-dom';
import { Users, ShoppingCart, DollarSign, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { mockClientes, mockPrestadores, mockCompras, mockAgendamentos, mockServicos } from '../data/mockData';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DashboardAdmin = () => {
  const prestadoresAprovados = mockPrestadores.filter(p => p.status === 'aprovado').length;
  const prestadoresPendentes = mockPrestadores.filter(p => p.status === 'standby').length;
  const totalCompras = mockCompras.length;
  const totalReceita = mockCompras.filter(c => c.status === 'paga').reduce((acc, c) => acc + c.valorTotal, 0);
  const servicosAtivos = mockServicos.filter(s => s.ativo).length;
  const agendamentosConcluidos = mockAgendamentos.filter(a => a.status === 'concluido').length;

  const chartData = [
    { mes: 'Jan', vendas: 2, receita: 2400 },
    { mes: 'Fev', vendas: 1, receita: 800 },
    { mes: 'Mar', vendas: 0, receita: 0 },
  ];

  const statusData = [
    { name: 'Aprovados', value: prestadoresAprovados, color: '#10b981' },
    { name: 'Pendentes', value: prestadoresPendentes, color: '#f59e0b' },
    { name: 'Rejeitados', value: mockPrestadores.filter(p => p.status === 'rejeitado').length, color: '#ef4444' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Administrativo</h1>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total de Clientes</p>
              <p className="text-3xl font-bold">{mockClientes.length}</p>
            </div>
            <Users className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Prestadores Aprovados</p>
              <p className="text-3xl font-bold">{prestadoresAprovados}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Total de Vendas</p>
              <p className="text-3xl font-bold">{totalCompras}</p>
            </div>
            <ShoppingCart className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm mb-1">Receita Total</p>
              <p className="text-3xl font-bold">R$ {totalReceita.toFixed(2).replace('.', ',')}</p>
            </div>
            <DollarSign className="w-12 h-12 text-yellow-200" />
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Vendas e Receita Mensal</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="vendas" fill="#0ea5e9" name="Vendas" />
              <Bar yAxisId="right" dataKey="receita" fill="#10b981" name="Receita (R$)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Status dos Prestadores</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/prestadores" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold">Gerenciar Prestadores</h3>
              <p className="text-sm text-gray-600">{prestadoresPendentes} aguardando aprovação</p>
            </div>
          </div>
        </Link>

        <Link to="/admin/servicos" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Gerenciar Serviços</h3>
              <p className="text-sm text-gray-600">{servicosAtivos} serviços ativos</p>
            </div>
          </div>
        </Link>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Serviços Concluídos</h3>
              <p className="text-sm text-gray-600">{agendamentosConcluidos} serviços finalizados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;

