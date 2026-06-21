const createApp = require('./app');
const config = require('./config');
const { runMigrations } = require('./db/migrate');
const { runSeed } = require('./db/seed');
const { closeDb } = require('./db/connection');

runMigrations();
runSeed();

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`WarAide backend — http://localhost:${config.port}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `\nPort ${config.port} déjà utilisé.\n` +
        `→ Le backend tourne peut-être déjà : http://localhost:${config.port}/health\n` +
        `→ Ou libérez le port : lsof -ti:${config.port} | xargs kill\n`
    );
    process.exit(1);
  }
  throw err;
});

process.on('SIGINT', () => {
  server.close();
  closeDb();
  process.exit(0);
});

process.on('SIGTERM', () => {
  server.close();
  closeDb();
  process.exit(0);
});
