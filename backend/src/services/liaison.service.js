const gareRepository = require('../repositories/gare.repository');
const liaisonRepository = require('../repositories/liaison.repository');
const AppError = require('../errors/AppError');

const liaisonService = {
  list(query) {
    return liaisonRepository.findAll(query);
  },

  getById(id) {
    const liaison = liaisonRepository.findById(id);
    if (!liaison) throw new AppError('Liaison introuvable', 404, 'LIAISON_NOT_FOUND');
    return liaison;
  },

  create(data) {
    if (!gareRepository.findById(data.gare_depart_id)) {
      throw new AppError('Gare de départ introuvable', 404, 'GARE_DEPART_NOT_FOUND');
    }
    if (!gareRepository.findById(data.gare_arrivee_id)) {
      throw new AppError("Gare d'arrivée introuvable", 404, 'GARE_ARRIVEE_NOT_FOUND');
    }
    if (data.gare_depart_id === data.gare_arrivee_id) {
      throw new AppError('La gare de départ et d\'arrivée doivent être différentes', 400, 'SAME_GARE');
    }

    try {
      return liaisonRepository.create(data);
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new AppError('Cette liaison existe déjà', 409, 'LIAISON_DUPLICATE');
      }
      throw err;
    }
  },

  update(id, data) {
    const existing = liaisonRepository.findById(id);
    if (!existing) throw new AppError('Liaison introuvable', 404, 'LIAISON_NOT_FOUND');

    const departId = data.gare_depart_id ?? existing.gare_depart_id;
    const arriveeId = data.gare_arrivee_id ?? existing.gare_arrivee_id;

    if (departId === arriveeId) {
      throw new AppError('La gare de départ et d\'arrivée doivent être différentes', 400, 'SAME_GARE');
    }

    if (data.gare_depart_id && !gareRepository.findById(data.gare_depart_id)) {
      throw new AppError('Gare de départ introuvable', 404, 'GARE_DEPART_NOT_FOUND');
    }
    if (data.gare_arrivee_id && !gareRepository.findById(data.gare_arrivee_id)) {
      throw new AppError("Gare d'arrivée introuvable", 404, 'GARE_ARRIVEE_NOT_FOUND');
    }

    try {
      return liaisonRepository.update(id, data);
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new AppError('Cette liaison existe déjà', 409, 'LIAISON_DUPLICATE');
      }
      throw err;
    }
  },

  remove(id) {
    const deleted = liaisonRepository.delete(id);
    if (!deleted) throw new AppError('Liaison introuvable', 404, 'LIAISON_NOT_FOUND');
  },
};

module.exports = liaisonService;
