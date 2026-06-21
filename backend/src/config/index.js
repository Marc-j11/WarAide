require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const path = require('path');

module.exports = {
  port: parseInt(process.env.PORT, 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    driver: process.env.DB_DRIVER || 'sqlite',
    path: process.env.DATABASE_PATH || path.resolve(__dirname, '../../../database/waraide.db'),
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'waraide-dev-secret-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
};
