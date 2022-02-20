'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert('acess_permissions',
      [
      {
        id_perfil: 1,
        id_page: 1,
      },
      {
        id_perfil: 1,
        id_page: 2,
        create: true,
      },
      {
        id_perfil: 1,
        id_page: 3,
      },
      {
        id_perfil: 1,
        id_page: 4,
        create: true,
      },
      {
        id_perfil: 1,
        id_page: 5,
      },
      {
        id_perfil: 1,
        id_page: 6,
        create: true,
      },
      {
        id_perfil: 1,
        id_page: 7,
      },
      {
        id_perfil: 1,
        id_page: 8,
      },
      {
        id_perfil: 1,
        id_page: 9,
        create: true,
        edit: true,
        delete: true,
      },
      {
        id_perfil: 1,
        id_page: 10,
        create: true,
        edit: true,
        delete: true,
      },
      {
        id_perfil: 1,
        id_page: 11,
        edit: true,
        delete: true,
      },
      {
        id_perfil: 1,
        id_page: 12,
        create: true,
      },
      {
        id_perfil: 2,
        id_page: 11,
        edit: false,
        delete: false,
      },
      {
        id_perfil: 2,
        id_page: 12,
        create: true,
      },
    ]);
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('acess_permissions', null, {});
  },
};
