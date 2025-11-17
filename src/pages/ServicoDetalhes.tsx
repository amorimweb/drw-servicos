import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Calendar, CheckCircle } from 'lucide-react';
import { mockServicos } from '../data/mockData';

const ServicoDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const servico = mockServicos.find(s => s.id === id);

  if (!servico) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Serviço não encontrado</h2>
        <Link to="/loja" className="text-primary-600 hover:text-primary-700">
          Voltar para a loja
        </Link>
      </div>
    );
  }

  const handleComprar = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/checkout/${servico.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image and Basic Info */}
        <div>
          <img
            src={servico.imagem}
            alt={servico.nome}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />
          
          <div className="card">
            <h2 className="text-3xl font-bold mb-4">{servico.nome}</h2>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-4xl font-bold text-primary-600">
                R$ {servico.valor.toFixed(2).replace('.', ',')}
              </span>
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                {servico.categoria}
              </span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Prazo: {servico.prazoUso} dias
              </span>
              {servico.permitePacote && (
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Disponível em pacote
                </span>
              )}
              {servico.permiteRecorrencia && (
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Serviço recorrente
                </span>
              )}
            </div>

            <button onClick={handleComprar} className="btn-primary w-full text-lg py-3 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Comprar Agora
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Descrição</h3>
            <p className="text-gray-700 leading-relaxed">{servico.descricao}</p>
          </div>

          {servico.observacoes && (
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Observações</h3>
              <p className="text-gray-700">{servico.observacoes}</p>
            </div>
          )}

          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Informações Importantes</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Prazo de uso: {servico.prazoUso} dias a partir da compra</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Agendamento flexível com prestadores verificados</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Pagamento seguro via PIX, cartão ou boleto</span>
              </li>
              {servico.permitePacote && (
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Pacotes disponíveis com descontos especiais</span>
                </li>
              )}
            </ul>
          </div>

          <div className="card bg-primary-50 border-2 border-primary-200">
            <h3 className="text-xl font-semibold mb-2 text-primary-900">Como funciona?</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Compre o serviço pela plataforma</li>
              <li>Escolha o prestador e agende o horário</li>
              <li>O prestador executa o serviço</li>
              <li>Confirme e avalie após a conclusão</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicoDetalhes;

