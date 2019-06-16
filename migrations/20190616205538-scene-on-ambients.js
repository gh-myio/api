'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'scenes',
            'ambient_id',
            {
                type: Sequelize.INTEGER,
                references: {
                    model: 'ambients',
                    key: 'id'
                }
            }
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('scenes', 'ambient_id')
    }
};
