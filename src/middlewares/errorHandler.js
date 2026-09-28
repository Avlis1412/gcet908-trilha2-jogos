const AppError = require('../errors/AppError');

function errorHandler(err, req, res, next) {
  // AppError (erros de negócio)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      erro: err.message,
      tipo: 'app_error',
    });
  }

  // Erros do Prisma (checa pelo código, sem instanceof)
  const prismaCode = err.code || err.meta?.code;

  if (prismaCode === 'P2002') {
    const campo = err.meta?.target?.join(', ') || 'campo único';
    return res.status(409).json({
      erro: `Valor duplicado no campo: ${campo}`,
      tipo: 'unique_violation',
    });
  }

  if (prismaCode === 'P2025') {
    return res.status(404).json({
      erro: 'Registro não encontrado',
      tipo: 'not_found',
    });
  }

  if (prismaCode === 'P2003') {
    return res.status(409).json({
      erro: 'Operação viola integridade referencial (chave estrangeira)',
      tipo: 'foreign_key_violation',
    });
  }

  if (prismaCode === 'P2014') {
    return res.status(409).json({
      erro: 'Não é possível excluir: existem registros dependentes',
      tipo: 'referential_integrity',
    });
  }

  // Log do erro real para debug no terminal
  console.error('❌ Erro interno:', err);
  console.error('   Code:', err.code);
  console.error('   Name:', err.name);
  console.error('   Message:', err.message);

  return res.status(500).json({
    erro: 'Erro interno do servidor',
    tipo: 'internal_error',
  });
}

module.exports = errorHandler;