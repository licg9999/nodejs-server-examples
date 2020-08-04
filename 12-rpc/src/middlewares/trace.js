const { v4: uuid } = require('uuid');
const morgan = require('morgan');
const onFinished = require('on-finished');
const logger = require('../utils/logger');
const { logging } = logger;

module.exports = function traceMiddleware() {
  return [
    morgan('common', { skip: () => true }),
    (req, res, next) => {
      req.uuid = uuid();
      req.logger = logger.child({ uuid: req.uuid });
      req.loggerSql = req.logger.child({ type: 'sql' });
      req.logging = logging(req.loggerSql, 'info');
      req.loggerRpc = req.logger.child({ type: 'rpc' });

      onFinished(res, () => {
        const remoteAddr = morgan['remote-addr'](req, res);
        const method = morgan['method'](req, res);
        const url = morgan['url'](req, res);
        const httpVersion = morgan['http-version'](req, res);
        const status = morgan['status'](req, res);
        const responseTime = morgan['response-time'](req, res);

        req.logger.info({
          type: 'res',
          remoteAddr,
          method,
          url,
          httpVersion,
          status,
          responseTime,
        });
      });

      next();
    },
  ];
};
