'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*const migrate = ``*/

    return Promise.resolve() // queryInterface.sequelize.query(migrate)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('TRUNCATE TABLE public.logs')
  }
};
