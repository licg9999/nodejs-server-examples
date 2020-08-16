const { commandSync } = require('execa');

module.exports = () => {
  commandSync('yarn sequelize db:migrate');
};
