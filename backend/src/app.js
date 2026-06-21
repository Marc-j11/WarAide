const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const routes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: config.cors.origin }));
  app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'waraide-backend' });
  });

  // Route racine — information minimale sur le service
  app.get('/', (_req, res) => {
    res.json({
      service: 'waraide-backend',
      status: 'ok',
      docs: '/health',
      message: 'API backend de WarAide — utilisez /gares, /liaisons, /itineraire',
    });
  });

  app.use(routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
