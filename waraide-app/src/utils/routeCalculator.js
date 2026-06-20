import { points as allPoints, liaisons as allLiaisons } from '../data';

/**
 * Construit un graphe orienté à partir des liaisons.
 */
function buildGraph(liaisons) {
  const graph = new Map();
  for (const l of liaisons) {
    if (!graph.has(l.depart)) graph.set(l.depart, []);
    graph.get(l.depart).push(l);
  }
  return graph;
}

/**
 * Recherche du plus court chemin (Dijkstra par durée).
 *
 * @param {string} startName - nom du point de départ
 * @param {string} endName   - nom du point d'arrivée
 * @returns {{steps: Array, total: {prix:number, temps:number}, found:boolean}}
 */
export function calculateRoute(startName, endName, liaisons = allLiaisons) {
  if (!startName || !endName) {
    return { found: false, steps: [], total: { prix: 0, temps: 0 } };
  }
  if (startName === endName) {
    return { found: true, steps: [], total: { prix: 0, temps: 0 } };
  }

  const graph = buildGraph(liaisons);
  const dist = new Map();
  const prev = new Map();
  const visited = new Set();
  const queue = [];

  dist.set(startName, 0);
  queue.push({ node: startName, d: 0 });

  while (queue.length) {
    queue.sort((a, b) => a.d - b.d);
    const { node } = queue.shift();
    if (visited.has(node)) continue;
    visited.add(node);
    if (node === endName) break;

    const edges = graph.get(node) || [];
    for (const e of edges) {
      const alt = (dist.get(node) ?? Infinity) + (e.temps || 1);
      if (alt < (dist.get(e.arrivee) ?? Infinity)) {
        dist.set(e.arrivee, alt);
        prev.set(e.arrivee, { from: node, edge: e });
        queue.push({ node: e.arrivee, d: alt });
      }
    }
  }

  if (!prev.has(endName) && startName !== endName) {
    return { found: false, steps: [], total: { prix: 0, temps: 0 } };
  }

  // Reconstruction
  const steps = [];
  let cur = endName;
  while (prev.has(cur)) {
    const { edge } = prev.get(cur);
    steps.unshift({
      type: 'transport',
      from: edge.depart,
      to: edge.arrivee,
      transport: edge.transport,
      direction: edge.direction,
      prix: edge.prix,
      temps: edge.temps,
    });
    cur = prev.get(cur).from;
  }

  steps.forEach((s, i) => (s.index = i + 1));

  const total = steps.reduce(
    (acc, s) => ({
      prix: acc.prix + (s.prix || 0),
      temps: acc.temps + (s.temps || 0),
    }),
    { prix: 0, temps: 0 }
  );

  return { found: true, steps, total };
}

/**
 * Helpers — résoudre un nom de point.
 */
export function findPointByName(name, points = allPoints) {
  return points.find((p) => p.nom === name) || null;
}

export default calculateRoute;
