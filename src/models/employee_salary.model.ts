import { DataTypes, Model, Sequelize } from "sequelize";

import {
  SalaryAttributes,
  SalaryCreationAttributes,
} from "../interface/model/salary.interface";

const EmployeeSalaryModel = (sequelize: Sequelize) => {
  class EmployeeSalary extends Model<
    SalaryAttributes,
    SalaryCreationAttributes
  > {
    public id?: number;
    public employee_id!: number;
    public month!: string;
    public basic_salary!: number;
    public total_working_days!: number;
    public present_days!: number;
    public paid_leave_days!: number;
    public unpaid_leave_days!: number;
    public overtime_hours?: number;
    public deductions!: number;
    public final_salary!: number;
    public created_at?: Date;
    public updated_at?: Date;
  }
  EmployeeSalary.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      employee_id: { type: DataTypes.INTEGER, allowNull: false },
      month: { type: DataTypes.STRING(7), allowNull: false },
      basic_salary: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      total_working_days: { type: DataTypes.INTEGER, allowNull: false,defaultValue:30 },
      present_days: { type: DataTypes.INTEGER, allowNull: false },
      paid_leave_days: { type: DataTypes.INTEGER, allowNull: false },
      unpaid_leave_days: { type: DataTypes.INTEGER, allowNull: false },
      overtime_hours: { type: DataTypes.INTEGER, defaultValue: 0 },
      deductions: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
      final_salary: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    },
    {
      sequelize,
      modelName: "EmployeeSalary",
      tableName: "employee_salaries",
      timestamps: true,
    }
  );
  return EmployeeSalary;
};

export default EmployeeSalaryModel;
