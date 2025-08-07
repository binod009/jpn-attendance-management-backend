import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { Authentication, authorizeRoles } from "../middleware/auth.middleware";
import { createLeaveRequestController } from "../controller/leave_request.controller";
const leave_request_routes = Router();

leave_request_routes.post(
  "/create",
  Authentication,
  authorizeRoles("Employee"),
  createLeaveRequestController
);

export default leave_request_routes;
