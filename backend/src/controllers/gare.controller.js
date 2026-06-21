const gareService = require('../services/gare.service');

const gareController = {
  list(req, res) {
    const gares = gareService.list(req.query);
    res.json({ data: gares, count: gares.length });
  },

  findNearby(req, res) {
    const gares = gareService.findNearby(req.query);
    res.json({ data: gares, count: gares.length });
  },

  getById(req, res) {
    const gare = gareService.getById(parseInt(req.params.id, 10));
    res.json({ data: gare });
  },

  create(req, res) {
    const gare = gareService.create(req.body);
    res.status(201).json({ data: gare });
  },

  update(req, res) {
    const gare = gareService.update(parseInt(req.params.id, 10), req.body);
    res.json({ data: gare });
  },

  remove(req, res) {
    gareService.remove(parseInt(req.params.id, 10));
    res.status(204).send();
  },
};

module.exports = gareController;
