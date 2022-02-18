'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert('pages',
      [{
        id: 1,
        id_menu: 1,
        name: "cadastrar cliente",
        route: "NewClient",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        id_menu: 2,
        name: "Pagina inicial",
        route: "Home",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      ]);
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('pages', null, {});
  },
};
