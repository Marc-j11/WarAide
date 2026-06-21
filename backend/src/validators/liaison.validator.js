const { body, param } = require('express-validator');

const createLiaisonRules = [
  body('gare_depart_id').isInt({ min: 1 }).withMessage('gare_depart_id requis'),
  body('gare_arrivee_id').isInt({ min: 1 }).withMessage('gare_arrivee_id requis'),
  body('transport').trim().notEmpty().withMessage('Le transport est requis'),
  body('direction').trim().notEmpty().withMessage('La direction est requise'),
  body('prix').isInt({ min: 0 }).withMessage('Le prix doit être un entier positif'),
  body('temps').isInt({ min: 0 }).withMessage('Le temps doit être un entier positif'),
];

const updateLiaisonRules = [
  param('id').isInt({ min: 1 }).withMessage('ID invalide'),
  body('gare_depart_id').optional().isInt({ min: 1 }),
  body('gare_arrivee_id').optional().isInt({ min: 1 }),
  body('transport').optional().trim().notEmpty(),
  body('direction').optional().trim().notEmpty(),
  body('prix').optional().isInt({ min: 0 }),
  body('temps').optional().isInt({ min: 0 }),
];

const liaisonIdRules = [param('id').isInt({ min: 1 }).withMessage('ID invalide')];

module.exports = {
  createLiaisonRules,
  updateLiaisonRules,
  liaisonIdRules,
};
