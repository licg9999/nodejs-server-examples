const { db } = require('../../config');

module.exports = { [process.env.NODE_ENV || 'development']: db };
