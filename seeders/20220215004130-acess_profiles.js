'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert('acess_profiles',
      [{
        id: 1,
        name: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'vendedor',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      ]);
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('acess_profiles', null, {});
  },
};
