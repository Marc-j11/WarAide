const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const AppError = require('../errors/AppError');
const config = require('../config');

function splitName(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return {
    prenom: parts[0] || 'Utilisateur',
    nom: parts.slice(1).join(' '),
  };
}

function signToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    config.auth.jwtSecret,
    { expiresIn: config.auth.jwtExpiresIn }
  );
}

function toPublicUser(user) {
  return {
    id: user.id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
  };
}

const authService = {
  register({ name, email, password }) {
    if (userRepository.findByEmail(email)) {
      throw new AppError('Cet email est déjà utilisé', 409, 'EMAIL_ALREADY_EXISTS');
    }

    const { nom, prenom } = splitName(name);
    const hash = bcrypt.hashSync(password, 10);
    const user = userRepository.create({
      nom,
      prenom,
      email: email.toLowerCase(),
      mot_de_passe: hash,
    });

    return {
      user: toPublicUser(user),
      token: signToken(user),
    };
  },

  login({ email, password }) {
    const user = userRepository.findByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.mot_de_passe)) {
      throw new AppError('Email ou mot de passe incorrect', 401, 'INVALID_CREDENTIALS');
    }

    return {
      user: toPublicUser(user),
      token: signToken(user),
    };
  },

  getProfile(userId) {
    const user = userRepository.findById(userId);
    if (!user) throw new AppError('Utilisateur introuvable', 404, 'USER_NOT_FOUND');
    return toPublicUser(user);
  },
};

module.exports = authService;
