const session = require('express-session');
const sessionSequelize = require('connect-session-sequelize');
const { sequelize } = require('../models');

module.exports = function sessionMiddleware(secret) {
  const SequelizeStore = sessionSequelize(session.Store);

  const store = new SequelizeStore({
    db: sequelize,
    modelKey: 'Session',
    tableName: 'session',
  });

  return session({
    secret,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
    store,
    resave: false,
    proxy: true,
    saveUninitialized: false,
  });
};
