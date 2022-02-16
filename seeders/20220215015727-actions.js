'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert('Actions',
      [
      {
        id: 1,
        id_page: 1,
        entity: "Client",
        get: true,
        create: true,
        delete: true,
        edit: true,
      },
      {
        id: 2,
        id_page: 2,
        entity: "home",
        get: true,
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
    await queryInterface.bulkDelete('Actions', null, {});
  },
};