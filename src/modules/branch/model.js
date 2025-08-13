const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../core/database/mysql/connection");

class Branch extends Model {}

Branch.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    address: { type: DataTypes.STRING(500), allowNull: true },
    phone: { type: DataTypes.STRING(30), allowNull: true },
    mobile: { type: DataTypes.STRING(30), allowNull: true },
    managerPhone: { type: DataTypes.STRING(30), allowNull: true, comment: "شماره تماس مدیریت پایخان" },
    instagram: { type: DataTypes.STRING(200), allowNull: true },
    telegram: { type: DataTypes.STRING(200), allowNull: true },
    whatsapp: { type: DataTypes.STRING(200), allowNull: true },
    latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
    longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
    openTime: { type: DataTypes.TIME, allowNull: true, comment: "ساعت شروع کاری (HH:MM:SS)" },
    closeTime: { type: DataTypes.TIME, allowNull: true, comment: "ساعت پایان کاری (HH:MM:SS)" },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    sequelize,
    modelName: "Branch",
    tableName: "branches",
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ["name"] },
    ]
  }
);

module.exports = Branch;


