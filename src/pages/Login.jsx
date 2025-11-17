import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('cliente');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (login(email, password, role)) {
      // Redirecionar baseado no role
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'prestador') {
        navigate('/dashboard-prestador');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('Email ou senha incorretos. Use senha: 123456 para demo');
    }
  };

  const demoCredentials = {
    cliente: { email: 'joao@email.com', password: '123456' },
    prestador: { email: 'carlos@email.com', password: '123456' },
    admin: { email: 'admin@drw.com', password: '123456' },
  };

  const fillDemo = (selectedRole) => {
    setRole(selectedRole);
    setEmail(demoCredentials[selectedRole].email);
    setPassword(demoCredentials[selectedRole].password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">DRW</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Bem-vindo de volta</h2>
            <p className="text-gray-600 mt-2">Entre na sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Conta
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-field"
              >
                <option value="cliente">Cliente</option>
                <option value="prestador">Prestador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Senha padrão para demo: 123456</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full">
              Entrar
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-4">Acesso rápido para demonstração:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => fillDemo('cliente')}
                className="text-xs bg-primary-50 text-primary-700 px-3 py-2 rounded hover:bg-primary-100 transition-colors"
              >
                Cliente
              </button>
              <button
                onClick={() => fillDemo('prestador')}
                className="text-xs bg-primary-50 text-primary-700 px-3 py-2 rounded hover:bg-primary-100 transition-colors"
              >
                Prestador
              </button>
              <button
                onClick={() => fillDemo('admin')}
                className="text-xs bg-primary-50 text-primary-700 px-3 py-2 rounded hover:bg-primary-100 transition-colors"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <a href="/" className="text-primary-600 hover:text-primary-700 font-medium">
                Cadastre-se
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

