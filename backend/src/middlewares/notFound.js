const AppError = require('../errors/AppError');

function notFound(req, res, next) {
  next(new AppError(`Route ${req.method} ${req.originalUrl} introuvable`, 404, 'NOT_FOUND'));
}

module.exports = notFound;
