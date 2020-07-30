module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('session', {
      sid: {
        type: Sequelize.STRING(36),
      },
      expires: {
        type: Sequelize.DATE,
      },
      data: {
        type: Sequelize.TEXT,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('session');
  },
};
