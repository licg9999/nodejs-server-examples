const { Router } = require('express');
const cc = require('../utils/cc');
const rpcEchoClient = require('../rpc/echo/client');

class EchoController {
  rpcEchoClient;

  async init() {
    this.rpcEchoClient = await rpcEchoClient();

    const router = Router();
    router.get('/', this.get);
    return router;
  }

  get = cc(async (req, res) => {
    const { s = '' } = req.query;
    const message = await this.rpcEchoClient.get({ s, logger: req.loggerRpc });
    res.send({ success: true, message });
  });
}

module.exports = async () => {
  const c = new EchoController();
  return await c.init();
};
