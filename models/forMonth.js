module.exports = function (sequelize, DataTypes) {
  var ForMonth = sequelize.define("ForMonth", {
    shortMonth: DataTypes.STRING,
    longMonth: DataTypes.STRING,
  });
  return ForMonth;
};
