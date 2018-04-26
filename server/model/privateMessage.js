const db = require('./db');
const Sequelize = require('sequelize');
const PrivateMessage = db.define('privateMessage', {
  pmId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  pmContent: {
    type: Sequelize.STRING,
    defaultValue: '',
    allowNull: false
  },
  pmUnread: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: false
  }
});

module.exports = PrivateMessage;
