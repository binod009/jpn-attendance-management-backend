import { Router } from "express";
import auth_routes from "./auth.routes";

const app_routes = Router();
app_routes.use("/auth", auth_routes);
export default app_routes;