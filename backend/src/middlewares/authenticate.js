const jwt = require('jsonwebtoken');
const AppError = require('../errors/AppError');
const config = require('../config');

function authenticate(req, _res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new AppError('Token manquant', 401, 'UNAUTHORIZED'));
  }

  const token = header.slice(7);
  try {
    req.user = jwt.verify(token, config.auth.jwtSecret);
    next();
  } catch {
    next(new AppError('Token invalide ou expiré', 401, 'UNAUTHORIZED'));
  }
}

module.exports = authenticate;
