const db = require("./db");
const Sequelize = require("sequelize");
const Vip = db.define("vip", {
  vipId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  vipType: {
    type: Sequelize.ENUM("0", "1", "2"),
    allowNull: false,
    defaultValue: "0"
  },
  vipLevel: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
});

module.exports = Vip;
