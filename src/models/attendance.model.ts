import { DataTypes, Model, Sequelize } from "sequelize";

import {
  AttendanceAttributes,
  AttendanceCreationAttributes,
} from "../interface/model/attendance.interface";
import sequelize from "../config/database";
const attendanceModel = (sequelize: Sequelize) => {
  class Attendance extends Model<
    AttendanceAttributes,
    AttendanceCreationAttributes
  > {
    public id!: number;
    public employee_id!: number;
    public status!: "present" | "absent";
    public date!: Date;
    public time_in?: Date;
    public time_out?: Date;
    public created_at?: Date;
    public updated_at?: Date;
  }
  Attendance.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      status: {
        type: DataTypes.ENUM("absent", "present"),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      time_in: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      time_out: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "created_at",
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "updated_at",
      },
    },
    {
     sequelize,
      modelName: "Attendance",
      tableName: "employee_attendance",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      hooks: {
        beforeCreate: (attendance) => {
          attendance.created_at = new Date();
          attendance.updated_at = new Date();
        },
        beforeUpdate: (attendance) => {
          attendance.updated_at = new Date();
        },
      },
    }
  );
  return Attendance;
};

export default attendanceModel;
