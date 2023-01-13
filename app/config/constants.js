import path from 'path';
import merge from 'lodash/merge';

// Default configuations applied to all environments
const defaultConfig = {
  env: process.env.NODE_ENV,
  get envs() {
    return {
      test: process.env.NODE_ENV === 'test',
      development: process.env.NODE_ENV === 'development',
      production: process.env.NODE_ENV === 'production',
    };
  },

  version: require('../../package.json').version,
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 3001,
  ip: process.env.IP || '0.0.0.0',
  apiPrefix: '', // Could be /api/resource or /api/v2/resource
  userRoles: ['user', 'admin'],
  weatherApi: 'http://api.weatherapi.com/v1/current.json',
  weatherApiKey: 'efc27549ebfb441da2d112500220812',
  /**
   * MongoDB configuration options
   */
  mongo: {
    seed: true,
    options: {
      db: {
        safe: true,
      },
    },
  },

  /**
   * Security configuation options regarding sessions, authentication and hashing
   */
  security: {
    sessionSecret: process.env.SESSION_SECRET || 'secretKey',
    sessionExpiration: process.env.SESSION_EXPIRATION || '1h', // 1 hour
    saltRounds: process.env.SALT_ROUNDS || 12,
  },
};

// Environment specific overrides
const environmentConfigs = {
  development: {
    mongo: {
      uri: process.env.MONGO_URI || 'mongodb+srv://adil:manchester710@snapsmarttest.0f2dj2n.mongodb.net/SnapSmart',
    },
    security: {
      saltRounds: 4,
    },
  },
  test: {
    port: 27017,
    mongo: {
      uri: process.env.MONGO_URI || 'mongodb+srv://adil:manchester710@snapsmarttest.0f2dj2n.mongodb.net/SnapSmart',
    },
    security: {
      saltRounds: 4,
    },
  },
  production: {
    mongo: {
      seed: false,
      uri: process.env.MONGO_URI || 'mongodb+srv://adil:manchester710@snapsmarttest.0f2dj2n.mongodb.net/SnapSmart',
    },
  },
};

// Recursively merge configurations
export default merge(defaultConfig, environmentConfigs[process.env.NODE_ENV] || {});
