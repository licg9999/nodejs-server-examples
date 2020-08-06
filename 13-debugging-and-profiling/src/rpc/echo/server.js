const { resolve } = require('path');
const { callbackify } = require('util');
const protoLoader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');

class EchoServer {
  grpcServer;

  async init() {
    const grpcObject = grpc.loadPackageDefinition(
      await protoLoader.load(resolve(__dirname, 'def.proto'))
    );

    this.grpcServer.addService(grpcObject.Echo.service, this);
  }

  get = callbackify(async (call) => {
    const { message } = call.request;
    return { message };
  });
}

let server;
module.exports = async (grpcServer) => {
  if (!server) {
    server = new EchoServer();
    Object.assign(server, { grpcServer });
    await server.init();
  }
  return server;
};
