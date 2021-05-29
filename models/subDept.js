module.exports = function (sequelize, DataTypes) {
  var SubDept = sequelize.define("SubDept", {
    subDept: DataTypes.STRING,
  });
  return SubDept;
};
