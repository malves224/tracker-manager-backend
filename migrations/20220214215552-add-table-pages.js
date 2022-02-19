'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.createTable('pages',{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idMenu: {
        allowNull: true,
        type: Sequelize.INTEGER,
        field: "id_menu",
        references: {
          model: "menu_items",
          key: "id"
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',  
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      route: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    })
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pages');
  }
};
