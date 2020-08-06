const { parse } = require('url');
const { homepagePath, loginPath, loginWhiteList } = require('../config');

module.exports = function loginMiddleware() {
  const whiteList = Object.assign({}, loginWhiteList, {
    [loginPath]: ['get'],
  });

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
