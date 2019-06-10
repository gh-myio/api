'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('consumption_alerts', 'name')
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'consumption_alerts',
            'name',
            Sequelize.STRING
        )
    }
};
