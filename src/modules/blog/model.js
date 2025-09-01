const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../core/database/mysql/connection");

class BlogPost extends Model {}

BlogPost.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    excerpt: { type: DataTypes.TEXT, allowNull: true },
    imageUrl: { type: DataTypes.STRING(500), allowNull: true },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      field: 'author_id'
    },
    status: { 
      type: DataTypes.ENUM('draft', 'published'), 
      defaultValue: 'draft' 
    },
    publishedAt: { type: DataTypes.DATE, allowNull: true },
    viewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    order: { type: DataTypes.INTEGER, defaultValue: 0 },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    sequelize,
    modelName: "BlogPost",
    tableName: "blog_posts",
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ["slug"] },
      { fields: ["author_id"] },
      { fields: ["status"] },
      { fields: ["published_at"] },
    ],
  }
);

module.exports = BlogPost;
