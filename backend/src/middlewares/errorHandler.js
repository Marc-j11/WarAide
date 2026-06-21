const config = require('../config');

function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';

  const body = {
    error: {
      message: err.message || 'Erreur interne du serveur',
      code,
    },
  };

  if (err.details) {
    body.error.details = err.details;
  }

  if (config.nodeEnv === 'development' && statusCode === 500 && !err.isOperational) {
    body.error.stack = err.stack;
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json(body);
}

module.exports = errorHandler;
