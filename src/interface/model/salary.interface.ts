import { UpdateOptions } from "sequelize";

export interface SalaryAttributes{
    id?: number;
    employee_id: number;
    month: string;
    basic_salary: number;
    total_working_days: number;
    present_days: number;
    paid_leave_days: number;
    unpaid_leave_days: number;
    overtime_hours?: number;
    deductions: number;
    final_salary: number;
    created_at?: Date,
    updated_at?:Date
}

export interface SalaryCreationAttributes extends Omit<SalaryAttributes, "id" | "created_at" | "updated_at"> { }