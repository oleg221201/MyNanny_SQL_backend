const sequelize = require("../db")
const Sequelize = require('sequelize')

const Parent = sequelize.define('parent', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    parentName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    childName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    childAge: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false
    },
    salary: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Parent