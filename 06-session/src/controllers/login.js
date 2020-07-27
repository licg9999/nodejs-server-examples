const { Router } = require('express');
const cc = require('../utils/cc');

class LoginController {
  async init() {
    const router = Router();
    router.post('/', this.post);
    return router;
  }

  post = cc((req, res) => {
    req.session.logined = true;
    res.redirect('/');
  });
}

module.exports = async () => {
  const c = new LoginController();
  return await c.init();
};
