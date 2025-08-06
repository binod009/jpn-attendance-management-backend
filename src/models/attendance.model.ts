import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../config/database";
import {
  AttendanceAttributes,
  AttendanceCreationAttributes,
} from "../interface/model/attendance.interface";

const attendanceModel = (sequelize: Sequelize) => {
  class Attendance extends Model<
    AttendanceAttributes,
    AttendanceCreationAttributes
  > {
    public id!: number;
    public employeeId!: number;
    public status!: "present" | "absent";
    public date!: Date;
    public timeIn!: Date;
    public timeOut!: Date;
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

      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
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
      timeIn: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      timeOut: {
        type: DataTypes.DATE,
        allowNull: false,
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
