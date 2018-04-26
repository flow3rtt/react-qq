const db = require('./db');
const Sequelize = require('sequelize');
const Grouping = db.define('grouping', {
  groupingId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement:true
  },
  groupingName:{
     type:Sequelize.STRING,
     allowNull:false 
  },
  groupingUIds:{
      type:Sequelize.STRING,
      allowNull:false,
      defaultValue:''
  },
  groupingDefault:{
      type:Sequelize.BOOLEAN,
      defaultValue:false
  }
});

module.exports = Grouping;
