module.exports = function (sequelize, DataTypes) {
  var Money = sequelize.define("Money", {
    incomeOrExpense: {
      type: DataTypes.STRING(1),
      allowNull: false,
      isIn: [["I", "E"]],
    },
    amount: DataTypes.DECIMAL(10, 2),
    invoiceNo: DataTypes.STRING,
    itemDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    forYear: {
      type: DataTypes.INTEGER,
      len: [4],
      min: 2019,
      max: 2040,
    },
    checkNo: DataTypes.INTEGER,
    payerOrPayee: DataTypes.STRING,
    description: DataTypes.STRING,
    note: DataTypes.TEXT,
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "not specified",
    },
  });
  return Money;
};
