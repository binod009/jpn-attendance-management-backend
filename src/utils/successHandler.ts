import { Response } from "express";

function successHandler(
  res: Response,
  statusCode = 200,
  message: string,
  result?: any
) {
  return res.status(statusCode).json({
    statusCode,
    message,
    result,
  });
}

export default successHandler;
