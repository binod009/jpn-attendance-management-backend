import { LeaveRequest } from "../models";
import asyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";
import successHandler from "../utils/successHandler";

const createLeaveRequestController = asyncHandler(
  async (req: Request, res: Response) => {
    const { leave_type, reason, start_date, end_date } = req.body;
    const employeeId = req.user?.id!;
    const leave_result = await LeaveRequest.create({
      employeeId,
      leave_type,
      reason,
      start_date,
      end_date,
    });
    successHandler(res, 201, "leave request created", leave_result);
  }
);
export {
    createLeaveRequestController
}