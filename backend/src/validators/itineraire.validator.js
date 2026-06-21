const { body } = require('express-validator');

const itineraireRules = [
  body('departId').isInt({ min: 1 }).withMessage('departId requis'),
  body('arriveeId').isInt({ min: 1 }).withMessage('arriveeId requis'),
  body('critere')
    .optional()
    .isIn(['prix', 'temps'])
    .withMessage('critere doit être "prix" ou "temps"'),
];

module.exports = { itineraireRules };
