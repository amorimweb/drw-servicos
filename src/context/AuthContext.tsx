import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { mockClientes, mockPrestadores } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Simular verificação de sessão
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, password: string, role: UserRole): boolean => {
    // Simulação de login - em produção viria do backend
    let foundUser: User | null = null;

    if (role === 'cliente') {
      foundUser = mockClientes.find(c => c.email === email) || null;
    } else if (role === 'prestador') {
      foundUser = mockPrestadores.find(p => p.email === email) || null;
    } else if (role === 'admin') {
      // Admin mockado
      foundUser = {
        id: 'admin1',
        nome: 'Administrador',
        email: 'admin@drw.com',
        telefone: '(11) 99999-9999',
        role: 'admin',
        createdAt: '2024-01-01T00:00:00Z',
      };
    }

    if (foundUser && password === '123456') { // Senha padrão para demo
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

