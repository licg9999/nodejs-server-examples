const { resolve } = require('path');
const { promisify } = require('util');
const protoLoader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');
const { rpc } = require('../../config');

class EchoClient {
  grpcClient;

  async init() {
    const grpcObject = grpc.loadPackageDefinition(
      await protoLoader.load(resolve(__dirname, 'def.proto'))
    );

    this.grpcClient = new grpcObject.Echo(
      `${rpc.domain}:${rpc.port}`,
      grpc.credentials.createInsecure()
    );
  }

  get = async ({ s, logger }) => {
    const { grpcClient } = this;

    const { message } = await promisify(
      grpcClient.get.bind(grpcClient, { message: s })
    )();

    logger.info('Echo/Get Invoked');

    return { message };
  };
}

let client;
module.exports = async () => {
  if (!client) {
    client = new EchoClient();
    await client.init();
  }
  return client;
};
