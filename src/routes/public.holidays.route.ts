import { Router } from "express";
import { Authentication, authorizeRoles } from "../middleware/auth.middleware";
import createPublicHolidaysController from "../controller/public._holidays.controller";

const public_holiday_routes = Router();

public_holiday_routes.post(
  "/create",
  Authentication,
  authorizeRoles("Admin"),
  createPublicHolidaysController
);

export default public_holiday_routes;
