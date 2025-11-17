import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';

const CadastroServico = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    imagem: '',
    valor: '',
    observacoes: '',
    prazoUso: '',
    categoria: '',
    permitePacote: false,
    permiteRecorrencia: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Serviço cadastrado com sucesso!');
    navigate('/admin');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Cadastrar Novo Serviço</h1>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Serviço *
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição *
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="input-field"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL da Imagem *
            </label>
            <input
              type="url"
              value={formData.imagem}
              onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
              className="input-field"
              placeholder="https://..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prazo de Uso (dias) *
              </label>
              <input
                type="number"
                value={formData.prazoUso}
                onChange={(e) => setFormData({ ...formData, prazoUso: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria *
            </label>
            <select
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Selecione...</option>
              <option value="Elétrica">Elétrica</option>
              <option value="Hidráulica">Hidráulica</option>
              <option value="Pintura">Pintura</option>
              <option value="Marcenaria">Marcenaria</option>
              <option value="Limpeza">Limpeza</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              className="input-field"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.permitePacote}
                onChange={(e) => setFormData({ ...formData, permitePacote: e.target.checked })}
                className="mr-3 w-5 h-5"
              />
              <span>Permitir venda em pacotes</span>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.permiteRecorrencia}
                onChange={(e) => setFormData({ ...formData, permiteRecorrencia: e.target.checked })}
                className="mr-3 w-5 h-5"
              />
              <span>Permitir serviço recorrente</span>
            </label>
          </div>

          <div className="flex space-x-4 pt-4">
            <button type="submit" className="btn-primary flex items-center">
              <Save className="w-5 h-5 mr-2" />
              Salvar Serviço
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="btn-secondary flex items-center"
            >
              <X className="w-5 h-5 mr-2" />
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroServico;

