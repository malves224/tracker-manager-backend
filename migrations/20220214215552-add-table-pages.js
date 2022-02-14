'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.createTable('Pages',{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idMenu: {
        allowNull: false,
        type: Sequelize.INTEGER,
        field: "id_menu",
        references: {
          model: "Menu_items",
          key: "id"
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',  
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      route : {
        allowNull: true,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Pages');
  }
};
