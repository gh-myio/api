'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'slaves',
            'aggregate', {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            }
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('slaves', 'aggregate')
    }
};
