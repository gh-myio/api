'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    let Model = sequelize.define('slaves', {
        type: Sequelize.STRING,
        addr_low: Sequelize.INTEGER,
        addr_high: Sequelize.INTEGER,
        channels: Sequelize.INTEGER,
        name: Sequelize.STRING,
        description: Sequelize.STRING,
        color: Sequelize.STRING,
        code: Sequelize.STRING,
        operation_mode: Sequelize.STRING
    }, {
        underscored: true,
        timestamps: false,
        classMethods: {
            associate: function(models) {
                Model.belongsToMany(models.Ambients, {
                    through: 'ambients_rfir_slaves_rel'
                });
                Model.hasMany(models.Channels, {
                    'as': 'channels_list',
                    'foreignKey': 'slave_id'
                });
                Model.hasMany(models.RawEnergy, {
                    'as': 'slave_id'
                });
                Model.hasMany(models.RfirDevices, {
                    'as': 'devices',
                    'foreignKey': 'slave_id'
                });
            }
        }
    });

    return Model;
};
