import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../config/database";
import {
  LeaveRequestAttributes,
  LeaveRequestCreationAttributes,
  TLeaveStatus,
  TLeaveType,
} from "../interface/model/leave_requests.interface";
import { types } from "util";

const LeaveRequestModel = (sequelize: Sequelize) => {
  class LeaveRequest extends Model<
    LeaveRequestAttributes,
    LeaveRequestCreationAttributes
  > {
    public id?: number;
    public employee_id!: number;
    public leave_type!: TLeaveType;
    public reason!: string;
    public start_date!: string; // ISO date string like "2025-08-10"
    public end_date!: string; // ISO date string
    public status!: TLeaveStatus; // optional during creation, defaults to 'pending'
    public total_leave_days?: number;
    public created_at?: Date; // ISO datetime string
    public updated_at?: Date;
  }
  LeaveRequest.init(
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
      leave_type: {
        type: DataTypes.ENUM("sick", "vacation"),
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      total_leave_days: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        allowNull: false,
        defaultValue: "pending",
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
      modelName: "LeaveRequest",
      tableName: "leave_requests",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      hooks: {
        beforeCreate: (leave) => {
          leave.created_at = new Date();
          leave.updated_at = new Date();
          const start = new Date(leave.start_date);
          const end = new Date(leave.end_date);
          leave.total_leave_days =
            Math.floor(
              (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
            ) + 1;
        },
        beforeUpdate: (leave) => {
          leave.updated_at = new Date();
        },
      },
    }
  );

  return LeaveRequest;
};
export default LeaveRequestModel;

// Calculate days difference and add 1 to include both start and end dates
