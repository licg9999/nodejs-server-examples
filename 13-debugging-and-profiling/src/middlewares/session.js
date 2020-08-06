const session = require('express-session');
const sessionSequelize = require('connect-session-sequelize');
const redis = require('redis');
const sessionRedis = require('connect-redis');
const { sequelize } = require('../models');
const {
  redisOptions,
  sessionCookieSecret,
  sessionCookieMaxAge,
} = require('../config');
const { name } = require('../../package.json');

module.exports = function sessionMiddleware() {
  let store;

  if (process.env.WITH_REDIS) {
    const client = redis.createClient(redisOptions);
    const RedisStore = sessionRedis(session);
    store = new RedisStore({ client, prefix: name });
  } else {
    const SequelizeStore = sessionSequelize(session.Store);
    store = new SequelizeStore({
      db: sequelize,
      modelKey: 'Session',
      tableName: 'session',
    });
  }

  return session({
    secret: sessionCookieSecret,
    cookie: { maxAge: sessionCookieMaxAge },
    store,
    resave: false,
    proxy: true,
    saveUninitialized: false,
  });
};
