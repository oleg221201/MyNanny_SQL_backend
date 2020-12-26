const sequelize = require("../db")
const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes


const Advertisement = sequelize.define('advertisement', {
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
    type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    responds: {
        type: DataTypes.ARRAY(DataTypes.INTEGER)
    }
})

module.exports = Advertisement