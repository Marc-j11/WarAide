const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const config = require('../config/database');

let db = null;

function getDb() {
  if (db) return db;

  const dir = path.dirname(config.path);
  if (config.path !== ':memory:' && dir !== '.' && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new Database(config.path);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  return db;
}

function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = { getDb, closeDb };
