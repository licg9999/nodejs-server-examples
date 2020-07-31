const { Router } = require('express');

class CsrfController {
  async init() {
    const router = Router();
    router.get('/script', this.getScript);
    return router;
  }

  getScript = (req, res) => {
    res.type('js');
    res.send(`window.__CSRF_TOKEN__='${req.csrfToken()}';`);
  };
}

module.exports = async () => {
  const c = new CsrfController();
  return await c.init();
};
