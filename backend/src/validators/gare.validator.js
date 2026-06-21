const { body, param, query } = require('express-validator');

const createGareRules = [
  body('nom').trim().notEmpty().withMessage('Le nom est requis'),
  body('type').optional().trim().isString(),
  body('categorie').optional().trim().isString(),
  body('latitude').optional().isFloat({ min: -90, max: 90 }),
  body('longitude').optional().isFloat({ min: -180, max: 180 }),
];

const updateGareRules = [
  param('id').isInt({ min: 1 }).withMessage('ID invalide'),
  body('nom').optional().trim().notEmpty(),
  body('type').optional().trim().isString(),
  body('categorie').optional().trim().isString(),
  body('latitude').optional().isFloat({ min: -90, max: 90 }),
  body('longitude').optional().isFloat({ min: -180, max: 180 }),
];

const gareIdRules = [param('id').isInt({ min: 1 }).withMessage('ID invalide')];

const listGareRules = [query('nom').optional().trim().isString()];

const nearbyGareRules = [
  query('lat').isFloat({ min: -90, max: 90 }).withMessage('lat requis (-90 à 90)'),
  query('lng').isFloat({ min: -180, max: 180 }).withMessage('lng requis (-180 à 180)'),
  query('limit').optional().isInt({ min: 1, max: 50 }),
];

module.exports = {
  createGareRules,
  updateGareRules,
  gareIdRules,
  listGareRules,
  nearbyGareRules,
};
