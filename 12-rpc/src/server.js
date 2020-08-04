const express = require('express');
const { resolve } = require('path');
const { promisify } = require('util');
const initMiddlewares = require('./middlewares');
const initControllers = require('./controllers');
const initSchedules = require('./schedules');
const initRpc = require('./rpc');
const logger = require('./utils/logger');

const server = express();
const port = parseInt(process.env.PORT || '9000');
const publicDir = resolve('public');
const mouldsDir = resolve('src/moulds');

async function bootstrap() {
  await initRpc();
  server.use(await initMiddlewares());
  server.use(express.static(publicDir));
  server.use('/moulds', express.static(mouldsDir));
  server.use(await initControllers());
  server.use(errorHandler);
  await initSchedules();
  await promisify(server.listen.bind(server, port))();
  logger.info(`> Started on port ${port}`);
}

// 监听未捕获的 Promise 异常，
// 直接退出进程
process.on('unhandledRejection', (err) => {
  logger.fatal(err);
  process.exit(1);
});

// 监听未捕获的同步异常与 Thunk 异常，
// 输出错误日志
process.on('uncaughtException', (err) => {
  logger.fatal(err);
  process.exit(1);
});

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    // 如果是在返回响应结果时发生了异常，
    // 那么交给 express 内置的 finalhandler 关闭链接
    return next(err);
  }

  // 打印异常
  req.logger.error(err);
  // 重定向到异常指引页面
  res.redirect('/500.html');
}

bootstrap();
