const { Router } = require('express');
const { passport } = require('../middlewares/auth');

class LoginController {
  homepagePath;
  loginPath;

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
        failureRedirect: this.loginPath,
      }),
      this.getGithubCallback
    );
    return router;
  }

  post = (req, res) => {
    req.session.logined = true;
    res.redirect(this.homepagePath);
  };

  getGithubCallback = (req, res) => {
    req.session.logined = true;
    res.redirect(this.homepagePath);
  };
}

module.exports = async (homepagePath = '/', loginPath = '/login.html') => {
  const c = new LoginController();
  Object.assign(c, { homepagePath, loginPath });
  return await c.init();
};
