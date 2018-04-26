const db = require('./db');
const Sequelize = require('sequelize');
const Group = require('./group');
const GroupMessage = db.define('groupMessage', {
  gmId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  gmContent: {
    type: Sequelize.STRING,
    defaultValue: '',
    allowNull: false
  },
});

GroupMessage.belongsTo(Group, {
  foreignKey: 'gmGId'
});
module.exports = GroupMessage;
