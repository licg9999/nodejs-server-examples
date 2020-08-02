const merge = require('lodash.merge');
const logger = require('../utils/logger');
const { logging } = logger;

const config = {
  // 默认配置
  default: {
    sessionCookieSecret: '842d918ced1888c65a650f993077c3d36b8f114d',
    sessionCookieMaxAge: 7 * 24 * 60 * 60 * 1000,

    homepagePath: '/',
    loginPath: '/login.html',
    loginWhiteList: {
      '/500.html': ['get'],
      '/api/health': ['get'],
      '/api/csrf/script': ['get'],
      '/api/login': ['post'],
      '/api/login/github': ['get'],
      '/api/login/github/callback': ['get'],
    },

    githubStrategyOptions: {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:9000/api/login/github/callback',
    },

    db: {
      dialect: 'sqlite',
      storage: ':memory:',
      benchmark: true,
      logging: logging(logger, 'debug'),
      define: {
        underscored: true,
      },
      migrationStorageTableName: 'sequelize_meta',
    },

    mailerOptions: {
      host: 'smtp.126.com',
      port: 465,
      secure: true,
      logger: logger.child({ type: 'mail' }),
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
      },
    },
  },

  // 本地配置
  development: {
    db: {
      storage: 'database/dev.db',
    },
  },

  // 测试配置
  test: {
    db: {
      logging: false,
    },
  },

  // 部署配置
  production: {
    sessionCookieMaxAge: 3 * 24 * 60 * 60 * 1000,

    githubStrategyOptions: {
      callbackURL: 'http://localhost:9090/api/login/github/callback',
    },

    db: {
      storage: 'database/prod.db',
    },
  },
};

module.exports = merge(
  {},
  config.default,
  config[process.env.NODE_ENV || 'development']
);
