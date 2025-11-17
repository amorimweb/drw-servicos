// Tipos e interfaces do sistema (documentação para referência)
// Em JavaScript, os tipos são inferidos automaticamente

// UserRole: 'admin' | 'cliente' | 'prestador'
// User: { id, nome, email, telefone, role, avatar?, createdAt }
// Cliente: User + { cpf?, endereco? }
// Prestador: User + { cnpj?, status, especialidades, avaliacaoMedia, totalAvaliacoes, localizacao?, online }
// Endereco: { rua, numero, complemento?, bairro, cidade, estado, cep, latitude?, longitude? }
// Localizacao: { latitude, longitude, endereco }
// Servico: { id, nome, descricao, imagem, valor, observacoes?, prazoUso, categoria, ativo, permitePacote, permiteRecorrencia }
// Compra: { id, clienteId, servicoId, servico, quantidade, valorTotal, formaPagamento, parcelas?, recorrencia?, status, dataCompra, dataVencimento?, servicosUtilizados, servicosDisponiveis }
// Agendamento: { id, compraId, clienteId, prestadorId, servicoId, dataHora, endereco, status, observacoes?, createdAt }
// ExecucaoServico: { id, agendamentoId, fotosIniciais, fotosDurante, fotosFinais, observacoesIniciais?, observacoesDurante?, observacoesFinais?, iniciadoEm?, finalizadoEm?, confirmadoPorCliente, confirmadoEm? }
// Avaliacao: { id, agendamentoId, prestadorId, clienteId, nota, comentario?, dataAvaliacao }
// Reclamacao: { id, agendamentoId, clienteId, prestadorId, motivo, descricao, status, dataAbertura, resolucao? }
// Mensagem: { id, agendamentoId, remetenteId, destinatarioId, conteudo, tipo, dataEnvio, lida }
// TransacaoFinanceira: { id, prestadorId, agendamentoId, valor, status, dataServico, dataPagamento?, observacoes? }

// Este arquivo serve apenas como documentação de referência
// Os tipos são inferidos automaticamente pelo JavaScript

