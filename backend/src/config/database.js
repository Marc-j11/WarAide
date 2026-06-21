/**
 * Configuration base de données.
 * SQLite aujourd'hui ; remplacer driver + connection pour PostgreSQL.
 */
const config = require('./index');

module.exports = {
  ...config.database,
  migrationsDir: require('path').resolve(__dirname, '../migrations'),
};
