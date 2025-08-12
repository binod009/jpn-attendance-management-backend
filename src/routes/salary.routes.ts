import { Router } from "express";
import { calculateEmployeeSalaryController } from "../controller/salary.controller";

const salary_routes = Router();

salary_routes.get("/employee", calculateEmployeeSalaryController);

export default salary_routes;
