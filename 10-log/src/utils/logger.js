const bunyan = require('bunyan');
const { name } = require('../../package.json');

const logger = bunyan.createLogger({
  name,
  level: (process.env.LOG_LEVEL || 'debug').toLowerCase(),
});

const LOGGING_REGEXP = /^Executed\s+\((.+)\):\s+(.+)/;

function logging(logger, level = 'trace') {
  return (m, t) => {
    const o = { type: 'sql' };

    const match = m.match(LOGGING_REGEXP);
    if (match) {
      o.transaction = match[1];
      o.statement = match[2];
    } else {
      o.statement = m;
    }

    if (typeof t == 'number') o.elapsedTime = t;

    logger[level](o);
  };
}

module.exports = logger;

Object.assign(module.exports, { logging });
