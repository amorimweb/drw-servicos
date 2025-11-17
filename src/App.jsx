import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Loja from './pages/Loja';
import ServicoDetalhes from './pages/ServicoDetalhes';
import Checkout from './pages/Checkout';
import Agendamento from './pages/Agendamento';
import Dashboard from './pages/Dashboard';
import DashboardPrestador from './pages/DashboardPrestador';
import DashboardAdmin from './pages/DashboardAdmin';
import MeusServicos from './pages/MeusServicos';
import ExecucaoServico from './pages/ExecucaoServico';
import Chat from './pages/Chat';
import Financeiro from './pages/Financeiro';
import CadastroServico from './pages/CadastroServico';
import CadastroPrestador from './pages/CadastroPrestador';
import Prestadores from './pages/Prestadores';
import Rastreamento from './pages/Rastreamento';
import PrivateRoute from './components/PrivateRoute';

function App() {
  // Verificação de debug
  console.log('App component carregado');

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="loja" element={<Loja />} />
            <Route path="servico/:id" element={<ServicoDetalhes />} />
            <Route path="prestadores" element={<Prestadores />} />
            
            <Route path="checkout/:servicoId" element={
              <PrivateRoute allowedRoles={['cliente', 'admin']}>
                <Checkout />
              </PrivateRoute>
            } />
            
            <Route path="agendamento/:compraId" element={
              <PrivateRoute allowedRoles={['cliente', 'admin']}>
                <Agendamento />
              </PrivateRoute>
            } />
            
            <Route path="meus-servicos" element={
              <PrivateRoute allowedRoles={['cliente', 'admin']}>
                <MeusServicos />
              </PrivateRoute>
            } />
            
            <Route path="execucao/:agendamentoId" element={
              <PrivateRoute allowedRoles={['prestador', 'admin']}>
                <ExecucaoServico />
              </PrivateRoute>
            } />
            
            <Route path="chat/:agendamentoId" element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            } />
            
            <Route path="rastreamento/:agendamentoId" element={
              <PrivateRoute allowedRoles={['cliente', 'admin']}>
                <Rastreamento />
              </PrivateRoute>
            } />
            
            <Route path="dashboard" element={
              <PrivateRoute allowedRoles={['cliente', 'admin']}>
                <Dashboard />
              </PrivateRoute>
            } />
            
            <Route path="dashboard-prestador" element={
              <PrivateRoute allowedRoles={['prestador', 'admin']}>
                <DashboardPrestador />
              </PrivateRoute>
            } />
            
            <Route path="financeiro" element={
              <PrivateRoute allowedRoles={['prestador', 'admin']}>
                <Financeiro />
              </PrivateRoute>
            } />
            
            <Route path="admin" element={
              <PrivateRoute allowedRoles={['admin']}>
                <DashboardAdmin />
              </PrivateRoute>
            } />
            
            <Route path="admin/servicos" element={
              <PrivateRoute allowedRoles={['admin']}>
                <CadastroServico />
              </PrivateRoute>
            } />
            
            <Route path="admin/prestadores" element={
              <PrivateRoute allowedRoles={['admin']}>
                <CadastroPrestador />
              </PrivateRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

