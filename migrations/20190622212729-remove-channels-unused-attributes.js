'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn(
            'channels',
            'description'
        )
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'channels',
            'description',
            Sequelize.STRING
        )
    }
};
