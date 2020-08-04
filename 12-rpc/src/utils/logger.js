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

const GRPC_LOGGER_REGEXP = /^.+Z\s+\|\s+/;

function grpcLogger(logger, level = 'debug') {
  const verbosities = ['debug', 'info', 'error'];

  return {
    error(severity, message) {
      if (typeof severity != 'number') {
        message = severity;
        severity = 0;
      }

      if (typeof message != 'string') {
        message = String(message || '');
      }

      logger[verbosities[severity] || level](
        message.replace(GRPC_LOGGER_REGEXP, '')
      );
    },
  };
}

module.exports = logger;

Object.assign(module.exports, { logging, grpcLogger });
