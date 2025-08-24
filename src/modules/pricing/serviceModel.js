const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../core/database/mysql/connection");

class PricingService extends Model {}

PricingService.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    deviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "pricing_devices", key: "id" },
      field: 'device_id'
    },
    title: { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    order: { type: DataTypes.INTEGER, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    sequelize,
    modelName: "PricingService",
    tableName: "pricing_services",
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ["device_id"] },
      { fields: ["title"] },
    ],
  }
);

module.exports = PricingService;



