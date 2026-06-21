const fs = require('fs');
const path = require('path');
const { getDb, closeDb } = require('./connection');
const dbConfig = require('../config/database');

function runMigrations() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL UNIQUE,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const applied = new Set(
    db.prepare('SELECT filename FROM schema_migrations').all().map((r) => r.filename)
  );

  const files = fs
    .readdirSync(dbConfig.migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const insertMigration = db.prepare(
    'INSERT INTO schema_migrations (filename) VALUES (?)'
  );

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`  skip  ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(dbConfig.migrationsDir, file), 'utf8');
    db.exec(sql);
    insertMigration.run(file);
    console.log(`  apply ${file}`);
  }

  console.log('Migrations terminées.');
}

if (require.main === module) {
  try {
    runMigrations();
  } finally {
    closeDb();
  }
}

module.exports = { runMigrations };
