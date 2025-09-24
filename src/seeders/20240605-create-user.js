'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('users', [
      {
        id: uuidv4(),
        name: 'Admin',
        matrix_id: null,
        matrix_token: null,
        email: 'admin@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', { username: 'admin' }, {});
  }
};
