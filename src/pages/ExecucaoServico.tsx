import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, CheckCircle, Upload, MapPin, Clock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockAgendamentos, mockClientes } from '../data/mockData';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

const ExecucaoServico = () => {
  const { agendamentoId } = useParams<{ agendamentoId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [etapa, setEtapa] = useState<'pre' | 'durante' | 'final'>('pre');
  const [fotosIniciais, setFotosIniciais] = useState<string[]>([]);
  const [fotosDurante, setFotosDurante] = useState<string[]>([]);
  const [fotosFinais, setFotosFinais] = useState<string[]>([]);
  const [observacoesIniciais, setObservacoesIniciais] = useState('');
  const [observacoesDurante, setObservacoesDurante] = useState('');
  const [observacoesFinais, setObservacoesFinais] = useState('');
  const [servicoIniciado, setServicoIniciado] = useState(false);
  const [servicoFinalizado, setServicoFinalizado] = useState(false);

  const agendamento = mockAgendamentos.find(a => a.id === agendamentoId);
  const cliente = mockClientes.find(c => c.id === agendamento?.clienteId);

  const handleFotoUpload = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    // Simular upload de foto
    const novaFoto = `https://images.unsplash.com/photo-${Date.now()}?w=400`;
    setter(prev => [...prev, novaFoto]);
  };

  const handleIniciarServico = () => {
    setServicoIniciado(true);
    setEtapa('durante');
  };

  const handleFinalizarServico = () => {
    setServicoFinalizado(true);
    setEtapa('final');
  };

  const handleConfirmarFinalizacao = () => {
    alert('Serviço finalizado! Aguardando confirmação do cliente.');
    navigate('/dashboard-prestador');
  };

  if (!agendamento) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Agendamento não encontrado</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Execução do Serviço</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informações do Agendamento */}
        <div className="lg:col-span-1">
          <div className="card mb-6">
            <h3 className="text-xl font-semibold mb-4">Informações do Serviço</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-gray-700">Cliente: {cliente?.nome}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-gray-700">
                  {format(new Date(agendamento.dataHora), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
              <div className="flex items-start text-sm">
                <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-0.5" />
                <span className="text-gray-700">
                  {agendamento.endereco.rua}, {agendamento.endereco.numero}
                  <br />
                  {agendamento.endereco.bairro} - {agendamento.endereco.cidade}
                </span>
              </div>
              {agendamento.observacoes && (
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">
                    <strong>Observações:</strong> {agendamento.observacoes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Status</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <CheckCircle className={`w-5 h-5 mr-2 ${etapa !== 'pre' ? 'text-green-600' : 'text-gray-300'}`} />
                <span className={etapa !== 'pre' ? 'text-gray-900' : 'text-gray-400'}>
                  Pré-atendimento
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircle className={`w-5 h-5 mr-2 ${servicoIniciado ? 'text-green-600' : 'text-gray-300'}`} />
                <span className={servicoIniciado ? 'text-gray-900' : 'text-gray-400'}>
                  Serviço em andamento
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircle className={`w-5 h-5 mr-2 ${servicoFinalizado ? 'text-green-600' : 'text-gray-300'}`} />
                <span className={servicoFinalizado ? 'text-gray-900' : 'text-gray-400'}>
                  Finalização
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de Execução */}
        <div className="lg:col-span-2">
          {/* Pré-Atendimento */}
          {etapa === 'pre' && (
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Pré-Atendimento</h3>
              <p className="text-gray-600 mb-6">
                Registre o estado inicial do local antes de iniciar o serviço
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fotos Iniciais
                  </label>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {fotosIniciais.map((foto, index) => (
                      <img
                        key={index}
                        src={foto}
                        alt={`Foto inicial ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                    {fotosIniciais.length < 6 && (
                      <button
                        onClick={() => handleFotoUpload(setFotosIniciais)}
                        className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary-500 transition-colors"
                      >
                        <Camera className="w-8 h-8 text-gray-400" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações Iniciais
                  </label>
                  <textarea
                    value={observacoesIniciais}
                    onChange={(e) => setObservacoesIniciais(e.target.value)}
                    className="input-field"
                    rows={4}
                    placeholder="Descreva o estado inicial do local, problemas encontrados, etc."
                  />
                </div>

                <button
                  onClick={handleIniciarServico}
                  className="btn-primary w-full"
                >
                  Iniciar Serviço
                </button>
              </div>
            </div>
          )}

          {/* Durante o Serviço */}
          {etapa === 'durante' && !servicoFinalizado && (
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Durante a Execução</h3>
              <p className="text-gray-600 mb-6">
                Registre fotos e observações durante o trabalho
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fotos Durante o Serviço
                  </label>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {fotosDurante.map((foto, index) => (
                      <img
                        key={index}
                        src={foto}
                        alt={`Foto durante ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                    <button
                      onClick={() => handleFotoUpload(setFotosDurante)}
                      className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary-500 transition-colors"
                    >
                      <Camera className="w-8 h-8 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações Durante o Serviço
                  </label>
                  <textarea
                    value={observacoesDurante}
                    onChange={(e) => setObservacoesDurante(e.target.value)}
                    className="input-field"
                    rows={4}
                    placeholder="Registre o progresso, materiais utilizados, etc."
                  />
                </div>

                <button
                  onClick={handleFinalizarServico}
                  className="btn-primary w-full"
                >
                  Finalizar Serviço
                </button>
              </div>
            </div>
          )}

          {/* Finalização */}
          {etapa === 'final' && (
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Finalização</h3>
              <p className="text-gray-600 mb-6">
                Registre o resultado final do serviço
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fotos Finais
                  </label>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {fotosFinais.map((foto, index) => (
                      <img
                        key={index}
                        src={foto}
                        alt={`Foto final ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                    {fotosFinais.length < 6 && (
                      <button
                        onClick={() => handleFotoUpload(setFotosFinais)}
                        className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary-500 transition-colors"
                      >
                        <Camera className="w-8 h-8 text-gray-400" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações Finais
                  </label>
                  <textarea
                    value={observacoesFinais}
                    onChange={(e) => setObservacoesFinais(e.target.value)}
                    className="input-field"
                    rows={4}
                    placeholder="Descreva o trabalho realizado, recomendações, etc."
                  />
                </div>

                <button
                  onClick={handleConfirmarFinalizacao}
                  className="btn-primary w-full"
                >
                  Confirmar Finalização
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecucaoServico;

