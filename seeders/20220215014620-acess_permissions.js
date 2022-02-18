'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert('acess_permissions',
      [
      {
        id_perfil: 1,
        id_page: 2,
        create: true,
        edit: true,
        delete: false,
      },
      {
        id_perfil: 1,
        id_page: 1,
        create: true,
        edit: true,
        delete: false,
      },
      {
        id_perfil: 2,
        id_page: 2,
        create: true,
      },
      ]);
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('acess_permissions', null, {});
  },
};
