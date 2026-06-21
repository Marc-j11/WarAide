const gareRepository = require('../repositories/gare.repository');
const liaisonRepository = require('../repositories/liaison.repository');
const { dijkstra } = require('../algorithms/dijkstra');
const { buildGraph } = require('../utils/graphBuilder');
const AppError = require('../errors/AppError');

const itineraireService = {
  findBest({ departId, arriveeId, critere = 'prix' }) {
    const depart = gareRepository.findById(departId);
    if (!depart) throw new AppError('Gare de départ introuvable', 404, 'GARE_DEPART_NOT_FOUND');

    const arrivee = gareRepository.findById(arriveeId);
    if (!arrivee) throw new AppError("Gare d'arrivée introuvable", 404, 'GARE_ARRIVEE_NOT_FOUND');

    if (departId === arriveeId) {
      return {
        critere,
        prixTotal: 0,
        tempsTotal: 0,
        depart: { id: depart.id, nom: depart.nom },
        arrivee: { id: arrivee.id, nom: arrivee.nom },
        etapes: [],
      };
    }

    const liaisons = liaisonRepository.findAllForGraph();
    const graph = buildGraph(liaisons, critere);
    const result = dijkstra(graph, departId, arriveeId);

    if (!result) {
      throw new AppError(
        'Aucun itinéraire trouvé entre ces deux gares',
        404,
        'ITINERAIRE_NOT_FOUND'
      );
    }

    const etapes = result.edges.map((liaison, index) => ({
      ordre: index + 1,
      liaisonId: liaison.id,
      depart: { id: liaison.gare_depart_id, nom: liaison.depart_nom },
      arrivee: { id: liaison.gare_arrivee_id, nom: liaison.arrivee_nom },
      transport: liaison.transport,
      direction: liaison.direction,
      prix: liaison.prix,
      temps: liaison.temps,
    }));

    const prixTotal = etapes.reduce((sum, e) => sum + e.prix, 0);
    const tempsTotal = etapes.reduce((sum, e) => sum + e.temps, 0);

    return {
      critere,
      prixTotal,
      tempsTotal,
      depart: { id: depart.id, nom: depart.nom },
      arrivee: { id: arrivee.id, nom: arrivee.nom },
      etapes,
    };
  },
};

module.exports = itineraireService;
