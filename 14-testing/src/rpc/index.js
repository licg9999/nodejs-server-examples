const { promisify } = require('util');
const grpc = require('@grpc/grpc-js');
const { rpc } = require('../config');
const logger = require('../utils/logger');
const echoClient = require('./echo/client');
const echoServer = require('./echo/server');
const { grpcLogger } = logger;

module.exports = async function initRpc() {
  grpc.setLogger(grpcLogger(logger.child({ type: 'rpc' }), 'debug'));

  // init rpc servers
  const grpcServer = new grpc.Server();
  await echoServer(grpcServer);

  await promisify(grpcServer.bindAsync.bind(grpcServer))(
    `0.0.0.0:${rpc.port}`,
    grpc.ServerCredentials.createInsecure()
  );
  grpcServer.start();

  // init rpc clients
  await echoClient();
};
