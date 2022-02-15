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
        allowNull: true,
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
        allowNull: true,
        type: Sequelize.STRING,
      },
      get: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      create: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      delete: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      edit: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Actions');
  }
};
