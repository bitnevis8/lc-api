const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../core/database/mysql/connection");

class PricingCategory extends Model {}

PricingCategory.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(150), allowNull: false },
    slug: { type: DataTypes.STRING(180), allowNull: true, unique: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    order: { type: DataTypes.INTEGER, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    sequelize,
    modelName: "PricingCategory",
    tableName: "pricing_categories",
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ["title"] },
      { fields: ["slug"] },
    ],
  }
);

module.exports = PricingCategory;


