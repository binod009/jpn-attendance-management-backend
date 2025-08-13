import { DataTypes, DATE, Model, Sequelize } from "sequelize";
import sequelize from "../config/database";
import {
  EmployeeLeaveSummaryAttributes,
  EmployeeLeaveSummaryCreationAttributes,
} from "../interface/model/empoyee_leave_summary.nterface";

const EmployeeLeaveSummaryModel = (sequelize: Sequelize) => {
  class EmployeeLeaveSummary extends Model<
    EmployeeLeaveSummaryAttributes,
    EmployeeLeaveSummaryCreationAttributes
  > {
    public id?: number;
    public employee_id!: number;
    public year!: number;
    public total_allowed_days!: number;
    public days_taken!: number;
    public month!: number;
    public remaining_days?: number;
    public created_at?: Date;
    public updated_at?: Date;
  }

  EmployeeLeaveSummary.init(
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
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      month: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_allowed_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      days_taken: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      remaining_days: {
        type: DataTypes.VIRTUAL,
        get() {
          const totalAllowed = this.getDataValue("total_allowed_days") || 0;
          const daysTaken = this.getDataValue("days_taken") || 0;
          return totalAllowed - daysTaken;
        },
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
      modelName: "EmployeeLeaveSummary",
      tableName: "employee_leave_summary",
      createdAt: "created_at",
      updatedAt: "updated_at",
      hooks: {
        beforeCreate: (leaveSummary) => {
          leaveSummary.created_at = new Date();
          leaveSummary.updated_at = new Date();
        },
        beforeUpdate: (leaveSummary) => {
          leaveSummary.updated_at = new Date();
        },
      },
    }
  );
  return EmployeeLeaveSummary;
};

export default EmployeeLeaveSummaryModel;
