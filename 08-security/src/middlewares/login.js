const { parse } = require('url');

module.exports = function loginMiddleware(
  homepagePath = '/',
  loginPath = '/login.html',
  whiteList = {
    '/500.html': ['get'],
    '/api/health': ['get'],
    '/api/csrf/script': ['get'],
    '/api/login': ['post'],
    '/api/login/github': ['get'],
    '/api/login/github/callback': ['get'],
  }
) {
  whiteList[loginPath] = ['get'];

  return (req, res, next) => {
    const { pathname } = parse(req.url);

    if (req.session.logined && pathname == loginPath) {
      res.redirect(homepagePath);
      return;
    }

    if (
      req.session.logined ||
      (whiteList[pathname] &&
        whiteList[pathname].includes(req.method.toLowerCase()))
    ) {
      next();
      return;
    }

    res.redirect(loginPath);
  };
};
