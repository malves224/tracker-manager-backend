'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert('menu_items',
      [{
        id: 1,
        name: "Pagina inicial",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: "Clientes",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: "Veiculos",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        name: "Agendamentos",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        name: "Administração",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {       
        id: 6, 
        name: "Estoque",
        created_at: new Date(),
        updated_at: new Date(),
      },      
    ]);
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('menu_items', null, {});
  },
};
