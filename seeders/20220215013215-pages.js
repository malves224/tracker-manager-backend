'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert('pages',
      [{
        id: 1,
        id_menu: 1,
        name: "Pagina inicial",
        route: "Home",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        id_menu: 2,
        name: "Novo cliente",
        route: "NewClient",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        id_menu: 2,
        name: "Clientes",
        route: "ListClients",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        id_menu: 3,
        name: "Novo veiculo",
        route: "NewVehicle",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        id_menu: 3,
        name: "Listar veiculos",
        route: "ListVehicles",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        id_menu: 4,
        name: "Novo Agendamento",
        route: "NewAgendamento",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 7,
        id_menu: 4,
        name: "Listar Agendamentos",
        route: "ListAgendamentos",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 8,
        id_menu: 5,
        name: "Usuarios",
        route: "UsersControl",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 9,
        id_menu: 5,
        name: "Financeiro",
        route: "Financeiro",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 10,
        id_menu: 6,
        name: "Estoque",
        route: "Estoque",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 11,
        name: "Informações do usuario",
        route: "UserInfo",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 12,
        name: "Cadastro de usuario",
        route: "NewUser",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('pages', null, {});
  },
};
