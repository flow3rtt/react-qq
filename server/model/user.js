const db = require('./db');
const Sequelize = require('sequelize');
const UserDetail  =require('./userDetail')
const Vip  =require('./vip')
const Grouping  =require('./grouping')
const Group =require('./group')
const GroupUser  =require('./groupUser')
const GroupMessage  =require('./groupMessage')
const PrivateMessage  =require('./privateMessage')
const Friend  =require('./friend')


const User = db.define('user', {
  uId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement:true
  },
  uQq: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  uPassword: {
    type: Sequelize.STRING,
    allowNull: false
  },
  uPhone: {
    type: Sequelize.STRING(11),
    allowNull: false,
    unique: true
  },
  uLastLoginTime: {
    type: Sequelize.DATE
  },
  uStatus: {
    type: Sequelize.ENUM('0', '1', '2'),
    allowNull: false,
    defaultValue: '0'
  },
  uDeviceStatus: {
    type: Sequelize.ENUM('0', '1', '2', '3', '4', '5'),
    allowNull: false,
    defaultValue: '0'
  },
  uSocketId: {
    type: Sequelize.STRING,
    unique: true
  }
});

User.hasOne(UserDetail,{
  foreignKey:'udUId',
  as:'UD'
})
User.hasOne(Vip,{
  foreignKey:'vipUId'
})
User.hasMany(Grouping,{
  foreignKey:'gUId'
})
User.hasMany(Group,{
  foreignKey:'gCUId'
})
User.hasMany(GroupUser,{
  foreignKey:'guUId',
  as:'GU'
})

User.hasMany(GroupMessage,{
  foreignKey:'gmUId',
  as:'GM'
})

User.hasMany(PrivateMessage,{
  foreignKey:'pmFUId',
  as:'PMF'
})

User.hasMany(PrivateMessage,{
  foreignKey:'pmTUId',
  as:'PMT'
})
User.hasMany(Friend,{
  foreignKey:'fUId',
  as:'F'
})

User.hasMany(Friend,{
  foreignKey:'fFUId',
  as:'FF'
})


db.sync({
});

module.exports = User;
