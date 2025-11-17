import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star } from 'lucide-react';
import { mockServicos } from '../data/mockData';

const Loja = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [sortBy, setSortBy] = useState('nome');

  const categories = ['todas', ...Array.from(new Set(mockServicos.map(s => s.categoria)))];

  const filteredServices = mockServicos
    .filter(servico => {
      const matchesSearch = servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           servico.descricao.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'todas' || servico.categoria === selectedCategory;
      return matchesSearch && matchesCategory && servico.ativo;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'valor':
          return a.valor - b.valor;
        case 'prazo':
          return a.prazoUso - b.prazoUso;
        default:
          return a.nome.localeCompare(b.nome);
      }
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Nossa Loja de Serviços</h1>
        <p className="text-gray-600 text-lg">
          Escolha o serviço que você precisa e agende com os melhores prestadores
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar serviços..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'todas' ? 'Todas as categorias' : cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="nome">Ordenar por nome</option>
              <option value="valor">Ordenar por valor</option>
              <option value="prazo">Ordenar por prazo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((servico) => (
            <Link
              key={servico.id}
              to={`/servico/${servico.id}`}
              className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative mb-4">
                <img
                  src={servico.imagem}
                  alt={servico.nome}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {servico.permitePacote && (
                  <span className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                    Pacote
                  </span>
                )}
                {servico.permiteRecorrencia && (
                  <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                    Recorrente
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{servico.nome}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{servico.descricao}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-primary-600">
                    R$ {servico.valor.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  <span className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    {servico.categoria}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Prazo: {servico.prazoUso} dias</span>
                <span className="text-primary-600 font-medium">Ver detalhes →</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum serviço encontrado com os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
};

export default Loja;

