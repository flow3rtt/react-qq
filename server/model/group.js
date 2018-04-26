const db = require('./db');
const Sequelize = require('sequelize');
const Group = db.define('group', {
  groupId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement:true
  },
  groupName:{
     type:Sequelize.STRING,
     allowNull:false 
  },
  groupIntro:{
      type:Sequelize.STRING,
      allowNull:false,
      defaultValue:''
  },
  groupFace:{
      type:Sequelize.STRING,
      defaultValue:'/img/gf-default.png',
      allowNull:false,
  },
});

module.exports = Group;
