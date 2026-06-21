const gareRepository = require('../repositories/gare.repository');
const AppError = require('../errors/AppError');
const { haversine } = require('../utils/haversine');

const gareService = {
  list(query) {
    return gareRepository.findAll({ nom: query.nom });
  },

  findNearby({ lat, lng, limit = 10 }) {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    const max = Math.min(parseInt(limit, 10) || 10, 50);

    return gareRepository
      .findStationsWithCoordinates()
      .map((gare) => ({
        ...gare,
        distance: Math.round(haversine(parsedLat, parsedLng, gare.latitude, gare.longitude)),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, max);
  },

  getById(id) {
    const gare = gareRepository.findById(id);
    if (!gare) throw new AppError('Gare introuvable', 404, 'GARE_NOT_FOUND');
    return gare;
  },

  create(data) {
    if (gareRepository.findByNom(data.nom)) {
      throw new AppError('Une gare avec ce nom existe déjà', 409, 'GARE_DUPLICATE');
    }
    return gareRepository.create(data);
  },

  update(id, data) {
    const existing = gareRepository.findById(id);
    if (!existing) throw new AppError('Gare introuvable', 404, 'GARE_NOT_FOUND');

    if (data.nom && data.nom !== existing.nom) {
      const duplicate = gareRepository.findByNom(data.nom);
      if (duplicate) {
        throw new AppError('Une gare avec ce nom existe déjà', 409, 'GARE_DUPLICATE');
      }
    }

    return gareRepository.update(id, data);
  },

  remove(id) {
    const existing = gareRepository.findById(id);
    if (!existing) throw new AppError('Gare introuvable', 404, 'GARE_NOT_FOUND');

    const liaisonCount = gareRepository.countLiaisons(id);
    if (liaisonCount > 0) {
      throw new AppError(
        'Impossible de supprimer une gare liée à des liaisons',
        409,
        'GARE_HAS_LIAISONS'
      );
    }

    gareRepository.delete(id);
  },
};

module.exports = gareService;
