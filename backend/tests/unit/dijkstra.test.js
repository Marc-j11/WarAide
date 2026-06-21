const { test } = require('node:test');
const assert = require('node:assert/strict');
const { dijkstra } = require('../../src/algorithms/dijkstra');
const { buildGraph } = require('../../src/utils/graphBuilder');

const sampleLiaisons = [
  {
    id: 1,
    gare_depart_id: 1,
    gare_arrivee_id: 2,
    transport: 'worowo',
    direction: 'B',
    prix: 300,
    temps: 8,
    depart_nom: 'A',
    arrivee_nom: 'B',
  },
  {
    id: 2,
    gare_depart_id: 2,
    gare_arrivee_id: 3,
    transport: 'worowo',
    direction: 'C',
    prix: 500,
    temps: 12,
    depart_nom: 'B',
    arrivee_nom: 'C',
  },
  {
    id: 3,
    gare_depart_id: 3,
    gare_arrivee_id: 4,
    transport: 'worowo',
    direction: 'D',
    prix: 300,
    temps: 5,
    depart_nom: 'C',
    arrivee_nom: 'D',
  },
  {
    id: 4,
    gare_depart_id: 1,
    gare_arrivee_id: 4,
    transport: 'gbaka',
    direction: 'D',
    prix: 900,
    temps: 20,
    depart_nom: 'A',
    arrivee_nom: 'D',
  },
];

test('dijkstra — chemin direct optimal par prix', () => {
  const graph = buildGraph(sampleLiaisons, 'prix');
  const result = dijkstra(graph, 1, 4);

  assert.ok(result);
  assert.deepEqual(result.path, [1, 4]);
  assert.equal(result.cost, 900);
});

test('dijkstra — chemin direct optimal par temps', () => {
  const graph = buildGraph(sampleLiaisons, 'temps');
  const result = dijkstra(graph, 1, 4);

  assert.ok(result);
  assert.deepEqual(result.path, [1, 4]);
  assert.equal(result.cost, 20);
});

test('dijkstra — passage par nœuds intermédiaires si pas de direct', () => {
  const sansDirect = sampleLiaisons.filter((l) => l.id !== 4);
  const graph = buildGraph(sansDirect, 'prix');
  const result = dijkstra(graph, 1, 4);

  assert.ok(result);
  assert.deepEqual(result.path, [1, 2, 3, 4]);
  assert.equal(result.cost, 1100);
});

test('dijkstra — nœud destination sans arêtes sortantes', () => {
  const graph = buildGraph(sampleLiaisons, 'prix');
  const result = dijkstra(graph, 1, 4);

  assert.ok(result);
  assert.equal(result.path.at(-1), 4);
});

test('dijkstra — aucun chemin', () => {
  const graph = buildGraph(
    [{ id: 1, gare_depart_id: 1, gare_arrivee_id: 2, prix: 100, temps: 5 }],
    'prix'
  );
  const result = dijkstra(graph, 2, 1);

  assert.equal(result, null);
});

test('dijkstra — même nœud départ et arrivée', () => {
  const graph = buildGraph(sampleLiaisons, 'prix');
  const result = dijkstra(graph, 1, 1);

  assert.ok(result);
  assert.deepEqual(result.path, [1]);
  assert.equal(result.cost, 0);
});
