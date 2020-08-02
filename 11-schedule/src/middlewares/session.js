const session = require('express-session');
const sessionSequelize = require('connect-session-sequelize');
const { sequelize } = require('../models');
const { sessionCookieSecret, sessionCookieMaxAge } = require('../config');

module.exports = function sessionMiddleware() {
  const SequelizeStore = sessionSequelize(session.Store);

  const store = new SequelizeStore({
    db: sequelize,
    modelKey: 'Session',
    tableName: 'session',
  });

  return session({
    secret: sessionCookieSecret,
    cookie: { maxAge: sessionCookieMaxAge },
    store,
    resave: false,
    proxy: true,
    saveUninitialized: false,
  });
};
