import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError";
import config from "../config/configuration";

const JWT_SECRET = config.JWT_SECRET;

export interface AuthRequest extends Request {
  user?: any;
}

const Authentication = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  console.log("this is auth header", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Authorization header missing or malformed", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (err) {
    throw new AppError("Invalid or expired token", 401);
  }
};

const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role ?? "";
    if (!roles.includes(role)) {
      return next(new AppError("forbidden:Access denied", 403));
    }
    next();
  };
};
export { authorizeRoles, Authentication };
