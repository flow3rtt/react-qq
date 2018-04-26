const db = require("./db");
const Sequelize = require("sequelize");

const UserDetail = db.define("userDetail", {
  udId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement:true
  },
  udNickname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  udSignature: {
    type: Sequelize.STRING,
    defaultValue: ""
  },
  udFace: {
    type: Sequelize.STRING,
    defaultValue:'/img/udf-default.png',
  },
  udSex: {
    type: Sequelize.STRING,
    defaultValue: "男"
  },
  udAge: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  udConstellation: {
    type: Sequelize.STRING,
    defaultValue: "水瓶"
  },
  udPlace: {
    type: Sequelize.STRING,
    defaultValue: "杭州"
  },
  udFavor: {
    type: Sequelize.STRING,
    defaultValue: "睡觉"
  },
  udLevel: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  udBackgroundImage: {
    type: Sequelize.STRING,
    defaultValue:'/img/udb-default.png',
  },
  udLoginDay: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
});


module.exports = UserDetail;
