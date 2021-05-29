module.exports = function (sequelize, DataTypes) {
  var Dept = sequelize.define("Dept", {
    dept: DataTypes.STRING,
  });
  return Dept;
};
