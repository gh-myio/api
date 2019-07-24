'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'slaves',
            'clamp_type',
            Sequelize.INTEGER
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('slaves', 'clamp_type')
    }
};
