import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, Clock, Shield } from 'lucide-react';
import { mockServicos } from '../data/mockData';

const Home = () => {
  const featuredServices = mockServicos.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transforme sua operação de serviços em um fluxo digital
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Conectamos clientes e prestadores de forma simples, eficiente e totalmente automatizada
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/loja" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center">
                Explorar Serviços
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/prestadores" className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors inline-flex items-center justify-center border-2 border-white">
                Seja um Prestador
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Por que escolher a DRW Serviços?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Processo Simples</h3>
              <p className="text-gray-600">Compra, agenda e confirma tudo pela plataforma</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Prestadores Verificados</h3>
              <p className="text-gray-600">Todos os prestadores são aprovados e avaliados</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Agendamento Flexível</h3>
              <p className="text-gray-600">Escolha o prestador e horário que melhor se encaixa</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Seguro e Confiável</h3>
              <p className="text-gray-600">Pagamentos seguros e histórico completo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Serviços em Destaque</h2>
            <Link to="/loja" className="text-primary-600 hover:text-primary-700 font-semibold flex items-center">
              Ver todos
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredServices.map((servico) => (
              <Link
                key={servico.id}
                to={`/servico/${servico.id}`}
                className="card hover:shadow-lg transition-shadow"
              >
                <img
                  src={servico.imagem}
                  alt={servico.nome}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{servico.nome}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{servico.descricao}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary-600">
                    R$ {servico.valor.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-sm text-gray-500">Prazo: {servico.prazoUso} dias</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Cadastre-se agora e tenha acesso a centenas de serviços profissionais
          </p>
          <Link to="/loja" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
            Começar Agora
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

