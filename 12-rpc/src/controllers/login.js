const { Router } = require('express');
const { passport } = require('../middlewares/auth');
const { homepagePath, loginPath } = require('../config');

class LoginController {
  async init() {
    const router = Router();
    router.post('/', this.post);
    router.get(
      '/github',
      passport.authenticate('github', { scope: ['read:user'] })
    );
    router.get(
      '/github/callback',
      passport.authenticate('github', {
        failureRedirect: loginPath,
      }),
      this.getGithubCallback
    );
    return router;
  }

  post = (req, res) => {
    req.session.logined = true;
    res.redirect(homepagePath);
  };

  getGithubCallback = (req, res) => {
    req.session.logined = true;
    res.redirect(homepagePath);
  };
}

module.exports = async () => {
  const c = new LoginController();
  return await c.init();
};
