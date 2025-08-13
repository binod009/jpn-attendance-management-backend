import { QueryTypes } from "sequelize";
import sequelize from "../config/database";
import { Employee, EmployeeSalary } from "../models";
import asyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";
import salary_svc from "../services/salary.services";

import successHandler from "../utils/successHandler";

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
    console.log("req", req.query);
    const id = parseInt(req.query.id as string);
    const { salary_for_the_month } = req.body;
    const dateObj = new Date(salary_for_the_month);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    console.log(id);
    console.log(salary_for_the_month);
    console.log(year);
    console.log(month);
    const query_present = `
SELECT 
employee_id,
status,
COUNT(*) AS total_present_days
FROM employee_attendance
where
employee_id= 2
AND status='present' AND EXTRACT(YEAR FROM date) = :year AND EXTRACT(MONTH FROM date) = :month
GROUP BY employee_id, status`;

    //get the total leave of the employee for a month
    const calculate_monthly_leave_query = `
WITH expanded_leaves AS (
  SELECT
    employee_id,
    generate_series(start_date::date, end_date::date, interval '1 day') AS leave_day
  FROM leave_requests
  WHERE status = 'approved'
    AND employee_id = :emp_id
)
SELECT
  employee_id,
  EXTRACT(YEAR FROM leave_day) AS year,
  EXTRACT(MONTH FROM leave_day) AS month,
  COUNT(*) AS total_leave_days
FROM expanded_leaves
WHERE EXTRACT(MONTH FROM leave_day) = :month
  AND EXTRACT(YEAR FROM leave_day) = :year
GROUP BY employee_id, year, month
ORDER BY year, month`;
    try {
      const monthly_leave = await sequelize.query<IMonthlyLeaveDataResult>(
        calculate_monthly_leave_query,
        {
          replacements: {
            emp_id: id,
            year: year,
            month: month,
          },
          type: QueryTypes.SELECT,
        }
      );
      console.log("monthly_leave", monthly_leave);

      const employee_details = await Employee.findOne({
        where: {
          user_id: id,
        },
      });

      console.log("emploiyee_details", employee_details);
      const present_day_in_month = await sequelize.query<IPresentDaysInMonth>(
        query_present,
        {
          replacements: {
            year: monthly_leave[0].year,
            month: monthly_leave[0].month,
            employee_id: id,
          },
          type: QueryTypes.SELECT,
        }
      );

      console.log("pressent_dayinmonth", present_day_in_month);
      if (employee_details?.dataValues) {
        const { final_salary, deduction_salary } =
          salary_svc.calculateSalaryDeductionByLeave(
            employee_details?.basic_salary,
            monthly_leave[0].total_leave_days <= 2
              ? 0
              : monthly_leave[0].total_leave_days
          );

        const salary_result = await EmployeeSalary.create({
          employee_id: id,
          month: monthly_leave[0].month.toString(),
          basic_salary: employee_details.basic_salary,
          present_days: present_day_in_month[0].total_present_days,
          paid_leave_days: 2, //should be made dynamic,
          total_working_days: 30,
          unpaid_leave_days:
            monthly_leave[0].total_leave_days <= 2
              ? 0
              : monthly_leave[0].total_leave_days,
          deductions: deduction_salary,
          final_salary: final_salary,
          overtime_hours: 0,
        });
        console.log("salary_Result", salary_result);
        console.log("monthly leave", monthly_leave);
        console.log("total leave days", monthly_leave[0].total_leave_days);
        console.log(
          "remaing leave days",
          monthly_leave[0].total_leave_days - 2
        );
        successHandler(res, 200, "employee salary generated", salary_result);
      }
    } catch (err) {
      console.log("error", err);
    }
  }
);

export { calculateEmployeeSalaryController };
