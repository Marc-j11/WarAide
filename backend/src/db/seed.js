const fs = require('fs');
const path = require('path');
const { getDb, closeDb } = require('./connection');
const { runMigrations } = require('./migrate');

const DATA_DIR = path.resolve(__dirname, '../../../database');

function parseCsv(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map((line) => {
    const values = line.split(',');
    return headers.reduce((row, header, i) => {
      row[header.trim()] = values[i]?.trim() ?? '';
      return row;
    }, {});
  });
}

function seedGares(db) {
  const csvPath = path.join(DATA_DIR, 'points.csv');
  if (!fs.existsSync(csvPath)) {
    console.warn('  points.csv introuvable, seed gares ignoré.');
    return;
  }

  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));

  const insert = db.prepare(`
    INSERT OR IGNORE INTO gares (id, nom, type, categorie, latitude, longitude)
    VALUES (@id, @nom, @type, @categorie, @latitude, @longitude)
  `);

  const insertMany = db.transaction((items) => {
    for (const row of items) {
      insert.run({
        id: parseInt(row.id, 10),
        nom: row.nom,
        type: row.type || 'gare',
        categorie: row.categorie || null,
        latitude: row.latitude ? parseFloat(row.latitude) : null,
        longitude: row.longitude ? parseFloat(row.longitude) : null,
      });
    }
  });

  insertMany(rows);
  console.log(`  ${rows.length} gare(s) importée(s) depuis points.csv`);
}

function ensureGareByNom(db, nom, type = 'point_relais') {
  const existing = db.prepare('SELECT id FROM gares WHERE nom = ?').get(nom);
  if (existing) return existing.id;

  const result = db
    .prepare('INSERT INTO gares (nom, type) VALUES (?, ?)')
    .run(nom, type);
  console.log(`  gare créée : ${nom}`);
  return result.lastInsertRowid;
}

function seedLiaisons(db) {
  const csvPath = path.join(DATA_DIR, 'liaisons.csv');
  if (!fs.existsSync(csvPath)) {
    console.warn('  liaisons.csv introuvable, seed liaisons ignoré.');
    return;
  }

  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  const getGareId = db.prepare('SELECT id FROM gares WHERE nom = ?');

  const insert = db.prepare(`
    INSERT OR IGNORE INTO liaisons
      (gare_depart_id, gare_arrivee_id, transport, direction, prix, temps)
    VALUES (@gare_depart_id, @gare_arrivee_id, @transport, @direction, @prix, @temps)
  `);

  let count = 0;
  const insertMany = db.transaction((items) => {
    for (const row of items) {
      let departId = getGareId.get(row.depart)?.id;
      let arriveeId = getGareId.get(row.arrivee)?.id;

      if (!departId) departId = ensureGareByNom(db, row.depart);
      if (!arriveeId) arriveeId = ensureGareByNom(db, row.arrivee);

      const result = insert.run({
        gare_depart_id: departId,
        gare_arrivee_id: arriveeId,
        transport: row.transport,
        direction: row.direction,
        prix: parseInt(row.prix, 10),
        temps: parseInt(row.temps, 10),
      });
      if (result.changes > 0) count++;
    }
  });

  insertMany(rows);
  console.log(`  ${count} liaison(s) importée(s) depuis liaisons.csv`);
}

function runSeed() {
  runMigrations();
  const db = getDb();

  const gareCount = db.prepare('SELECT COUNT(*) AS n FROM gares').get().n;
  const liaisonCount = db.prepare('SELECT COUNT(*) AS n FROM liaisons').get().n;

  if (gareCount > 0 || liaisonCount > 0) {
    console.log('Base déjà peuplée, seed ignoré.');
    return;
  }

  console.log('Import des données…');
  seedGares(db);
  seedLiaisons(db);
  console.log('Seed terminé.');
}

if (require.main === module) {
  try {
    runSeed();
  } finally {
    closeDb();
  }
}

module.exports = { runSeed };
