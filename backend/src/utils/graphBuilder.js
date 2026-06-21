/**
 * Construit un graphe d'adjacence à partir des liaisons.
 *
 * @param {Array} liaisons - Liaisons avec gare_depart_id, gare_arrivee_id, prix, temps
 * @param {'prix'|'temps'} critere
 * @returns {Map<number, Array<{ to: number, weight: number, edge: object }>>}
 */
function buildGraph(liaisons, critere = 'prix') {
  const graph = new Map();
  const weightKey = critere === 'temps' ? 'temps' : 'prix';

  for (const liaison of liaisons) {
    const from = liaison.gare_depart_id;
    const to = liaison.gare_arrivee_id;

    if (!graph.has(from)) graph.set(from, []);
    graph.get(from).push({
      to,
      weight: liaison[weightKey],
      edge: liaison,
    });
  }

  return graph;
}

module.exports = { buildGraph };
