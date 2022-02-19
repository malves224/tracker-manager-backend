'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert('acess_profiles',
      [{
        id: 1,
        name: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: 'vendedor',
        created_at: new Date(),
        updated_at: new Date(),
      },
      ]);
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('acess_profiles', null, {});
  },
};
