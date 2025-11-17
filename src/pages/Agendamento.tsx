import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, User, CheckCircle, Map } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { mockPrestadores, mockClientes, mockCompras } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const Agendamento = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [viewMode, setViewMode] = useState<'mapa' | 'lista'>('mapa');
  const [selectedPrestador, setSelectedPrestador] = useState<string | null>(null);
  const [dataHora, setDataHora] = useState('');
  const [endereco, setEndereco] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Simular busca da compra
  const compra = mockCompras[0]; // Em produção, buscar por ID
  const servico = compra?.servico;
  const cliente = mockClientes.find(c => c.id === user?.id);
  
  const prestadoresDisponiveis = mockPrestadores.filter(p => 
    p.status === 'aprovado' && 
    p.especialidades.some(e => servico?.categoria.includes(e) || e.includes(servico?.categoria || ''))
  );

  const handleAgendar = () => {
    if (!selectedPrestador || !dataHora || !endereco) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    alert('Agendamento realizado com sucesso! O prestador receberá uma notificação.');
    navigate('/meus-servicos');
  };

  if (!compra || !servico) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Compra não encontrada</h2>
        <button onClick={() => navigate('/loja')} className="text-primary-600">
          Voltar para a loja
        </button>
      </div>
    );
  }

  const defaultCenter: [number, number] = cliente?.endereco?.latitude && cliente.endereco.longitude
    ? [cliente.endereco.latitude, cliente.endereco.longitude]
    : [-23.5505, -46.6333];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Agendar Serviço</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informações do Serviço */}
        <div className="lg:col-span-1">
          <div className="card mb-6">
            <h3 className="text-xl font-semibold mb-4">Serviço Contratado</h3>
            <div className="flex items-start space-x-4 mb-4">
              <img
                src={servico.imagem}
                alt={servico.nome}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <h4 className="font-semibold">{servico.nome}</h4>
                <p className="text-sm text-gray-600">{servico.categoria}</p>
                <p className="text-primary-600 font-bold mt-1">
                  R$ {compra.valorTotal.toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>Serviços disponíveis: {compra.servicosDisponiveis}</p>
              <p>Serviços utilizados: {compra.servicosUtilizados}</p>
            </div>
          </div>

          {/* Formulário de Agendamento */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Dados do Agendamento</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Data e Hora
                </label>
                <input
                  type="datetime-local"
                  value={dataHora}
                  onChange={(e) => setDataHora(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Endereço de Execução
                </label>
                <textarea
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  className="input-field"
                  rows={3}
                  placeholder={cliente?.endereco ? `${cliente.endereco.rua}, ${cliente.endereco.numero} - ${cliente.endereco.bairro}` : 'Digite o endereço completo'}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações (opcional)
                </label>
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="input-field"
                  rows={2}
                  placeholder="Instruções especiais, portão, interfone, etc."
                />
              </div>

              {selectedPrestador && (
                <button
                  onClick={handleAgendar}
                  className="btn-primary w-full"
                >
                  Confirmar Agendamento
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Seleção de Prestador */}
        <div className="lg:col-span-2">
          <div className="card mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Escolher Prestador</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('mapa')}
                  className={`px-4 py-2 rounded-lg ${viewMode === 'mapa' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  <Map className="w-4 h-4 inline mr-1" />
                  Mapa
                </button>
                <button
                  onClick={() => setViewMode('lista')}
                  className={`px-4 py-2 rounded-lg ${viewMode === 'lista' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Lista
                </button>
              </div>
            </div>

            {viewMode === 'mapa' ? (
              <div className="h-96 rounded-lg overflow-hidden">
                <MapContainer
                  center={defaultCenter}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  {cliente?.endereco?.latitude && cliente.endereco.longitude && (
                    <Marker position={[cliente.endereco.latitude, cliente.endereco.longitude]}>
                      <Popup>Seu endereço</Popup>
                    </Marker>
                  )}
                  {prestadoresDisponiveis.map(prestador => {
                    if (!prestador.localizacao) return null;
                    return (
                      <Marker
                        key={prestador.id}
                        position={[prestador.localizacao.latitude, prestador.localizacao.longitude]}
                      >
                        <Popup>
                          <div>
                            <p className="font-semibold">{prestador.nome}</p>
                            <p className="text-sm">⭐ {prestador.avaliacaoMedia.toFixed(1)}</p>
                            <button
                              onClick={() => setSelectedPrestador(prestador.id)}
                              className="text-xs text-primary-600 mt-1"
                            >
                              Selecionar
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>
            ) : (
              <div className="space-y-4">
                {prestadoresDisponiveis.map(prestador => (
                  <div
                    key={prestador.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPrestador === prestador.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => setSelectedPrestador(prestador.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-grow">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{prestador.nome}</h4>
                            {prestador.online && (
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{prestador.especialidades.join(', ')}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="flex items-center text-sm">
                              ⭐ {prestador.avaliacaoMedia.toFixed(1)}
                              <span className="text-gray-500 ml-1">({prestador.totalAvaliacoes})</span>
                            </span>
                            {prestador.localizacao && (
                              <span className="text-sm text-gray-500 flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {prestador.localizacao.endereco}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {selectedPrestador === prestador.id && (
                        <CheckCircle className="w-6 h-6 text-primary-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agendamento;

