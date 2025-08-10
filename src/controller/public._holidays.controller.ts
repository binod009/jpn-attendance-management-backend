import { count } from "console";
import asyncHandler from "../utils/asyncHandler";
import holiday_svc from "../services/public_holidays.service";
import { Request, Response } from "express";
import successHandler from "../utils/successHandler";
const createPublicHolidaysController = asyncHandler(
  async (req: Request, res: Response) => {
    const { date, country, region } = req.body;
    const public_holiday_result = await holiday_svc.createHolidayService({
      body: {
        date,
        ...(country && { country }),
        ...(region && { region }),
      },
    });
    successHandler(res, 201, "created", public_holiday_result);
  }
);

export default createPublicHolidaysController;
