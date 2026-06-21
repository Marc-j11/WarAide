const { body } = require('express-validator');

const registerRules = [
  body('name').trim().notEmpty().withMessage('Le nom est requis'),
  body('email').trim().isEmail().withMessage('Email invalide'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Mot de passe requis'),
];

module.exports = { registerRules, loginRules };
