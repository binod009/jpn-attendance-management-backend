import { QueryTypes } from "sequelize";
import sequelize from "../config/database";
import { Employee, EmployeeSalary } from "../models";
import asyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";
import salary_svc from "../services/salary.services";

import successHandler from "../utils/successHandler";
import AppError from "../utils/appError";

interface IMonthlyLeaveDataResult {
  employee_id: number;
  year: number;
  month: number;
  total_leave_days: number;
}
interface IPresentDaysInMonth {
  employee_id: number;
  status: "present" | "absent";
  total_present_days: number;
}

const calculateEmployeeSalaryController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.query.id);
    const { salary_for_the_month } = req.body;
    if (!id || !salary_for_the_month) {
      return res
        .status(400)
        .json({ message: "Missing employee id or salary month" });
    }

    const dateObj = new Date(salary_for_the_month);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    // checking if there is any pending leave request before generating salary for the current month
    const pending_request = `
    SELECT COUNT(*) AS pending_count
    FROM leave_requests WHERE employee_id = :employee_id AND EXTRACT (YEAR FROM start_date)= :year AND EXTRACT (MONTH FROM start_date)= :month AND status = 'pending'`;
    
    const pending_check = await sequelize.query(pending_request, {
      replacements: {
        year: salary_for_the_month.getFullYear(),
        month: salary_for_the_month.getMonth() + 1,
        employee_id: id,
      },
      type: QueryTypes.SELECT,
    });

    if (pending_check) {
      throw new AppError(
        "unresolved employee pending request for the month",
        400
      );
    }

    const query_present = `
      SELECT employee_id, status, COUNT(*) AS total_present_days
      FROM employee_attendance
      WHERE employee_id = :employee_id
        AND status = 'present'
        AND EXTRACT(YEAR FROM date) = :year
        AND EXTRACT(MONTH FROM date) = :month
      GROUP BY employee_id, status
    `;

    const calculate_monthly_leave_query = `
      WITH expanded_leaves AS (
        SELECT employee_id, generate_series(start_date::date, end_date::date, interval '1 day') AS leave_day
        FROM leave_requests
        WHERE status = 'approved' AND employee_id = :emp_id
      )
      SELECT employee_id, EXTRACT(YEAR FROM leave_day) AS year, EXTRACT(MONTH FROM leave_day) AS month, COUNT(*) AS total_leave_days
      FROM expanded_leaves
      WHERE EXTRACT(MONTH FROM leave_day) = :month AND EXTRACT(YEAR FROM leave_day) = :year
      GROUP BY employee_id, year, month
      ORDER BY year, month
    `;

    try {
      const [monthly_leave] = await sequelize.query<IMonthlyLeaveDataResult>(
        calculate_monthly_leave_query,
        {
          replacements: { emp_id: id, year, month },
          type: QueryTypes.SELECT,
        }
      );

      if (!monthly_leave) {
        return res
          .status(404)
          .json({ message: "No leave data found for this employee/month" });
      }

      const employee_details = await Employee.findOne({
        where: { user_id: id },
      });
      if (!employee_details) {
        return res.status(404).json({ message: "Employee not found" });
      }

      const [present_day_in_month] = await sequelize.query<IPresentDaysInMonth>(
        query_present,
        {
          replacements: { year, month, employee_id: id },
          type: QueryTypes.SELECT,
        }
      );

      const present_days = present_day_in_month?.total_present_days || 0;
      const total_leave_days = monthly_leave.total_leave_days || 0;
      const paid_leave_days = 2; // Make dynamic if needed
      const unpaid_leave_days =
        total_leave_days <= paid_leave_days
          ? 0
          : total_leave_days - paid_leave_days;

      const { final_salary, deduction_salary } =
        salary_svc.calculateSalaryDeductionByLeave(
          employee_details.basic_salary,
          unpaid_leave_days
        );

      const salary_result = await EmployeeSalary.create({
        employee_id: id,
        month: month.toString(),
        basic_salary: employee_details.basic_salary,
        present_days,
        paid_leave_days,
        total_working_days: 30,
        unpaid_leave_days,
        deductions: deduction_salary,
        final_salary,
        overtime_hours: 0,
      });

      successHandler(res, 200, "employee salary generated", salary_result);
    } catch (err) {
      console.error("error", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { calculateEmployeeSalaryController };
