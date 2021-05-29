module.exports = function (sequelize, DataTypes) {
  var Resident = sequelize.define("Resident", {
    unitNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      len: [6, 7],
    },
    ownerLastName: DataTypes.STRING,
    ownerFirstName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      isEmail: true,
    },
    phone1: {
      type: DataTypes.STRING,
      len: [10],
    },
    phone2: {
      type: DataTypes.STRING,
      len: [10],
    },
    altAddress: DataTypes.STRING,
    note: DataTypes.TEXT,
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "not specified",
    },
  });
  return Resident;
};
