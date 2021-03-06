'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert('pages',
      [{
        id: 1,
        id_menu: 1,
        name: "Pagina inicial",
        route: "Home",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        id_menu: 2,
        name: "Novo cliente",
        route: "NewClient",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        id_menu: 2,
        name: "Clientes",
        route: "ListClients",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        id_menu: 3,
        name: "Novo veiculo",
        route: "NewVehicle",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        id_menu: 3,
        name: "Listar veiculos",
        route: "ListVehicles",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 6,
        id_menu: 4,
        name: "Novo Agendamento",
        route: "NewAgendamento",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 7,
        id_menu: 4,
        name: "Listar Agendamentos",
        route: "ListAgendamentos",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 8,
        id_menu: 5,
        name: "Usuarios",
        route: "UsersControl",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 9,
        id_menu: 5,
        name: "Financeiro",
        route: "Financeiro",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 10,
        id_menu: 6,
        name: "Estoque",
        route: "Estoque",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 11,
        name: "Informações do usuario",
        route: "UserInfo",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 12,
        name: "Cadastro de usuario",
        route: "NewUser",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 13,
        name: "Criar Perfil",
        route: "NewPerfil",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 14,
        name: "Informações do perfil",
        route: "ProfileInfo",
        created_at: new Date(),
        updated_at: new Date(),
      },

    ]);
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('pages', null, {});
  },
};
