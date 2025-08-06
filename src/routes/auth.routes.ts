import { Router } from "express";
import { Authentication } from "../middleware/auth.middleware";
import {
  getUserController,
  loginController,
  refreshTokenController,
  registerUserController,
} from "../controller/auth.controller";

const auth_routes = Router();

auth_routes.post("/register", registerUserController);
auth_routes.post("/login", loginController);
auth_routes.get("/user", Authentication, getUserController);
auth_routes.get("/refresh-token", refreshTokenController);

export default auth_routes;
