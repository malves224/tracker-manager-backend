'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.createTable('Actions',{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idPage: {
        allowNull: false,
        type: Sequelize.INTEGER,
        field: "id_page",
        references: {
          model: "Pages",
          key: "id"
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      entity: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      get: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      create: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      delete: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      edit: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Actions');
  }
};
