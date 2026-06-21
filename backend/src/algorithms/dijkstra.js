class MinHeap {
  constructor() {
    this.heap = [];
  }

  size() {
    return this.heap.length;
  }

  push(item) {
    this.heap.push(item);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._bubbleDown(0);
    }
    return top;
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent].priority <= this.heap[index].priority) break;
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }

  _bubbleDown(index) {
    const length = this.heap.length;
    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let smallest = index;

      if (left < length && this.heap[left].priority < this.heap[smallest].priority) {
        smallest = left;
      }
      if (right < length && this.heap[right].priority < this.heap[smallest].priority) {
        smallest = right;
      }
      if (smallest === index) break;

      [this.heap[smallest], this.heap[index]] = [this.heap[index], this.heap[smallest]];
      index = smallest;
    }
  }
}

/**
 * Algorithme de Dijkstra sur un graphe orienté pondéré.
 *
 * @param {Map<number, Array<{ to: number, weight: number, edge: object }>>} graph
 * @param {number} startId
 * @param {number} endId
 * @returns {{ path: number[], cost: number } | null}
 */
function dijkstra(graph, startId, endId) {
  const distances = new Map();
  const predecessors = new Map();
  const visited = new Set();
  const heap = new MinHeap();

  for (const nodeId of graph.keys()) {
    distances.set(nodeId, Infinity);
  }
  distances.set(startId, 0);
  heap.push({ nodeId: startId, priority: 0 });

  while (heap.size() > 0) {
    const current = heap.pop();
    if (!current || visited.has(current.nodeId)) continue;

    visited.add(current.nodeId);

    if (current.nodeId === endId) break;

    const edges = graph.get(current.nodeId) || [];
    for (const edge of edges) {
      const newDist = distances.get(current.nodeId) + edge.weight;
      const prevDist = distances.get(edge.to) ?? Infinity;
      if (newDist < prevDist) {
        distances.set(edge.to, newDist);
        predecessors.set(edge.to, { from: current.nodeId, edge: edge.edge });
        heap.push({ nodeId: edge.to, priority: newDist });
      }
    }
  }

  if (!predecessors.has(endId) && startId !== endId) {
    return null;
  }

  const path = [];
  let current = endId;
  const edges = [];

  while (current !== startId) {
    path.unshift(current);
    const pred = predecessors.get(current);
    if (!pred) return null;
    edges.unshift(pred.edge);
    current = pred.from;
  }
  path.unshift(startId);

  return {
    path,
    edges,
    cost: distances.get(endId),
  };
}

module.exports = { dijkstra };
