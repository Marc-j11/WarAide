const itineraireService = require('../services/itineraire.service');

const itineraireController = {
  search(req, res) {
    const { departId, arriveeId, critere } = req.body;
    const result = itineraireService.findBest({
      departId: parseInt(departId, 10),
      arriveeId: parseInt(arriveeId, 10),
      critere: critere || 'prix',
    });
    res.json({ data: result });
  },
};

module.exports = itineraireController;
