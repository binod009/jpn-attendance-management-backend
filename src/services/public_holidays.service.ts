import { PublicHoliday } from "../models";
type TCreateHolidayService = {
  body: {
    date: Date;
    region?: string;
    country?: string;
  };
};

class PublicHolidayService {
  createHolidayService = async ({ body }: TCreateHolidayService) => {
    const { date, region, country } = body;
    const result = await PublicHoliday.create({
      date,
      region,
      country,
    });

    return result.dataValues;
  };
}

export default new PublicHolidayService();
