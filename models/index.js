"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//make all associations here before exporting
//Dept -
db.Money.belongsTo(db.Dept, {
  foreignKey: "deptId",
});
db.Dept.hasMany(db.Money, {
  foreignKey: "deptId",
});

//forMonth
db.Money.belongsTo(db.ForMonth, {
  foreignKey: "forMonthId",
});
db.ForMonth.hasMany(db.Money, {
  foreignKey: "forMonthId",
});

//subDept
db.Money.belongsTo(db.SubDept, {
  foreignKey: "subDeptId",
});
db.SubDept.hasMany(db.Money, {
  foreignKey: "subDeptId",
});

//associate dept with subDept
db.SubDept.belongsTo(db.Dept, {
  foreignKey: "deptId",
});
db.Dept.hasMany(db.SubDept, {
  foreignKey: "deptId",
});

module.exports = db;
