import { Router } from "express";
import { Authentication } from "../middleware/auth.middleware";
import { registerUserController } from "../controller/auth.controller";

const auth_routes = Router();

auth_routes.post("/register",Authentication,registerUserController)


export default auth_routes;