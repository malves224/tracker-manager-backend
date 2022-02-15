'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AcessPermissions', {
      idPerfil: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        field: 'id_perfil',
        references: {
          model: 'AcessProfiles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      idPage: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        field: 'id_page',
        references: {
          model: 'Pages',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('AcessPermissions');
  }
};
