const db = require('./db');
const Sequelize = require('sequelize');
const Friend = db.define('friend', {
  fId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fNote:{
      type:Sequelize.STRING,
      allowNull:false,
      defaultValue:''
  },
  fIs:{
      type:Sequelize.BOOLEAN,
      defaultValue:false
  },
  fConcern:{
      type:Sequelize.BOOLEAN,
      defaultValue:false
  }
});


module.exports = Friend;
