import { LeaveRequest } from "../models";
import asyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";
import successHandler from "../utils/successHandler";
import { TLeaveStatus } from "../interface/model/leave_requests.interface";
import Leave_svc from "../services/leave.services";
import { stat } from "fs";

const createLeaveRequestController = asyncHandler(
  async (req: Request, res: Response) => {
    const { leave_type, reason, start_date, end_date, status } = req.body;
    const employee_id = req.user?.id!;
    const leave_result = await LeaveRequest.create({
      employee_id,
      leave_type,
      reason,
      status,
      start_date,
      end_date,
    });
    successHandler(res, 201, "leave request created", leave_result);
  }
);

const leaveRequestActionController = asyncHandler(
  async (req: Request, res: Response) => {
    const employee_id = parseInt(req.params.employee_id as string);
    const status = req.query.status as TLeaveStatus;
    await LeaveRequest.update(
      {
        status,
      },
      {
        where: {
          employee_id: employee_id,
        },
      }
    );
    successHandler(res, 201, "successful");
  }
);

const getLeaveRequestController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("inside req");
    const { limit = 10, offset = 0, status } = req.query;
    const { employee_id } = req.params;
    const leave_result = await Leave_svc.getLeaveListService({
      query: {
        limit: Number(limit),
        offset: Number(offset),
        status: (status as "pending" | "accepted" | "rejected") || "pending",
      },
      params: {
        employee_id: employee_id ? Number(employee_id) : null,
      },
    });
    successHandler(res, 200, "retrieved successful", leave_result);
  }
);
export {
  createLeaveRequestController,
  leaveRequestActionController,
  getLeaveRequestController,
};
