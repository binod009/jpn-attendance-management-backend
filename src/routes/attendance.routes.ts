import { Router } from "express";
import { Authentication, authorizeRoles } from "../middleware/auth.middleware";
import {
  getAttendanceController,
  markAttendanceController,
} from "../controller/attendance.controller";

const attendance_routes = Router();

attendance_routes.post(
  "/mark",
  Authentication,
  authorizeRoles("Employee"),
  markAttendanceController
);
attendance_routes.get(
  "/list/:employeeId",
  Authentication,
  authorizeRoles("Manager", "Admin", "Employee"),
  getAttendanceController
);

// optional feature left to implement
/* when employee leave the office the time can be register at database*/

export default attendance_routes;
