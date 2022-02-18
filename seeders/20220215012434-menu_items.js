'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert('menu_items',
      [{
        id: 1,
        name: "Clientes",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Pagina inicial",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      ]);
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('menu_items', null, {});
  },
};
