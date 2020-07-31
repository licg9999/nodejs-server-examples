const { normalize } = require('path');
const { parse, format } = require('url');

module.exports = function urlnormalizeMiddleware() {
  return (req, res, next) => {
    const pathname = normalize(req.path);
    const urlParsed = parse(req.url);

    let shouldRedirect = false;

    // 重定向不规范的路径
    if (req.path != pathname) {
      urlParsed.pathname = pathname;
      shouldRedirect = true;
    }

    // 执行重定向或者略过
    if (shouldRedirect) {
      res.redirect(format(urlParsed));
    } else {
      next();
    }
  };
};
