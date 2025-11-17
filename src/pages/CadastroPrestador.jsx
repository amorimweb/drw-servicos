import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { mockPrestadores } from '../data/mockData';

const CadastroPrestador = () => {
  const [prestadores] = useState(mockPrestadores);

  const handleAprovar = (id) => {
    alert(`Prestador ${id} aprovado com sucesso!`);
  };

  const handleRejeitar = (id) => {
    alert(`Prestador ${id} rejeitado.`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gerenciar Prestadores</h1>

      <div className="space-y-6">
        {prestadores.map(prestador => (
          <div key={prestador.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-grow">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-xl">
                      {prestador.nome.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{prestador.nome}</h3>
                    <p className="text-gray-600">{prestador.email}</p>
                    <p className="text-sm text-gray-500">{prestador.telefone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">CNPJ:</p>
                    <p className="font-medium">{prestador.cnpj || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Especialidades:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
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
                  <div>
                    <p className="text-sm text-gray-600">Avaliação Média:</p>
                    <p className="font-medium">
                      ⭐ {prestador.avaliacaoMedia.toFixed(1)} ({prestador.totalAvaliacoes} avaliações)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status:</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      prestador.status === 'aprovado' ? 'bg-green-100 text-green-800' :
                      prestador.status === 'standby' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {prestador.status === 'aprovado' ? 'Aprovado' :
                       prestador.status === 'standby' ? 'Aguardando Aprovação' :
                       'Rejeitado'}
                    </span>
                  </div>
                </div>
              </div>

              {prestador.status === 'standby' && (
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleAprovar(prestador.id)}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Aprovar</span>
                  </button>
                  <button
                    onClick={() => handleRejeitar(prestador.id)}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Rejeitar</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CadastroPrestador;

