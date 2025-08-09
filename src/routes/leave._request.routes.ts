import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { Authentication, authorizeRoles } from "../middleware/auth.middleware";
import {
  createLeaveRequestController,
  getLeaveRequestController,
  leaveRequestActionController,
} from "../controller/leave_request.controller";
import { getAttendanceController } from "../controller/attendance.controller";
const leave_request_routes = Router();

leave_request_routes.post(
  "/create",
  Authentication,
  authorizeRoles("Employee"),
  createLeaveRequestController
);
leave_request_routes.get("/list", getLeaveRequestController);
leave_request_routes.get("/list/:employee_id", getLeaveRequestController);
leave_request_routes.post("/update/:employee_id", leaveRequestActionController);


export default leave_request_routes;
