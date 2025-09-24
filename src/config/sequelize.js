const config = require('./config');

module.exports = {
  development: config.sequelize,
  test: {
    ...config.sequelize,
    database: `${config.sequelize.database}_test`,
  },
  production: config.sequelize,
};
