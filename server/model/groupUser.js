const db = require('./db');
const Sequelize = require('sequelize');
const Group = require('./group')
const GroupUser = db.define('groupUser', {
  guId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement:true
  },
  guRole:{
      type:Sequelize.ENUM('0','1','2'),
      allowNull:false,
      defaultValue:'2'
  },
  guName:{
      type:Sequelize.STRING,
      defaultValue:'',
      allowNull:false
  }
});
GroupUser.belongsTo(Group,{
    foreignKey:'guGId'
})

module.exports = GroupUser;
