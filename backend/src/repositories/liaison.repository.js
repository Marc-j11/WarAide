const { getDb } = require('../db/connection');

const LIAISON_SELECT = `
  SELECT
    l.id,
    l.gare_depart_id,
    l.gare_arrivee_id,
    l.transport,
    l.direction,
    l.prix,
    l.temps,
    l.created_at,
    l.updated_at,
    gd.nom AS depart_nom,
    ga.nom AS arrivee_nom
  FROM liaisons l
  JOIN gares gd ON gd.id = l.gare_depart_id
  JOIN gares ga ON ga.id = l.gare_arrivee_id
`;

const liaisonRepository = {
  findAll({ transport, gare_depart_id, gare_arrivee_id } = {}) {
    const db = getDb();
    const conditions = [];
    const params = [];

    if (transport) {
      conditions.push('l.transport = ?');
      params.push(transport);
    }
    if (gare_depart_id) {
      conditions.push('l.gare_depart_id = ?');
      params.push(gare_depart_id);
    }
    if (gare_arrivee_id) {
      conditions.push('l.gare_arrivee_id = ?');
      params.push(gare_arrivee_id);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    return db.prepare(`${LIAISON_SELECT} ${where} ORDER BY l.id`).all(...params);
  },

  findById(id) {
    return getDb()
      .prepare(`${LIAISON_SELECT} WHERE l.id = ?`)
      .get(id);
  },

  findAllForGraph() {
    return getDb()
      .prepare(`
        SELECT
          l.id,
          l.gare_depart_id,
          l.gare_arrivee_id,
          l.transport,
          l.direction,
          l.prix,
          l.temps,
          gd.nom AS depart_nom,
          ga.nom AS arrivee_nom
        FROM liaisons l
        JOIN gares gd ON gd.id = l.gare_depart_id
        JOIN gares ga ON ga.id = l.gare_arrivee_id
      `)
      .all();
  },

  create(data) {
    const db = getDb();
    const result = db
      .prepare(`
        INSERT INTO liaisons
          (gare_depart_id, gare_arrivee_id, transport, direction, prix, temps)
        VALUES
          (@gare_depart_id, @gare_arrivee_id, @transport, @direction, @prix, @temps)
      `)
      .run(data);
    return this.findById(result.lastInsertRowid);
  },

  update(id, data) {
    const db = getDb();
    const existing = this.findById(id);
    if (!existing) return null;

    db.prepare(`
      UPDATE liaisons SET
        gare_depart_id = @gare_depart_id,
        gare_arrivee_id = @gare_arrivee_id,
        transport = @transport,
        direction = @direction,
        prix = @prix,
        temps = @temps,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `).run({
      id,
      gare_depart_id: data.gare_depart_id ?? existing.gare_depart_id,
      gare_arrivee_id: data.gare_arrivee_id ?? existing.gare_arrivee_id,
      transport: data.transport ?? existing.transport,
      direction: data.direction ?? existing.direction,
      prix: data.prix ?? existing.prix,
      temps: data.temps ?? existing.temps,
    });

    return this.findById(id);
  },

  delete(id) {
    const result = getDb().prepare('DELETE FROM liaisons WHERE id = ?').run(id);
    return result.changes > 0;
  },
};

module.exports = liaisonRepository;
