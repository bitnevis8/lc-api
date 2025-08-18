const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../core/database/mysql/connection");

class PricingDevice extends Model {}

PricingDevice.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    categoryId: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      references: { model: "pricing_categories", key: "id" },
      field: 'category_id'
    },
    title: { type: DataTypes.STRING(180), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    imageUrl: { type: DataTypes.STRING(500), allowNull: true },
    order: { type: DataTypes.INTEGER, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    sequelize,
    modelName: "PricingDevice",
    tableName: "pricing_devices",
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ["category_id"] },
      { fields: ["title"] },
    ],
  }
);

module.exports = PricingDevice;


