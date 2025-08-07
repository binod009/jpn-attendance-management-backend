import { Router } from "express";
import auth_routes from "./auth.routes";
import attendance_routes from "./attendance.routes";
import leave_request_routes from "./leave._request.routes";

const app_routes = Router();

app_routes.use("/auth", auth_routes);
app_routes.use("/attendance", attendance_routes);
app_routes.use("/leave", leave_request_routes);
export default app_routes;
