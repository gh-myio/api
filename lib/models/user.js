const bcrypt = require('bcryptjs')
const Sequelize = require('sequelize')

function UserModel (sequelize) {
  const User = sequelize.define('users', {
    UUID: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    name: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    email: {
      type: Sequelize.TEXT,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.TEXT,
      allowNull: true,
      set: function (pw) {
        // const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(pw, 8)
        this.setDataValue('password', hash)
      }
    }
  }, {
    force: true,
    paranoid: false,
    defaultScope: {
      attributes: {
        exclude: ['password', 'deletedAt']
      }
    },
    scopes: {
      login: () => {
        return {
          attributes: {
            include: ['password'],
            exclude: ['deletedAt', 'createdAt', 'updatedAt']
          }
        }
      },
      base: () => {
        return {
          attributes: {
            exclude: [
              'createdAt',
              'updatedAt',
              'deletedAt',
              'password'
            ]
          }
        }
      }
    }
  })

  User.new = (email, password) => {
    return User.create({
    })
  }

  return User
}

module.exports = UserModel
