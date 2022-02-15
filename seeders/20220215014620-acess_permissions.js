'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert('AcessPermissions',
      [
      {
        id_perfil: 1,
        id_page: 2,
      },
      {
        id_perfil: 1,
        id_page: 1,
      },
      {
        id_perfil: 2,
        id_page: 2,
      },
      ]);
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('AcessPermissions', null, {});
  },
};
