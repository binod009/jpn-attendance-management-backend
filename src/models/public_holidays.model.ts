import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../config/database";
import {
  PublicHolidayCreationAttributes,
  PublicHolidaysAttributes,
} from "../interface/model/public_holidays.interface";

const PublicHolidayModel = (sequelize: Sequelize) => {
  class PublicHoliday extends Model<
    PublicHolidaysAttributes,
    PublicHolidayCreationAttributes
  > {
    public id?: number;
    public date!: Date;
    public region?: string;
    public country?: string;
    public created_at?: Date;
    public updated_at?: Date;
  }
  PublicHoliday.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      region: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
      {
          sequelize,
          modelName: "PublicHoliday",
          tableName: "public_holidays",
          createdAt: "created_at",
          updatedAt: "updated_at",
          hooks: {
              beforeCreate: (public_holiday) => {
                  public_holiday.created_at = new Date();
                  public_holiday.updated_at = new Date();
              },
          },
      }
    );
    return PublicHoliday
};

export default PublicHolidayModel;
