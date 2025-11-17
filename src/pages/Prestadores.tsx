import { useState } from 'react';
import { Star, MapPin, CheckCircle } from 'lucide-react';
import { mockPrestadores } from '../data/mockData';

const Prestadores = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'aprovado' | 'online'>('todos');

  const prestadoresFiltrados = mockPrestadores.filter(p => {
    const matchesSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.especialidades.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'todos' ||
                         (filterStatus === 'aprovado' && p.status === 'aprovado') ||
                         (filterStatus === 'online' && p.online);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Nossos Prestadores</h1>
        <p className="text-gray-600 text-lg">
          Conheça os profissionais verificados e avaliados da nossa plataforma
        </p>
      </div>

      {/* Filtros */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Buscar por nome ou especialidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'todos' | 'aprovado' | 'online')}
            className="input-field"
          >
            <option value="todos">Todos os prestadores</option>
            <option value="aprovado">Apenas aprovados</option>
            <option value="online">Apenas online</option>
          </select>
        </div>
      </div>

      {/* Lista de Prestadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prestadoresFiltrados.map(prestador => (
          <div key={prestador.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-xl">
                    {prestador.nome.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{prestador.nome}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    {prestador.online && (
                      <span className="flex items-center text-sm text-green-600">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        Online
                      </span>
                    )}
                    {prestador.status === 'aprovado' && (
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center space-x-1 mb-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">{prestador.avaliacaoMedia.toFixed(1)}</span>
                <span className="text-sm text-gray-500">
                  ({prestador.totalAvaliacoes} avaliações)
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {prestador.especialidades.map((esp, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs"
                  >
                    {esp}
                  </span>
                ))}
              </div>
            </div>

            {prestador.localizacao && (
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="truncate">{prestador.localizacao.endereco}</span>
              </div>
            )}

            <div className="pt-4 border-t">
              {prestador.status === 'standby' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-yellow-800">
                    Aguardando aprovação do administrador
                  </p>
                </div>
              )}
              
              {prestador.status === 'aprovado' && (
                <div className="text-sm text-gray-600">
                  <p className="mb-2">Status: <span className="text-green-600 font-medium">Aprovado</span></p>
                  {prestador.cnpj && (
                    <p className="text-xs">CNPJ: {prestador.cnpj}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {prestadoresFiltrados.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum prestador encontrado com os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
};

export default Prestadores;

