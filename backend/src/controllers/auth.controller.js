const jwt = require('jsonwebtoken');
const AppError = require('../errors/AppError');
const config = require('../config');
const authService = require('../services/auth.service');

const authController = {
  register(req, res) {
    const result = authService.register(req.body);
    res.status(201).json({ data: result });
  },

  login(req, res) {
    const result = authService.login(req.body);
    res.json({ data: result });
  },

  me(req, res) {
    const user = authService.getProfile(req.user.userId);
    res.json({ data: user });
  },
};

module.exports = authController;
