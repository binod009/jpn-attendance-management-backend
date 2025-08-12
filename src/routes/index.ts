import { Router } from "express";
import auth_routes from "./auth.routes";
import attendance_routes from "./attendance.routes";
import leave_request_routes from "./leave._request.routes";
import public_holiday_routes from "./public.holidays.route";
import salary_routes from "./salary.routes";

const app_routes = Router();

app_routes.use("/auth", auth_routes);
app_routes.use("/attendance", attendance_routes);
app_routes.use("/leave", leave_request_routes);
app_routes.use("/holiday", public_holiday_routes);
app_routes.use("/salary", salary_routes);
export default app_routes;
