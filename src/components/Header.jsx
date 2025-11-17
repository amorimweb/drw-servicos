import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleLabel = () => {
    if (!user) return '';
    switch (user.role) {
      case 'admin': return 'Admin';
      case 'cliente': return 'Cliente';
      case 'prestador': return 'Prestador';
      default: return '';
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">DRW</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Serviços</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Início
            </Link>
            <Link to="/loja" className="text-gray-700 hover:text-primary-600 transition-colors">
              Loja
            </Link>
            <Link to="/prestadores" className="text-gray-700 hover:text-primary-600 transition-colors">
              Prestadores
            </Link>
            
            {isAuthenticated ? (
              <>
                {user?.role === 'cliente' && (
                  <>
                    <Link to="/meus-servicos" className="text-gray-700 hover:text-primary-600 transition-colors">
                      Meus Serviços
                    </Link>
                    <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                      Dashboard
                    </Link>
                  </>
                )}
                {user?.role === 'prestador' && (
                  <>
                    <Link to="/dashboard-prestador" className="text-gray-700 hover:text-primary-600 transition-colors">
                      Dashboard
                    </Link>
                    <Link to="/financeiro" className="text-gray-700 hover:text-primary-600 transition-colors">
                      Financeiro
                    </Link>
                  </>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary-600 transition-colors">
                    Admin
                  </Link>
                )}
                
                <div className="flex items-center space-x-4 pl-4 border-l border-gray-300">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700">{user?.nome}</span>
                    <span className="text-xs text-gray-500">({getRoleLabel()})</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sair</span>
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="btn-primary">
                Entrar
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>
                Início
              </Link>
              <Link to="/loja" className="text-gray-700 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>
                Loja
              </Link>
              <Link to="/prestadores" className="text-gray-700 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>
                Prestadores
              </Link>
              
              {isAuthenticated ? (
                <>
                  {user?.role === 'cliente' && (
                    <>
                      <Link to="/meus-servicos" className="text-gray-700 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>
                        Meus Serviços
                      </Link>
                      <Link to="/dashboard" className="text-gray-700 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>
                        Dashboard
                      </Link>
                    </>
                  )}
                  {user?.role === 'prestador' && (
                    <>
                      <Link to="/dashboard-prestador" className="text-gray-700 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>
                        Dashboard
                      </Link>
                      <Link to="/financeiro" className="text-gray-700 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>
                        Financeiro
                      </Link>
                    </>
                  )}
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="text-gray-700 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>
                      Admin
                    </Link>
                  )}
                  
                  <div className="pt-3 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">
                      {user?.nome} ({getRoleLabel()})
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-red-600 hover:text-red-700 flex items-center space-x-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair</span>
                    </button>
                  </div>
                </>
              ) : (
                <Link to="/login" className="btn-primary text-center" onClick={() => setMobileMenuOpen(false)}>
                  Entrar
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

