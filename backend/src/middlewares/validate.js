const { validationResult } = require('express-validator');
const AppError = require('../errors/AppError');

function validate(validations) {
  return async (req, res, next) => {
    await Promise.all(validations.map((v) => v.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new AppError('Données invalides', 400, 'VALIDATION_ERROR', errors.array())
      );
    }
    next();
  };
}

module.exports = validate;
