'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idPerfil: {
        allowNull: false,
        type: Sequelize.INTEGER,
        field: "id_perfil",
        references: {
          model: "Acess_profiles",
          key: "id"
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',  
      },
      fullName: {
        allowNull: false,
        type: Sequelize.STRING,
        field: "full_name"
      },
      login: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      password: {
        allowNull: false,
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
    queryInterface.dropTable('Users');
  }};
