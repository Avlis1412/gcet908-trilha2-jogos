const { Prisma } = require('@prisma/client');
const AppError = require('../errors/AppError');

function errorHandler(err, req, res, next) {
  // Erros customizados (AppError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      erro: err.message,
      tipo: 'app_error',
    });
  }

  // Erros do Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Violação de UNIQUE
    if (err.code === 'P2002') {
      const campo = err.meta?.target?.join(', ') || 'campo único';
      return res.status(409).json({
        erro: `Valor duplicado no campo: ${campo}`,
        tipo: 'unique_violation',
      });
    }

    // Registro não encontrado
    if (err.code === 'P2025') {
      return res.status(404).json({
        erro: 'Registro não encontrado',
        tipo: 'not_found',
      });
    }

    // Violação de FOREIGN KEY
    if (err.code === 'P2003') {
      return res.status(409).json({
        erro: 'Operação viola integridade referencial (chave estrangeira)',
        tipo: 'foreign_key_violation',
      });
    }

    // Restrição de exclusão (RESTRICT)
    if (err.code === 'P2014') {
      return res.status(409).json({
        erro: 'Não é possível excluir: existem registros dependentes',
        tipo: 'referential_integrity',
      });
    }
  }

  // Erro genérico — nunca vazar a mensagem crua do SGBD
  console.error('❌ Erro interno:', err);
  return res.status(500).json({
    erro: 'Erro interno do servidor',
    tipo: 'internal_error',
  });
}

module.exports = errorHandler;