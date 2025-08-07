import sequelize, { DataTypes, Model, Sequelize } from "sequelize";
import { SetRequired } from "sequelize/types/utils/set-required";
import {
  TokenAttributes,
  TokenCreationAttributes,
} from "../interface/model/token.interface";

const tokenModel = (sequelize: Sequelize) => {
  class Token extends Model<TokenAttributes, TokenCreationAttributes> {
    public id!: number;
    public userId!: number;
    public token!: string;
    public created_at?: Date;
    public updated_at?: Date;
  }
  Token.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      is_archived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "created_at",
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "updated_at",
      },
    },
    {
      sequelize,
      modelName:"Token",
      tableName: "token",
      createdAt: "created_at",
      updatedAt: "updated_at",
      timestamps: true,
      hooks: {
        beforeCreate: (token) => {
          token.created_at = new Date();
          token.updated_at = new Date();
        },
        beforeUpdate: (token) => {
          token.updated_at = new Date();
        },
      },
    }
  );
  return Token;
};

export default tokenModel;
