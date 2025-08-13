import { Attendance, User } from "../models";
import asyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";
import successHandler from "../utils/successHandler";
import AppError from "../utils/appError";
import sequelize from "../config/database";
import { QueryTypes } from "sequelize";

type statusT = "present" | "absent";

const markAttendanceController = asyncHandler(
  async (req: Request, res: Response) => {
    const { status } = req.query as { status?: string };
    const { date } = req.body;
    if (status !== "present" && status !== "absent") {
      throw new AppError(
        "invalid status value.Must be 'present' or 'absent'",
        400
      );
    }
    const userId = req.user?.id!;

    const attendance_result = await Attendance.create({
      time_in: new Date(),
      status: status as statusT,
      employee_id: userId,
      date: date || new Date(),
    });
    successHandler(
      res,
      201,
      "your attendance is registered",
      attendance_result
    );
  }
);

// optional feature to add time when employee leave the office
const markTimeOutController = asyncHandler(
  async (req: Request, res: Response) => {
    await Attendance.update(
      {
        time_out: new Date(),
      },
      {
        where: {
          employee_id: req.user?.id,
        },
      }
    );
    successHandler(res, 200, "successful");
  }
);

const getAttendanceController = asyncHandler(
  async (req: Request, res: Response) => {
    const employee_id = req.params.employeeId || null;
    console.log(req.params);
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    // const sql_count_query = `SELECT COUNT(*) as total from employee_attendance where employeeId = :employeeId`;
    const query = `SELECT 
    ea.employee_id,
    json_build_object(
        'name', u.name,
        'email', u.email
    ) AS employee_details,
    COUNT(ea.id) AS total_present,
    json_agg(
        json_build_object(
            'date', ea.date,
            'time_in', ea.time_in,
            'time_out', ea.time_out,
            'status', ea.status
        ) ORDER BY ea.date
    ) AS attendance_records
FROM employee_attendance ea
LEFT JOIN users u ON ea.employee_id = u.id
WHERE AND ea.status = 'present'
AND (:employee_id is NULL OR ea.employee_id = :employee_id)
GROUP BY ea.employee_id, u.name, u.email;
`;
    const result = await sequelize.query(query, {
      replacements: {
        employee_id: employee_id,
        limit: limit,
        offset: offset,
      },
      type: QueryTypes.SELECT,
    });
    
    successHandler(res, 200, "successfully retrieved", result);
  }
);

export {
  markAttendanceController,
  markTimeOutController,
  getAttendanceController,
};
