'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert('users',
      [{
        id: 1,
        id_perfil: 1,
        full_name: "matheus alves",
        login: "matheus@clewsat.com.br",
        password: "123456789", // gerar hash
        occupation: "diretor",
        contact: "11947406555",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        id_perfil: 2,
        full_name: "ana carol",
        login: "ana@clewsat.com.br",
        password: "123456789", // gerar hash
        occupation: "diretor",
        contact: "11947406555",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        id_perfil: 2,
        full_name: "ana carol",
        login: "anaC@clewsat.com.br",
        password: "123456789", // gerar hash
        occupation: "vendedora",
        contact: "11947406555",
        created_at: new Date(),
        updated_at: new Date(),
      },
      ], );
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
