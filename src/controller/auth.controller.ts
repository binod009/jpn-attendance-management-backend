import { Token, User } from "../models";
import AppError from "../utils/appError";
import asyncHandler from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import successHandler from "../utils/successHandler";
import config from "../config/configuration";
import { parse } from "dotenv";

const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("BODY=-=-=-=-=====================>", req.body);
    const { email, name, password, phone, address, role } = req.body;

    if (!name || !email || !password || !role) {
      throw new AppError("All fields are required", 400);
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError("User already exists", 409);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      result: newUser,
    });
  }
);

const loginController = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError("required field is empty", 400);
  }
  const db_user = await User.findOne({
    where: {
      email: email,
    },
  });
  if (!db_user?.dataValues) {
    throw new AppError("user does not exist", 404);
  } else {
    const is_password_matched = bcrypt.compareSync(
      password,
      db_user?.dataValues?.password
    );
    const payload = {
      id: db_user.dataValues.id,
      username: db_user.dataValues?.name,
      role: db_user.dataValues.role,
    };

    const access_token = jwt.sign(payload, config.JWT_SECRET as string, {
      expiresIn: "15m",
    });

    const refresh_token = jwt.sign(
      { id: db_user.dataValues.id },
      config.JWT_REFRESH_SECRET as string,
      {
        expiresIn: "7d",
      }
    );
    await Token.create({
      userId: db_user.dataValues.id,
      token: refresh_token,
    });
      
    res.cookie("jwt_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });
  }

  successHandler(res, 200, "logged in successfull", db_user?.dataValues);
});

const refreshTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const refresh_token = req.cookies.refresh_token;
    if (!refresh_token) {
      throw new AppError("refresh token not provided", 404);
    }
    const decode = jwt.verify(
      refresh_token,
      config.JWT_REFRESH_SECRET as string
    ) as { id: number };
    const user = await User.findByPk(decode.id);
    if (!user) {
      throw new AppError("invalid refresh token user");
    }
    const access_token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      config.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    const new_refresh_token = jwt.sign(
      { id: user.id },
      config.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" }
    );
    res.cookie("jwt_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "strict",
    });

    res.cookie("refresh_token", new_refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
    });
    res.status(200).json({
      message: "Token Refreshed",
    });
  }
);

const getUserController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.query;
  const user = User.findAll({
    where: {
      id: Number(id),
    },
  });
  successHandler(res, 200, "successfully retrived", user);
});

export {
  registerUserController,
  loginController,
  refreshTokenController,
  getUserController,
};
