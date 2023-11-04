const {Sequelize,DataTypes,Op, DATE, TIME} = require('sequelize');

const sequelize = new Sequelize('visitorsdb', 'root', 'v9@jkx@WERVZa5rDD&Pf', {
  host: 'localhost',
  dialect: 'mysql',

});

const Visitor_information = sequelize.define('Visitor_information', {
  visitor_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  visitor_email: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  visitor_phone_number: {
    type: Sequelize.STRING,
    // defaultValue:allowNull,
    allowNull: true
  },
  visitor_organization: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  visitor_purpose: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  visitor_whom_meet:{
    type: Sequelize.STRING,
    allowNull: true,
  },
  status_visitor: {
    type: DataTypes.BOOLEAN,
    defaultValue: 1,
  },
  visit_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  visit_time: {
    type: DataTypes.TIME,
    defaultValue: TIME.NOW,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  image_filename: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // employeeId: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
});


const EmployeeOTP = sequelize.define('EmployeeOTP', {
  employee_email:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiration_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  is_used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});



module.exports = { sequelize, Visitor_information,EmployeeOTP };
