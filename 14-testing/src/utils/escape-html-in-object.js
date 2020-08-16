const escapeHtml = require('escape-html');

module.exports = function escapeHtmlInObject(input) {
  // 尝试将 ORM 对象转化为普通对象
  if (input && typeof input == 'object' && typeof input.toJSON == 'function') {
    input = input.toJSON();
  }

  // 对类型为 string 的值转义处理
  if (Array.isArray(input)) {
    return input.map(escapeHtmlInObject);
  } else if (input && typeof input == 'object') {
    const output = {};
    Object.keys(input).forEach((k) => {
      output[k] = escapeHtmlInObject(input[k]);
    });
    return output;
  } else if (typeof input == 'string') {
    return escapeHtml(input);
  } else {
    return input;
  }
};
