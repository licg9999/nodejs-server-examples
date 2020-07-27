module.exports = function callbackCatch(callback) {
  return async (req, res, next) => {
    try {
      await callback(req, res, next);
    } catch (e) {
      next(e);
    }
  };
};
