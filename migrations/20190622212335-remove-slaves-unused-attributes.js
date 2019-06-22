'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('slaves', 'description'),
            queryInterface.removeColumn('slaves', 'operation_mode'),
            queryInterface.removeColumn('slaves', 'regular_consumption')
        ])
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn(
                'slaves',
                'description',
                Sequelize.STRING
            ),
            queryInterface.addColumn(
                'slaves',
                'operation_mode',
                Sequelize.STRING
            ),
            queryInterface.addColumn(
                'slaves',
                'regular_consumption',
                Sequelize.INTEGER
            )
        ])
    }
};
