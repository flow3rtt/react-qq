const Sequelize = require("sequelize");


const db = new Sequelize("qq","root","521314",{
    host:"localhost",
    dialect:"mysql",
})

module.exports = db;