import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Send, MessageCircle, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockMensagens, mockAgendamentos, mockClientes, mockPrestadores } from '../data/mockData';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

const Chat = () => {
  const { agendamentoId } = useParams<{ agendamentoId: string }>();
  const { user } = useAuth();
  const [mensagem, setMensagem] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const agendamento = mockAgendamentos.find(a => a.id === agendamentoId);
  const mensagens = mockMensagens.filter(m => m.agendamentoId === agendamentoId);

  const outroUsuario = user?.role === 'cliente'
    ? mockPrestadores.find(p => p.id === agendamento?.prestadorId)
    : mockClientes.find(c => c.id === agendamento?.clienteId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const handleSend = () => {
    if (!mensagem.trim()) return;
    // Em produção, enviaria para o backend
    setMensagem('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="card mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Chat com {outroUsuario?.nome}</h2>
                <p className="text-sm text-gray-600">
                  Agendamento #{agendamentoId?.slice(0, 8)}
                </p>
              </div>
            </div>
            <a
              href={`https://wa.me/55${outroUsuario?.telefone?.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="card">
          {/* Mensagens */}
          <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-lg">
            {mensagens.length > 0 ? (
              mensagens.map(msg => {
                const isMine = msg.remetenteId === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isMine
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm">{msg.conteudo}</p>
                      <p className={`text-xs mt-1 ${
                        isMine ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {format(new Date(msg.dataEnvio), "HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-500 py-8">
                Nenhuma mensagem ainda. Inicie a conversa!
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua mensagem..."
              className="input-field flex-grow"
            />
            <button
              onClick={handleSend}
              className="btn-primary px-6"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2 text-center">
            As mensagens via WhatsApp também ficam registradas aqui
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;

