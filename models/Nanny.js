const sequelize = require("../db")
const Sequelize = require('sequelize')

const Nanny = sequelize.define('nanny', {
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
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    age: {
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

module.exports = Nanny