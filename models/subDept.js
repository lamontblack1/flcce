module.exports = function (sequelize, DataTypes) {
  var SubDept = sequelize.define("SubDept", {
    subDept: DataTypes.STRING
  });
  return SubDept;
};

// budget2020: DataTypes.DECIMAL(10, 2),
// budget2021: DataTypes.DECIMAL(10, 2),
// budget2022: DataTypes.DECIMAL(10, 2),
// IOrE: DataTypes.STRING(1)
