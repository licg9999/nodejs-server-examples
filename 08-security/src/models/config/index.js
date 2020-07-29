module.exports = {
  development: {
    dialect: 'sqlite',
    storage: 'database/index.db',
    define: {
      underscored: true,
    },
    migrationStorageTableName: 'sequelize_meta',
  },
};
