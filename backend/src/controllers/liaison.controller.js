const liaisonService = require('../services/liaison.service');

const liaisonController = {
  list(req, res) {
    const filters = {};
    if (req.query.transport) filters.transport = req.query.transport;
    if (req.query.gare_depart_id) filters.gare_depart_id = parseInt(req.query.gare_depart_id, 10);
    if (req.query.gare_arrivee_id) filters.gare_arrivee_id = parseInt(req.query.gare_arrivee_id, 10);

    const liaisons = liaisonService.list(filters);
    res.json({ data: liaisons, count: liaisons.length });
  },

  getById(req, res) {
    const liaison = liaisonService.getById(parseInt(req.params.id, 10));
    res.json({ data: liaison });
  },

  create(req, res) {
    const liaison = liaisonService.create(req.body);
    res.status(201).json({ data: liaison });
  },

  update(req, res) {
    const liaison = liaisonService.update(parseInt(req.params.id, 10), req.body);
    res.json({ data: liaison });
  },

  remove(req, res) {
    liaisonService.remove(parseInt(req.params.id, 10));
    res.status(204).send();
  },
};

module.exports = liaisonController;
