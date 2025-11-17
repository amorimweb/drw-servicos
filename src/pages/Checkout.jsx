import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, QrCode, FileText, Minus, Plus } from 'lucide-react';
import { mockServicos } from '../data/mockData';

const Checkout = () => {
  const { servicoId } = useParams();
  const navigate = useNavigate();
  
  const servico = mockServicos.find(s => s.id === servicoId);
  const [quantidade, setQuantidade] = useState(1);
  const [formaPagamento, setFormaPagamento] = useState('pix');
  const [parcelas, setParcelas] = useState(1);
  const [recorrencia, setRecorrencia] = useState(false);

  if (!servico) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Serviço não encontrado</h2>
        <button onClick={() => navigate('/loja')} className="text-primary-600">
          Voltar para a loja
        </button>
      </div>
    );
  }

  const valorUnitario = servico.valor;
  const descontoPacote = quantidade >= 5 ? 0.1 : quantidade >= 10 ? 0.15 : 0;
  const subtotal = valorUnitario * quantidade;
  const desconto = subtotal * descontoPacote;
  const valorTotal = subtotal - desconto;

  const handleFinalizar = () => {
    // Simular criação da compra
    alert('Compra realizada com sucesso! Redirecionando para agendamento...');
    // Em produção, aqui faria a chamada à API
    navigate(`/agendamento/compra-${Date.now()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resumo do Pedido */}
        <div className="lg:col-span-2 space-y-6">
          {/* Serviço */}
          <div className="card">
            <div className="flex items-start space-x-4">
              <img
                src={servico.imagem}
                alt={servico.nome}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-grow">
                <h3 className="text-xl font-semibold mb-2">{servico.nome}</h3>
                <p className="text-gray-600 text-sm mb-4">{servico.descricao}</p>
                
                {servico.permitePacote && (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-700">Quantidade:</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{quantidade}</span>
                      <button
                        onClick={() => setQuantidade(quantidade + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {quantidade >= 5 && (
                      <span className="text-sm text-green-600 font-medium">
                        {quantidade >= 10 ? '15% OFF' : '10% OFF'} em pacotes!
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-600">
                  R$ {valorUnitario.toFixed(2).replace('.', ',')}
                </p>
                <p className="text-sm text-gray-500">unidade</p>
              </div>
            </div>
          </div>

          {/* Forma de Pagamento */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Forma de Pagamento</h3>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="pagamento"
                  value="pix"
                  checked={formaPagamento === 'pix'}
                  onChange={() => setFormaPagamento('pix')}
                  className="mr-3"
                />
                <QrCode className="w-5 h-5 mr-3 text-primary-600" />
                <div className="flex-grow">
                  <div className="font-medium">PIX</div>
                  <div className="text-sm text-gray-500">Aprovação imediata</div>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="pagamento"
                  value="cartao"
                  checked={formaPagamento === 'cartao'}
                  onChange={() => setFormaPagamento('cartao')}
                  className="mr-3"
                />
                <CreditCard className="w-5 h-5 mr-3 text-primary-600" />
                <div className="flex-grow">
                  <div className="font-medium">Cartão de Crédito</div>
                  {formaPagamento === 'cartao' && (
                    <select
                      value={parcelas}
                      onChange={(e) => setParcelas(Number(e.target.value))}
                      className="mt-2 input-field text-sm"
                    >
                      {[1, 2, 3, 4, 5, 6, 10, 12].map(p => (
                        <option key={p} value={p}>
                          {p}x de R$ {(valorTotal / p).toFixed(2).replace('.', ',')}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </label>

              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="pagamento"
                  value="boleto"
                  checked={formaPagamento === 'boleto'}
                  onChange={() => setFormaPagamento('boleto')}
                  className="mr-3"
                />
                <FileText className="w-5 h-5 mr-3 text-primary-600" />
                <div className="flex-grow">
                  <div className="font-medium">Boleto Bancário</div>
                  <div className="text-sm text-gray-500">Aprovação em até 2 dias úteis</div>
                </div>
              </label>
            </div>
          </div>

          {/* Recorrência */}
          {servico.permiteRecorrencia && (
            <div className="card">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={recorrencia}
                  onChange={(e) => setRecorrencia(e.target.checked)}
                  className="mr-3 w-5 h-5"
                />
                <div>
                  <div className="font-medium">Assinar serviço recorrente</div>
                  <div className="text-sm text-gray-500">
                    Serviço será renovado automaticamente a cada {servico.prazoUso} dias
                  </div>
                </div>
              </label>
            </div>
          )}
        </div>

        {/* Resumo Financeiro */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h3 className="text-xl font-semibold mb-4">Resumo do Pedido</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({quantidade}x)</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              {desconto > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto ({Math.round(descontoPacote * 100)}%)</span>
                  <span>- R$ {desconto.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-600">R$ {valorTotal.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            {formaPagamento === 'cartao' && parcelas > 1 && (
              <div className="bg-primary-50 p-3 rounded-lg mb-4 text-sm">
                <p className="text-gray-700">
                  {parcelas}x de R$ {(valorTotal / parcelas).toFixed(2).replace('.', ',')}
                </p>
              </div>
            )}

            <button onClick={handleFinalizar} className="btn-primary w-full text-lg py-3">
              Finalizar Compra
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Ao finalizar, você será redirecionado para escolher o prestador e agendar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

