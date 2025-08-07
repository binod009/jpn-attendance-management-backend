import { Attendance, User } from "../models";
import asyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";
import successHandler from "../utils/successHandler";
import AppError from "../utils/appError";

type statusT = "present" | "absent";

const markAttendanceController = asyncHandler(
  async (req: Request, res: Response) => {
    const { status } = req.query as { status?: string };
    if (status !== "present" && status !== "absent") {
      throw new AppError(
        "invalid status value.Must be 'present' or 'absent'",
        400
      );
    }
    const userId = req.user?.id!;
    console.log("Request user", req.user);
    const attendance_result = await Attendance.create({
      timeIn: new Date(),
      status: status as statusT,
      employeeId: userId,
      date: new Date(),
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
        timeOut: new Date(),
      },
      {
        where: {
          employeeId: req.user?.id,
        },
      }
    );
    successHandler(res, 200, "successful");
  }
);

const getAttendanceController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = req.params.employeeId;
    console.log(req.params);
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const attendance_result = await Attendance.findAndCountAll({
      where: {
        employeeId: employeeId,
      },
      limit: limit,
      offset: offset,
      order: [["date", "DESC"]],
      include: [
        {
          model: User,
          as: "employee_details", // must match the alias used in Attendance.belongsTo(User, { as: 'employee' })
          attributes: ["id", "name", "email", "role"], // select only required user fields
          required: false,
        },
      ],
    });

    successHandler(res, 200, "successfully retrieved", attendance_result);
  }
);

export {
  markAttendanceController,
  markTimeOutController,
  getAttendanceController,
};
