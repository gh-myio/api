'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn(
            'rfir_devices',
            'description'
        )
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'rfir_devices',
            'description',
            Sequelize.STRING
        )
    }
};
