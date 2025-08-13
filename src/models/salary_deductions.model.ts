import { DataTypes, Model, Sequelize } from "sequelize";

import {
  SalaryDeductionCreationAttributes,
  SalaryDeductionsAttributes,
  TLeaveType,
} from "../interface/model/salary_deductions.interface";

const SalaryDeductionModel = (sequelize: Sequelize) => {
  class SalaryDeductions
    extends Model<SalaryDeductionsAttributes, SalaryDeductionCreationAttributes>
    implements SalaryDeductionsAttributes
  {
    public id?: number;
    public employee_id!: number;
    public leave_type!: TLeaveType;
    public amount!: number;
    public notes?: string;
    public date!: Date;
    public created_at?: Date;
    public updated_at?: Date;
  }
  SalaryDeductions.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      employee_id: {
        type: DataTypes.INTEGER,
        references: { model: "employee", key: "user_id" },
      },
      date: { type: DataTypes.DATE, allowNull: false },
      leave_type: {
        type: DataTypes.ENUM("late", "unpaid_leave", "others"),
        allowNull: false,
      },
      amount: { type: DataTypes.INTEGER, allowNull: false },
      notes: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "SalaryDeductions",
      tableName: "employee_salary_deductions",
      createdAt: "created_at",
      updatedAt: "updated_at",
      hooks: {
        beforeCreate: (salary_deduction) => {
          (salary_deduction.created_at = new Date()),
            (salary_deduction.updated_at = new Date());
        },
        afterUpdate: (salary_deduction) => {
          salary_deduction.updated_at = new Date();
        },
      },
    }
  );
  return SalaryDeductions;
};

export default SalaryDeductionModel;
