const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../core/database/mysql/connection");

class Appointment extends Model {}

Appointment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "شناسه کاربر به عنوان بیمار",
      references: {
        model: "users",
        key: "id"
      }
    },
    staffId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "شناسه کاربر به عنوان اپراتور/پزشک",
      references: {
        model: "users",
        key: "id"
      }
    },
    serviceTitle: {
      type: DataTypes.STRING(150),
      allowNull: false,
      comment: "نام سرویس/خدمت"
    },
    startAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("scheduled", "confirmed", "completed", "canceled"),
      allowNull: false,
      defaultValue: "scheduled"
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: "Appointment",
    tableName: "appointments",
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ["start_at"] },
      { fields: ["end_at"] },
      { fields: ["patient_id"] },
      { fields: ["staff_id"] }
    ]
  }
);

module.exports = Appointment;


