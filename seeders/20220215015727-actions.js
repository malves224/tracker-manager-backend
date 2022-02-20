'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert('actions',
      [
      {
        id: 1,
        id_page: 2,
        entity: "client",
        get: false,
        create: true,
        delete: false,
        edit: false,
      },
      {
        id: 2,
        id_page: 2,
        entity: "client",
        get: true,
        create: false,
        delete: false,
        edit: false,
      },
      {
        id: 3,
        id_page: 2,
        entity: "Client",
        get: true,
      },
      ]);
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('actions', null, {});
  },
};
