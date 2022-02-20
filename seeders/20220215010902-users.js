'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert('users',
      [{
        id: 1,
        id_perfil: 1,
        full_name: "matheus alves",
        login: "matheus@clewsat.com.br",
        password: "FRQpT6NgnGXRboa4d+LnnA$PhW1ytwuzOXphDfODOaFxx10mTF5B7QA8otHzBxHmZE",
        occupation: "diretor",
        contact: "11947406555",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        id_perfil: 2,
        full_name: "ana carol",
        login: "anaC@clewsat.com.br",
        password: "xSFjtu8b/9z1JrOpMLSoLQ$1I/uEoRBsurqlf6ZNdBRiExzP5+AX7JDbChifsEgtYw",
        occupation: "vendedora",
        contact: "11947406555",
        created_at: new Date(),
        updated_at: new Date(),
      },
      ], 
    );
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
