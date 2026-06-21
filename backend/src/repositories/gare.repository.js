const { getDb } = require('../db/connection');

const GARE_COLUMNS = 'id, nom, type, categorie, latitude, longitude, created_at, updated_at';

const gareRepository = {
  findAll({ nom } = {}) {
    const db = getDb();
    if (nom) {
      return db
        .prepare(`SELECT ${GARE_COLUMNS} FROM gares WHERE nom LIKE ? ORDER BY nom`)
        .all(`%${nom}%`);
    }
    return db.prepare(`SELECT ${GARE_COLUMNS} FROM gares ORDER BY nom`).all();
  },

  findById(id) {
    return getDb()
      .prepare(`SELECT ${GARE_COLUMNS} FROM gares WHERE id = ?`)
      .get(id);
  },

  findByNom(nom) {
    return getDb()
      .prepare(`SELECT ${GARE_COLUMNS} FROM gares WHERE nom = ?`)
      .get(nom);
  },

  create(data) {
    const db = getDb();
    const result = db
      .prepare(`
        INSERT INTO gares (nom, type, categorie, latitude, longitude)
        VALUES (@nom, @type, @categorie, @latitude, @longitude)
      `)
      .run({
        nom: data.nom,
        type: data.type || 'gare',
        categorie: data.categorie ?? null,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
      });
    return this.findById(result.lastInsertRowid);
  },

  update(id, data) {
    const db = getDb();
    const existing = this.findById(id);
    if (!existing) return null;

    db.prepare(`
      UPDATE gares SET
        nom = @nom,
        type = @type,
        categorie = @categorie,
        latitude = @latitude,
        longitude = @longitude,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `).run({
      id,
      nom: data.nom ?? existing.nom,
      type: data.type ?? existing.type,
      categorie: data.categorie !== undefined ? data.categorie : existing.categorie,
      latitude: data.latitude !== undefined ? data.latitude : existing.latitude,
      longitude: data.longitude !== undefined ? data.longitude : existing.longitude,
    });

    return this.findById(id);
  },

  delete(id) {
    const result = getDb().prepare('DELETE FROM gares WHERE id = ?').run(id);
    return result.changes > 0;
  },

  countLiaisons(id) {
    return getDb()
      .prepare(
        'SELECT COUNT(*) AS n FROM liaisons WHERE gare_depart_id = ? OR gare_arrivee_id = ?'
      )
      .get(id, id).n;
  },

  findStationsWithCoordinates() {
    return getDb()
      .prepare(`
        SELECT ${GARE_COLUMNS} FROM gares
        WHERE latitude IS NOT NULL
          AND longitude IS NOT NULL
          AND (categorie = 'transport' OR type = 'gare')
      `)
      .all();
  },
};

module.exports = gareRepository;
